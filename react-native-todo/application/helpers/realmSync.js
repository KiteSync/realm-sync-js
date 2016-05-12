import realm from '../components/realm';
import scripts from './scripts';

var realmSync = {};


//Takes in the same parameters as realm.create
//https://realm.io/docs/react-native/latest/api/Realm.html#create
realmSync.create = function(type, properties, update) {
  update = update || false;
  try {
    let savedObject = realm.create(type, properties, update);
    scripts.addObjectToSyncQueue(type, savedObject);
    return savedObject;
  } catch(error) {
    console.log("ERROR", error);
  }
}

//takes in the same parameters as realm.delete
//https://realm.io/docs/react-native/latest/api/Realm.html#delete
realmSync.delete = function(realmObject) {

  let allRealmSyncIds = [];

  //Add realmSyncId's of deleted items to array
  if(realmObject.constructor.name === "Results") {
    realmObject.forEach(object => {
      allRealmSyncIds.push(object.realmSyncId);
    });
  } else {
    allRealmSyncIds.push(realmObject.realmSyncId);
  };

  try {
    realm.delete(realmObject);
    //After deleting, update syncQueue
    allRealmSyncIds.forEach(function(id) {
      scripts.deleteObjFromLocalChanges(id);
    });
  } catch(error) {
    console.log(error);
  }
}


module.exports = realmSync;
