/**
 * Get the count from the remote storage for last sync.
 * @return remote storage's last sync count.
 */
module.exports.getSyncCount = function() {

};

/**
 * Synchronizes the data received from the remote storage to the local database.
 * @param {object} syncChunk - contains all data from the remote storage that must be
 *     synced in local database.
 * @pre - No conflicts are detected in sync data
 * @post = The database will be in sync with remote storage
 * @return true indicating sync is successful, otherwise failure
 */
module.exports.localSyncFromServer = function(realm, syncChunk) {
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
 * @param realm
 * @return {JSON} contains objects to sync to remote storage
 */
module.exports.localSyncQueuePush = function(realm) {
  // Determine
  var syncQueue = realm.objects('SyncQueue');
  return JSON.stringify(syncQueue.slice());
};

/**
 * Incremental pull from remote storage.
 */
module.exports.incrementalSyncFromServer = function(realm, syncChunk) {
  // noConflict bucket
  // conflict bucket
  // Pull sync chunk from remote storage
  // For each item in the chunk
    // if the sync queue does not have this guid
      // add to noConflict bucket
    // else a possible conflict
      // add to conflict bucket
  // pass no conflict bucket to localSyncFromServer
  // pass conflict bucket to conflict manager
};

/**
 * Handle conflict based on policy
 * @param realm
 * @param syncChunk
 * @param policy {function(localObject, remoteObject)}
 */
module.exports.conflictManager = function(realm, syncChunk, policy) {
  // Create an empty resolved bucket

  // For each item in the sync chunk
    // For each sync queue conflict
      // TODO: Validate logic
      // Apply the policy on the remote and local object
      // Store the results in the resolved bucket based on guid
  // pass resolved bucket to localSyncFromServer
};

