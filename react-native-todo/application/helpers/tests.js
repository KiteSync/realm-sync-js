const Realm = require('realm');
const schemas = require('./schemas');
const realmSync = require('./realmSync');
const remoteSync = require('./remoteSync');
const sync = require('./Sync');
var chai = require('chai');
let expect = chai.expect;
let personType = 'PersonObject';
let syncType = 'SyncQueue';

module.exports.runTests = function() {
  var realm; // = new Realm();
  var basePath = Realm.defaultPath.split('/');
  basePath.splice(basePath.length - 1, 1);
  basePath = basePath.join('/');
  var realmLocalPath = 'realmLocal.realm';
  var realmRemoteMockPath = 'realmRemoteMock.realm';
  // Create the realm database
  // Add a test schema to the database
  let realmLocalSync = new realmSync.RealmSync(realmLocalPath, [schemas.PersonObject]);
  let realmRemoteSyncMock = new realmSync.RealmSync(realmRemoteMockPath, [schemas.PersonObject]);
  let realmLocal = new Realm({
    path: realmLocalPath
  });
  let realmRemoteMock = new Realm({
    path: realmRemoteMockPath
  });
  // Delete any existing test databases
  clearDatabase(realmLocal, realmRemoteMock);

  console.log("Auto testing saving realm data in ", basePath);

  // Run tests
  var databaseTestResults = testDatabaseInteraction(realmLocal, realmLocalSync);
  clearDatabase(realmLocal, realmRemoteMock);
  var syncLocallyResults = testSyncLocally(realmLocal, realmRemoteMock, realmLocalSync, realmRemoteSyncMock);
  clearDatabase(realmLocal, realmRemoteMock);
  var remoteSyncResults = testRemoteSync(realmLocal, realmRemoteMock, realmLocalSync, realmRemoteSyncMock);
};

// TODO: Migrate over test cases
var clearDatabase = function(realmLocal, realmRemoteMock) {
  /* Delete all values in database realm test database
    //done();
    */
  if (realmLocal) {
    let persons = realmLocal.objects(personType);
    realmLocal.write(() => {
      realmLocal.delete(persons);
    });
    let syncQueue = realmLocal.objects(syncType);
    realmLocal.write(() => {
      realmLocal.delete(syncQueue);
    });
  }
  if (realmRemoteMock) {
    let persons = realmRemoteMock.objects(personType);
    realmRemoteMock.write(() => {
      realmRemoteMock.delete(persons);
    });

    let syncQueue = realmRemoteMock.objects(syncType);
     realmRemoteMock.write(() => {
     realmRemoteMock.delete(syncQueue);
    });
  }
};

/**
 * Test the functionality of interacting with the local database.
 * @param {Realm} realm - realm database instance
 */
var testDatabaseInteraction = function(realm, realmSync) {
  // it('should save locally and retreive it', function(done) {
  var test1 = function test1() {  // Save a test object to the database using syncCreate
    // Test that data can be removed
    expect(realm.objects('PersonObject')[0]).equals(undefined);
    realm.write(function() {
      realmSync.create(personType, {name: 'test1', age: 30, married: true});
    });
    var person = realm.objects(personType);
    expect(person.length).equals(1);
    var syncQueue = realm.objects(syncType);
    expect(syncQueue.length).equals(1);
    // done();

  }();

  // it('should add a unique identifier to the data saved', function(done) {
  var test2 = function() {
    var person = realm.objects(personType);
    expect(person[0].realmSyncId).to.exist;
    //done();
  }();

  // it('should update a specific value in an existing item', function(done) {
  var test3 = function() {
    /*
    var person = realm.objects(personType)[0];

    realm.write(() => {
      person.name = 'test1Updated';
    });
    // TODO: Test that the name is update using sync method
    expect(person.name).equals('test1Updated');
    // var syncQueue = realm.objects(syncType);
    // expect(syncQueue.length).equals(2);
    // done();
    */
  }();

  // it('should delete an item from the database', function(done) {
  var test4 = function() {
    /*
    var person = realm.objects(personType);
    expect(person.length).equals(1);
    realm.write(() => {
      // TODO: Change to delete sync
      realm.delete(person);
    });
    person = realm.objects(personType);
    expect(person.length).equals(0);
    // var syncQueue = realm.objects(syncType);
    // expect(syncQueue.length).equals(3);
    // done();
    */
  }();
};

