let syncType = 'SyncQueue';

/**
 * Get the count from the local storage for last sync.
 * @param realm {Realm} - an instance of realm
 * @return remote storage's last sync count.
 */
getSyncCount = function(realm) {
  // TODO: Implement and determine if implementation needed
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
  // For each usn apply object to database
  usnNumbers.forEach(function(usn, index, collection) {
    var realmSyncID = syncChunk[usn].realmSyncId;
    var type = syncChunk[usn].type;
    var object = syncChunk[usn].body;
    var filteredText = 'realmSyncId = "' + realmSyncID + '"';
    let objectToBeModified = realm.objects(type).filtered(filteredText);
    if (objectToBeModified.length !== 0) {
      objectToBeModified = syncChunk[usn].body;
    } else {
      realm.write(() => {
        realm.create(type, JSON.parse(object));
      });
    }
  });
};

/**
 * Creates a sync chunk to push the sync queue to remote storage.
 * @param realm {Realm} - an instance of realm
 * @return {JSON} contains objects to sync to remote storage
 */
localSyncQueuePush = function(realm) {
  // Determine
  var syncQueue = realm.objects('SyncQueue');
  return JSON.stringify(syncQueue.slice());
};

/**
 * Incremental pull from remote storage.
 * @param realm {Realm} - an instance of realm
 * @param syncChunk {Object} - numerical keys that reference the usn and the sync object
 * @param policy {function(localObject, remoteObject)} - resolves conflicts between an
 *        item in the sync queue and the sync chunk
 */
incrementalSyncFromServer = function(realm, syncChunk, policy) {
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
 * @param policy {function(localObject, remoteObject)}
 */
conflictManager = function(realm, syncChunk, policy) {
  // TODO: Implement
  // Create an empty resolved bucket

  // For each item in the sync chunk
    // For each sync queue conflict
      // TODO: Validate logic
      // Apply the policy on the remote and local object
      // Store the results in the resolved bucket based on guid
  // pass resolved bucket to localSyncFromServer
};

module.exports = {
  incrementalSyncFromServer: incrementalSyncFromServer,
  localSyncFromServer: localSyncFromServer,
  localSyncQueuePush: localSyncQueuePush
};