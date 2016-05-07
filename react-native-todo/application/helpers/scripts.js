var localChangesCache = {}
var usn = 0;


var addObjToLocalChanges = function(obj) {
  var returnObj = {}
  returnObj['usn'] = usn++;
  returnObj['body'] = obj;
  localChangesCache[obj.realmSyncId] = (returnObj);
  return(JSON.stringify(returnObj));
}

var deleteObjFromLocalChanges = function(realmSyncId) {
  delete localChangesCache[realmSyncId]
  usn--
  console.log('item deleted. current USN: ', usn );
}

var itemsInLocalChanges = function() {
  return JSON.stringify(localChangesCache);
}

var generateGuid = function() {
  var result, i, j;
  result = '';
  for(j=0; j<32; j++) {
    if( j == 8 || j == 12|| j == 16|| j == 20)
      result = result + '-';
    i = Math.floor(Math.random()*16).toString(16).toUpperCase();
    result = result + i;
  }
  return result;
}


module.exports = {
  usn: usn,
  addObjToLocalChanges: addObjToLocalChanges,
  deleteObjFromLocalChanges: deleteObjFromLocalChanges,
  itemsInLocalChanges: itemsInLocalChanges,
  generateGuid: generateGuid
}
