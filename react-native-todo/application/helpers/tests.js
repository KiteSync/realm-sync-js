import realm from '../components/realm';

var runTests = function() {

};

// TODO: Migrate over test cases
var testSetup = function() {
  var realm1;
  var realm1Path = 'realm1.realm';

  // Delete the realm database
  fs.statSync(realm1Path, function(err, stats) {
    if (err) {
      throw err;
    }
    if (stats) {
      fs.unlink(realm1Path, function(err) {

        if (err) {
          throw err;
        }
      });
      console.log(stats);
    }
  });

  // Create the realm database
  //realm1 = new Realm({path: 'test1.realm'});

  // Add a test schema to the database
  done();
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
