import realm from '../components/realm';


var clientDbCache = {}
var usn = 0;


var addObjToLocalChanges = function(obj) {
  var returnObj = {}
  returnObj.usn = usn++;
  returnObj.realmSyncId = obj.realmSyncId;
  var body = {}
  for(var key in obj) {
    body[key] = obj[key];
  }
  returnObj.body = JSON.stringify(body);
    try {
      let syncQueue = realm.create('SyncQueue', returnObj);
    } catch(error) {
      console.log("ERROR in syncQueue write", error);
    }
}

var deleteObjFromLocalChanges = function(realmSyncId) {
  // clientDbCache[realmSyncId]['usn'] = usn++;
  // clientDbCache[realmSyncId]['body'] = undefined;
  // console.log('item deleted. current USN: ', usn );
  var filterText = 'realmSyncId = "' + realmSyncId + '"'
  let objToDelete = realm.objects('SyncQueue').filtered(filterText);
  objToDelete[0].usn = ++usn;
  objToDelete[0].body = "";
}



var itemsInLocalChanges = function() {
  return JSON.stringify(clientDbCache);
}

var generateGuid = function() {
  var result, i, j;
  result = '';
  for(j=0; j<16; j++) {
    if( j == 8 || j == 12|| j == 16|| j == 20)
      result = result + '-';
    i = Math.floor(Math.random()*16).toString(16).toUpperCase();
    result = result + i;
  }
  return result;
}
var names = ["Afghanistan", "Åland Islands", "Albania", "Algeria", "American Samoa", "AndorrA", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, The Democratic Republic of the", "Cook Islands", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia"];

var randomName = function() {
  var randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
}

module.exports = {
  usn: usn,
  addObjToLocalChanges: addObjToLocalChanges,
  deleteObjFromLocalChanges: deleteObjFromLocalChanges,
  itemsInLocalChanges: itemsInLocalChanges,
  generateGuid: generateGuid,
  randomName: randomName
}
