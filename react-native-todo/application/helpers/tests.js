// import realm from '../components/realm';
import rnfs from 'react-native-fs';
const Realm = require('realm');

module.exports.runTests = function() {
  var realm; // = new Realm();
  // debugger;
  var basePath = Realm.defaultPath.split('/');
  basePath.splice(basePath.length - 1, 1);
  basePath = basePath.join('/');
  var realm1Path = basePath + '/realm1.realm';
  var realm2Path = basePath + '/realm2.realm';
  console.log('Realm Path1', realm1Path, 'Realm Path2', realm2Path);
  // Delete any existing test databases
  // testSetup(realm1Path1, realm1Path2);
  // Create the realm database
  //realm1 = new Realm({path: 'test1.realm'});

  // Add a test schema to the database
};

// TODO: Migrate over test cases
var testSetup = function(path1, path2) {
  // Delete the realm test database
  rnfs.stat(path1)
    .then(function(stats) {
    if (stats) {
      rnfs.unlink(path1)
        .then(function(result) {

      })
    }
  })
  .catch(function(err) {
    console.log(err);
  });
  //done();
};

/**
 * Test the functionality of interacting with the local
 */
var testDatabaseInteraction = function() {
  // it('should save locally and retreive it', function(done) {
  var test1 = function test1() {  // Save a test object to the database using syncCreate

    // Test that data can be removed
    done();
  }();

  // it('should add a unique identifier to the data saved', function(done) {
  var test2 = function() {
    //done();
  }();

  // it('should update a specific value in an existing item', function(done) {
  var fest3 = function() {

    // done();
  }();

  // it('should delete an item from the database', function(done) {
  var test4 = function() {

    // done();
  }();
};

/**
 * 'Authentication with service'
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
 * Test syncronization with the remote AWS cloud store.
 * Database synchronization with remote database.
 */
var testRemoteSync = function() {
  // it('should receive data from remote database based on synchronization', function(done) {
  var test1 = function() {
    // done();
  }();

  // it('should ...', function(done) {
  var test2 = function() {
    //done();
  }();
};

/**
 * 'Database restoration through synchronization with another database'
 */
var testSyncLocally = function() {

  //it('should provide a 0 sync count for a newly initialized database', function(done) {
  var test1 = function() {
    //done();
  }();

  //it('should increment the sync count when data is passed to the external store', function(done) {
  var test2 = function() {

    // done();
  }();

  // it('should send data when the local store\'s sync is lower than the external\'s sync count', function(done) {
  var test3 = function() {
    // done();
  }();
};


/**
 * Conflict resolution
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
