var React = require('react-native');
var {AsyncStorage} = React;
var syncCountKey = 'lastSyncCount';

/**
 * Set to the latest highest sync count
 * @param {int} newCount - the new count to be set for highest count.
 * @param {function(updatedCount)} callback - called with current syncCount
 */
setLastSyncCount = function(newCount, callback) {
  if (typeof newCount === 'number') {
    newCount = newCount.toString();
  }
  AsyncStorage.setItem(syncCountKey, newCount).then(() => {
    callback(newCount);
  });
};

/**
 * Get the latest highest sync count. If no sync count is found, initialize to 0.
 * @param {function(syncCount)} callback - called with current syncCount.
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
 * synced objects as the body.
 * @param data {[]} - array of synced data received from remote service.
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
 * @return true indicating sync is successful, otherwise an error.
 */
localSyncFromServer = function(realm, syncChunk) {
  // Get the keys and sort them numerically
  var usnNumbers = Object.keys(syncChunk);
  usnNumbers.sort(function(num, otherNum) {return num - otherNum;});
  realm.write(() => {
    // For each usn apply object to database
    usnNumbers.forEach(function (usn, index, collection) {
      if(syncChunk[usn].body === "DELETED") {
        var realmSyncID = syncChunk[usn].realmSyncId;
        var type = syncChunk[usn].type;
        var filteredText = 'realmSyncId = "' + realmSyncID + '"';
        let objectToBeDeleted = realm.objects(type).filtered(filteredText);
        realm.delete(objectToBeDeleted);
      } else {
        var type = syncChunk[usn].type;
        var object = JSON.parse(syncChunk[usn].body);
        realm.create(type, object, true);
      }
    });
  });
};

/**
 * Creates a sync chunk to push the sync queue to remote service.
 * @param realm {Realm} - an instance of realm.
 * @return {Array} contains objects to sync to remote service.
 */
localSyncQueuePush = function(realm) {
  var syncQueue = realm.objects('SyncQueue');
  return syncQueue.slice();
};

/**
 * Incremental pull from remote service.
 * @param realm {Realm} - an instance of realm
 * @param syncChunk {Object} - numerical keys that reference the usn and the sync object
 * @param policy {function(localObject, remoteObject)} - resolves conflicts between an
 *        item in the sync queue and the sync chunk
 */
incrementalSync = function(realm, syncChunk, policy) {
  var noConflictBucket = {};
  var conflictBucket = {};
  // Sift through sync chunk and divide between conflict and non conflict updates
  var usnNumbers = Object.keys(syncChunk);
  usnNumbers.sort(function(num, otherNum) {return num - otherNum;});
  usnNumbers.forEach(function(usn) {
    // console.log("incrementalSync (usn): " + usn);
    var realmSyncID = syncChunk[usn].realmSyncId;
    var type = syncChunk[usn].type;
    var object = syncChunk[usn].body;
    var filteredText = 'realmSyncId = "' + realmSyncID + '"';
    var syncObject = realm.objects('SyncQueue').filtered(filteredText);
    // if the sync queue does not have this realm sync id, no conflict is detected
    if (syncObject.length === 0) {
      noConflictBucket[usn] = syncChunk[usn];
    } else {
      conflictBucket[usn] = syncChunk[usn];
    }
  });
  // do a full sync on no conflict bucket
  localSyncFromServer(realm, noConflictBucket);
  // pass conflict bucket to conflict manager for resolution
  conflictManager(realm, conflictBucket, policy);
};

/**
 * Handle conflict based on policy.
 * @param realm {Realm} - an instance of realm.
 * @param syncChunk {Object} - numerical keys that reference the usn and the sync object.
 * @param remoteServiceWins {function(localObject, remoteObject)} returns true if remoteServiceWins, causing
 *        the local object to be removed from the sync queue, otherwise false.
 */
conflictManager = function(realm, syncChunk, remoteServiceWins) {
  // Create an empty resolved bucket, a bucket of changes to be applied to the bucket.
  var resolvedBucket = {};
  var usnNumbers = Object.keys(syncChunk);
  usnNumbers.sort(function(num, otherNum) {return num - otherNum;});
  for (let usn of usnNumbers) {
    var realmSyncID = syncChunk[usn].realmSyncId;
    var remoteObject = syncChunk[usn].body;
    var filteredText = 'realmSyncId = "' + realmSyncID + '"';
    var localObject = realm.objects('SyncQueue').filtered(filteredText)[0];
    if (remoteServiceWins(localObject, syncChunk[usn])) {
      // delete this from the sync queue
      realm.write(() => {
        realm.delete(localObject);
      });
      resolvedBucket[usn] = syncChunk[usn];
    }
  }
  // pass resolved bucket to localSyncFromServer
  localSyncFromServer(realm, resolvedBucket);
};

/**
 * Determines if the remote object wins a sync conflict based on modified time.
 * @param localObject {Object} - a local object stored in the local library.
 * @param remoteObject {Object} - a remote object stored in the remote service.
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
