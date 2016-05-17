// import realm from '../../components/realm';
import usnHandler from './usnHandler';

/**
 * description here
 * @param  something here
 * @post
 * @return something here
*/

var addObjectToSyncQueue = function(realm, type, obj, realmParam) {
  var returnObj = {}
  returnObj.usn = usnHandler.incrementAndReturnUsn();
  returnObj.realmSyncId = obj.realmSyncId;
  returnObj.type = type;
  returnObj.modified = Date.now();
  var body = {}
  for(var key in obj) {
    body[key] = obj[key];
  }
  returnObj.body = JSON.stringify(body);
    try {
      // Added to work with RealmSync class
      if (realmParam) {
        let syncQueue = realmParam.create('SyncQueue', returnObj);
      } else {
        let syncQueue = realm.create('SyncQueue', returnObj);
      }
    } catch(error) {
      console.log("ERROR in syncQueue write", error);
    }
}



var deleteObjFromLocalChanges = function(realm, realmSyncId) {
  var filterText = 'realmSyncId = "' + realmSyncId + '"'
  let objToDelete = realm.objects('SyncQueue').filtered(filterText);

  objToDelete[0].usn = usnHandler.incrementAndReturnUsn();
  objToDelete[0].modified = Date.now();
  objToDelete[0].body = "";
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
  addObjectToSyncQueue: addObjectToSyncQueue,
  deleteObjFromLocalChanges: deleteObjFromLocalChanges,
  generateGuid: generateGuid,
  randomName: randomName
}
