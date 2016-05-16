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
    if (remoteServiceWins(item, syncChunk[usn])) {
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

module.exports = {
  incrementalSyncFromServer: incrementalSyncFromServer,
  localSyncFromServer: localSyncFromServer,
  localSyncQueuePush: localSyncQueuePush
};