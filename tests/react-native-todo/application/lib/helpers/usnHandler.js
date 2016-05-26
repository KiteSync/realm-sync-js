var usn;

/**
 * Gets the highest usn from local realm database
 * @param {Realm} realm - instance of realm object
 */
var getHighestLocalUsn = function(realm) {
  let syncQueue = realm.objects('SyncQueue').sorted('usn', true);
  usn = syncQueue[0] ? syncQueue[0].usn : 0;
};

var getCurrentUsn = function() {
  return usn;
};

var incrementAndReturnUsn = function() {
  return ++usn;
};

//setUsnToValue sets the usn to value passed in
var setUsnToValue = function(val) {
  usn = val;
};

module.exports = {
  getCurrentUsn: getCurrentUsn,
  incrementAndReturnUsn: incrementAndReturnUsn,
  setUsnToValue: setUsnToValue,
  getHighestLocalUsn: getHighestLocalUsn
};
