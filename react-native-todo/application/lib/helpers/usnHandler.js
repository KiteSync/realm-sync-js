import realm from '../../components/realm';
var usn;


// Gets the highest usn from local realm database
var getHighestLocalUsn = function() {
  let syncQueue = realm.objects('SyncQueue').sorted('usn', true);
  usn = syncQueue[0] ? syncQueue[0].usn : 0;
}
getHighestLocalUsn();

var getCurrentUsn = function() {
  return usn;
}

var incrementAndReturnUsn = function() {
  return ++usn;
}

var setUsnToValue = function(val) {
  usn = val;
}


module.exports = {
  getCurrentUsn: getCurrentUsn,
  incrementAndReturnUsn: incrementAndReturnUsn,
  setUsnToValue: setUsnToValue
}
