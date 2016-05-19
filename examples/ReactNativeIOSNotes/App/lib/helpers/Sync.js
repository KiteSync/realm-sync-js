let syncType = 'SyncQueue';
var React = require('react-native');
var {AsyncStorage} = React;

var syncCountKey = 'lastSyncCount'
/**
 * Set to the latest highest Sync Count
 * @param callback with current syncCount
 */
setLastSyncCount = function(newCount, callback) {
  if (typeof newCount === 'number') {
    newCount = newCount.toString()
  }
  AsyncStorage.setItem(syncCountKey, newCount).then(() => {
    callback(newCount);
  });
}

/**
 * get the latest highest sync count
 * if no sync count is found, intiialize to 0;
 * @param callback with current syncCount
 */
getLastSyncCount = function(callback) {
  AsyncStorage.getItem(syncCountKey).then(syncCount => {
    if(syncCount) {
      callback(syncCount);
    } else {
      AsyncStorage.setItem(syncCountKey, '0').then(() => {
        callback('0');
      });
    }
  });
};



/**
 * Converts data received from a remote service into a usn keyed object with
 * sync'd objects as the body.
 * @param data {[]} - array of sync'd data received from remote service.
 * @returns {{usn: syncObject}} a sync chunk for syncing data to the local storage.
 */
convertRemoteDataToSyncChunk = function(data) {
  var syncChunk = {};
  data.forEach((obj) => {
    var usn = obj.usn;
    syncChunk[usn] = {};
    syncChunk[usn].body = obj.body;
    syncChunk[usn].modified = obj.modified;
    syncChunk[usn].realmSyncId = obj.realmSyncId;
    syncChunk[usn].type = obj.type;
  });
  return syncChunk;
};

/**
 * Synchronizes the data received from the remote storage to the local database.
 * @param realm {Realm} - an instance of realm
 * @param syncChunk {object} - contains all data from the remote storage that must be
 *        synced in local database.
 * @pre - No conflicts are detected in sync data
 * @post = The database will be in sync with remote storage
 * @return true indicating sync is successful, otherwise failure
 */
localSyncFromServer = function(realm, syncChunk) {
  // TODO: Possibly consider naming function as a full sync function
  // Get the keys and sort them numerically
  var usnNumbers = Object.keys(syncChunk);
  usnNumbers.sort(function(num, otherNum) {return num - otherNum;});
  // debugger;
  realm.write(() => { // TODO: Determine if write should be moved up further
    // For each usn apply object to database
    usnNumbers.forEach(function (usn, index, collection) {
      var realmSyncID = syncChunk[usn].realmSyncId;
      var type = syncChunk[usn].type;
      var object = JSON.parse(syncChunk[usn].body);
      var filteredText = 'realmSyncId = "' + realmSyncID + '"';
      let objectToBeModified = realm.objects(type).filtered(filteredText);
      if (objectToBeModified.length !== 0) {
        for (key in object) {
          objectToBeModified[0][key] = object[key];
        }
      } else {
        realm.create(type, object);
      }
    });
  });
};

/**
 * Creates a sync chunk to push the sync queue to remote storage.
 * @param realm {Realm} - an instance of realm
 * @return {Array} contains objects to sync to remote storage
 */
localSyncQueuePush = function(realm) {
  // Determine
  var syncQueue = realm.objects('SyncQueue');
  return syncQueue.slice();
};

/**
 * Incremental pull from remote storage.
 * @param realm {Realm} - an instance of realm
 * @param syncChunk {Object} - numerical keys that reference the usn and the sync object
 * @param policy {function(localObject, remoteObject)} - resolves conflicts between an
 *        item in the sync queue and the sync chunk
 */
incrementalSync = function(realm, syncChunk, policy) {
  // noConflict bucket
  var noConflictBucket = {};
  // conflict bucket
  var conflictBucket = {};
  // For each item in the chunk
  var usnNumbers = Object.keys(syncChunk);
  usnNumbers.sort(function(num, otherNum) {return num - otherNum;});
  usnNumbers.forEach(function(usn) {
    var realmSyncID = syncChunk[usn].realmSyncId;
    var type = syncChunk[usn].type;
    var object = syncChunk[usn].body;
    var filteredText = 'realmSyncId = "' + realmSyncID + '"';
    var syncObject = realm.objects(syncType).filtered(filteredText);
    // if the sync queue does not have this guid
    if (syncObject.length === 0) {
      // add to noConflict bucket
      noConflictBucket[usn] = syncChunk[usn];
    } else { // else a possible conflict
      // add to conflict bucket
      conflictBucket[usn] = syncChunk[usn];
    }
  });
  // pass no conflict bucket to localSyncFromServer
  localSyncFromServer(realm, noConflictBucket);
  // pass conflict bucket to conflict manager
  conflictManager(realm, conflictBucket, policy);
};

/**
 * Handle conflict based on policy
 * @param realm {Realm} - an instance of realm
 * @param syncChunk {Object} - numerical keys that reference the usn and the sync object
 * @param remoteServiceWins {function(localObject, remoteObject)} returns true if remoteServiceWins, causing
 *        the local object to be removed from the sync queue. Otherwise false.
 */
conflictManager = function(realm, syncChunk, remoteServiceWins) {
  // TODO: Implement
  // Create an empty resolved bucket, a bucket of changes to apply
  var resolvedBucket = {};
  var usnNumbers = Object.keys(syncChunk);
  usnNumbers.sort(function(num, otherNum) {return num - otherNum;});
  // For each item in the sync chunk
  for (let usn of usnNumbers) {
    // Get all records in sync queue with this guid
    var realmSyncID = syncChunk[usn].realmSyncId;
    var type = syncChunk[usn].type;
    var object = syncChunk[usn].body;
    var filteredText = 'realmSyncId = "' + realmSyncID + '"';
    var syncObject = realm.objects(syncType).filtered(filteredText);
    // For each sync queue conflict
    // Apply the policy on the remote and local object
    // If the remote service wins
    if (remoteServiceWins(syncObject[0], object)) {
      // delete this from the sync queue
      // The remote service wins all
      resolvedBucket[usn] = syncChunk[usn];
      // Store the results in the resolved bucket
    }
    // if the client service wins continue
  }
  // pass resolved bucket to localSyncFromServer
  localSyncFromServer(realm, resolvedBucket);
};

/**
 * Determines if the remote object wins a sync conflict based on modified time.
 * @param localObject {Object} - a local object stored in the local library
 * @param remoteObject {Object} - a remote object stored in the remote service
 * @returns {boolean} true if the remote service object will is the most recent object,
 *          otherwise false.
 */
timeRemoteServiceWinsPolicy = function(localObject, remoteObject) {
  return (remoteObject.modified >= localObject.modified);
};

module.exports = {
  convertRemoteDataToSyncChunk: convertRemoteDataToSyncChunk,
  incrementalSync: incrementalSync,
  localSyncFromServer: localSyncFromServer,
  localSyncQueuePush: localSyncQueuePush,
  getLastSyncCount: getLastSyncCount,
  setLastSyncCount: setLastSyncCount,
  timeRemoteServiceWinsPolicy: timeRemoteServiceWinsPolicy
};
