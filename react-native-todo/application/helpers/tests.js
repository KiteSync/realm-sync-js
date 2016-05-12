const Realm = require('realm');
const schemas = require('./schemas');
const realmSync = require('./realmSync');
var chai = require('chai');
let expect = chai.expect;

let personType = 'PersonObject';

module.exports.runTests = function() {
  var realm; // = new Realm();
  var basePath = Realm.defaultPath.split('/');
  basePath.splice(basePath.length - 1, 1);
  basePath = basePath.join('/');
  var realm1Path = 'realm1.realm';
  var realm2Path = 'realm2.realm';
  // Create the realm database
  // Add a test schema to the database
  let realm1 = new Realm({
    path: realm1Path,
    schema: [schemas.PersonObject]
  });
  // Delete any existing test databases
  clearDatabase(realm1);

  // Run tests
  var databaseTestResults = testDatabaseInteraction(realm1);

};

// TODO: Migrate over test cases
var clearDatabase = function(realm1, realm2) {
  /* Delete all values in database realm test database
    //done();
    */
  if (realm1) {
    let persons = realm1.objects('PersonObject');
    realm1.write(() => {
      realm1.delete(persons);
    });
  }
  if (realm2) {
    let persons = realm1.objects('PersonObject');
    realm1.write(() => {
      realm1.delete(persons);
    });
  }
};

/**
 * Test the functionality of interacting with the local database.
 * @param {Realm} realm - realm database instance
 */
var testDatabaseInteraction = function(realm) {
  // TODO: Add test that also check the sync queue to see if the change was added
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
    var person = realm.objects(personType)[0];
    realm.write(() => {
      person.name = 'test1Updated';
    });
    // TODO: Test that the name is update using sync method
    expect(person.name).equals('test1Updated');
    // done();
  }();

  // it('should delete an item from the database', function(done) {
  var test4 = function() {
    var person = realm.objects(personType);
    expect(person.length).equals(1);
    realm.write(() => {
      // TODO: Change to delete sync
      realm.delete(person);
    });
    person = realm.objects(personType);
    expect(person.length).equals(0);
    // done();
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
 * Test synchronization with the remote AWS cloud store.
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
 * 'Database restoration through synchronization with another database.
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
