// import realm from '../../components/realm';
import usnHandler from './usnHandler';

/**
 * Adds or updates an object in the syncQueue when
 * an object is added to the database
 * @param realm database object
 * @param {string} database class
 * @param {obj} database class updates
 */
var addObjectToSyncQueue = function(realm, type, obj) {
  // TODO: Only search syncQueue for object to update for updates

  var filterText = 'realmSyncId = "' + obj.realmSyncId + '"'
  let objToUpdate = realm.objects('SyncQueue').filtered(filterText);

  var returnObj = {
    usn: usnHandler.incrementAndReturnUsn(),
    realmSyncId: obj.realmSyncId,
    type: type,
    modified: Date.now(),
    body: JSON.stringify(obj)
  }

  try {
    if(objToUpdate.length === 0) {
      realm.create('SyncQueue', returnObj);
    } else {
      for(key in returnObj) {
        objToUpdate[0][key] = returnObj[key];
      }
    }
  } catch(error) {
    console.log("ERROR in syncQueue write", error);
  }
}

/**
 * Remove objects from syncQueue (after successful sync)
 * @param realm database object
 * @param {string} database class
 * @param {obj} database class updates
 */
var addObjectToSyncQueue = function(realm, type, obj) {
  // TODO: Only search syncQueue for object to update for updates

  var filterText = 'realmSyncId = "' + obj.realmSyncId + '"'
  let objToUpdate = realm.objects('SyncQueue').filtered(filterText);

  var returnObj = {
    usn: usnHandler.incrementAndReturnUsn(),
    realmSyncId: obj.realmSyncId,
    type: type,
    modified: Date.now(),
    body: JSON.stringify(obj)
  }

  try {
    if(objToUpdate.length === 0) {
      realm.create('SyncQueue', returnObj);
    } else {
      for(key in returnObj) {
        objToUpdate[0][key] = returnObj[key];
      }
    }
  } catch(error) {
    console.log("ERROR in syncQueue write", error);
  }
}


/**
 * Updates USN and Removes the body from item in syncQueue \
 * to indicate its been deleted.
 * @param realm database object
 * @param {string} realm sync id
 */
var markSyncQueueObjectAsDeleted = function(realm, realmSyncId) {
  var filterText = 'realmSyncId = "' + realmSyncId + '"'
  let objToDelete = realm.objects('SyncQueue').filtered(filterText);

  objToDelete[0].usn = usnHandler.incrementAndReturnUsn();
  objToDelete[0].modified = Date.now();
  objToDelete[0].body = "";
}


/**
 * Generates a 'unique' id.
 * Used for initalizing a new db object with a realmSyncId
 * @returns {string} eg: "1A2EE1F7-45F7-E5F4-244C"
 */
var generateGuid = function() {
  var result, i, j;
  result = '';
  for(j=0; j<20; j++) {
    if( j == 8 || j == 12|| j == 16|| j == 20)
      result = result + '-';
    i = Math.floor(Math.random()*16).toString(16).toUpperCase();
    result = result + i;
  }
  return result;
}


module.exports = {
  addObjectToSyncQueue: addObjectToSyncQueue,
  markSyncQueueObjectAsDeleted: markSyncQueueObjectAsDeleted,
  generateGuid: generateGuid,
}
