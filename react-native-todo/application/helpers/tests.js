// import realm from '../components/realm';
import rnfs from 'react-native-fs';
const Realm = require('realm');
const schemas = require('./schemas');
const realmSync = require('./realmSync');
var chai = require('chai');
let expect = chai.expect;
var realm1;
var realm2;

let personType = 'PersonObject';

module.exports.runTests = function() {
  var realm; // = new Realm();
  // debugger;
  var basePath = Realm.defaultPath.split('/');
  basePath.splice(basePath.length - 1, 1);
  basePath = basePath.join('/');
  var realm1Path = 'realm1.realm';
  var realm2Path = 'realm2.realm';
  console.log('Realm Path1', realm1Path, 'Realm Path2', realm2Path);
  // Delete any existing test databases
  // testSetup(basePath + '/' + realm1Path, basePath + '/' + realm2Path);
  // Create the realm database
  let realm1 = new Realm({
    path: realm1Path,
    schema: [schemas.PersonObject]
  });
  // realm.write
  let persons = realm1.objects('PersonObject');
  realm1.write(() => {
    realm1.delete(persons);
  });

  var databaseTestResults = testDatabaseInteraction(realm1);
  // Add a test schema to the database
};

// TODO: Migrate over test cases
var clearDatabase = function(path1, path2) {
  /* Delete all values in database realm test database
    //done();
    */
  let persons = realm1.objects('PersonObject');
  realm1.write(() => {
    realm1.delete(persons);
  });
};

/**
 * Test the functionality of interacting with the local
 */
var testDatabaseInteraction = function(realm) {
  // it('should save locally and retreive it', function(done) {
  var test1 = function test1() {  // Save a test object to the database using syncCreate
    // Test that data can be removed
    expect(realm.objects('PersonObject')[0]).equals(undefined);
    // TODO: Change create to createSync
    realm.write(function() {
      realm.create(personType, {name: 'test1', age: 30, married: true});
    });
    var person = realm.objects(personType);
    expect(person.length).equals(1);
    // done();
  }();

  // it('should add a unique identifier to the data saved', function(done) {
  var test2 = function() {
    var person = realm.objects(personType);
    // TODO: Uncomment test
    // expect(person[0].realmSyncId).to.exist;
    //done();
  }();

  // it('should update a specific value in an existing item', function(done) {
  var test3 = function() {

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