/**
 * 'Authentication with service
 */
var testAuthenticationService = function() {
  //it('should not allow an unauthenticated user access', function(done) {
  var test1 = function() {
    //done();
  }();

  //it('should allow an authenticated user access', function(done) {
  var test2 = function() {

    // done();
  }();
};

/**
 * 'Database restoration through synchronization with another database.
 */
var testSyncLocally = function(realmLocal, realmRemoteMock, realmLocalSync, realmRemoteSyncMock) {

  // it('should sync local database from syncQueue data in remoteSync database', function(done) {
  var test1 = function() {
    // Add a person to the remote mock
    realmRemoteMock.write(() => {
      realmRemoteSyncMock.create(personType, {
        name: 'Remote Test',
        age: 20,
        married: false
      });
    });
    // Pull the sync data into a sync chunk
    var syncChunk = {};
    var syncQueue = realmRemoteMock.objects(syncType);
    syncQueue.forEach(function(item) {
      syncChunk[item.usn] = {
        realmSyncId: item.realmSyncId,
        type: item.type,
        body: item.body,
        modified: item.modified
      }
    });
    // Use the sync method on local to sync
    sync.localSyncFromServer(realmLocal, syncChunk);
    // Verify that the data updated in the local database
    var person = realmLocal.objects(personType);
    expect(person.length).to.be.above(0);
    expect(person[0].name).to.equal('Remote Test');
    expect(person[0].age).to.equal(20);
    expect(person[0].married).to.be.false;

    //done();
  }();

  // it('should send data when the local store\'s sync is lower than the external\'s sync count', function(done) {
  var test2 = function() {

    // done();
  }();
};

/**
 * Test synchronization with the remote AWS cloud store.
 */
var testRemoteSync = function(realmLocal, realmRemoteMock, realmLocalSync, realmRemoteSyncMock) {
  //it('should increment the sync count when data is passed to the external store', function(done) {
  var test2 = function() {
    // add an item to the local database
    realmLocal.write(() => {
      realmLocalSync.create(personType, {name: 'LocalTest', age: 90, married: false});
    });
    var syncQueue = sync.localSyncQueuePush(realmLocal);
    // push the sync to remote server
    remoteSync.pushLocalUpdatesToDB(syncQueue, '117165642031373', function(err, data) {
      // check highest usn
      // TODO: Check that remote server received the update
      test3();
    });
    // done();
  }();

  // it('should receive data from remote database based on synchronization', function(done) {
  var test3 = function() {
    // pull data from server to sync and load with remote chunk
    // TODO: Only get last update send in test2
    remoteSync.getUpdatesFromRemoteDB(0, '117165642031373',function(err, syncChunk) {
      sync.incrementalSyncFromServer(realmRemoteMock, syncChunk, null);
      var person = realmRemoteMock.objects(personType);
      expect(person.length).to.be.above(0);
      expect(person[0].name).to.equal('LocalTest');
      expect(person[0].age).to.equal(90);
      expect(person[0].married).to.be.false;
    });
    // done();
  };

  // it('should ...', function(done) {
  var test4 = function() {
    //done();
  }();
};

/**
 * Conflict resolution.
 */
var testConflictResolution = function() {
  // it('should resolve a conflict with same guid', function(done) {
  var test1 = function() {
    //done();
  }();

  // it('should resolve a conflict with different guid', function(done) {
  var test2 = function() {
    //done();
  }();

  // it('should resolve a conflict with different version numbers', function(done) {
  var test3 = function() {
    //done();
  }();

  // it('should resolve a conflict with same version numbers', function(done) {
  var test4 = function() {
    //done();
  }();
};
