import realm from '../components/realm';
import scripts from './scripts';
const Realm = require('realm');

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

// TODO: Determine if realm sync should be instantiated using class inheritance pattern
/**
 * Realm sync provides CRUD functions to provide syncing functionality to the database.
 * @constructon {String} - path - the path of the realm database.
 *              If not declared, default database is used.
 */
class RealmSync {
  constructor(path, schema) {
    schema = schema || [];
    schema.push(SyncQueue);

    if (path) {
      this.realm = new Realm({path: path, schema: schema});
    } else {
      this.realm = new Realm({schema: schema})
    }
  }

  /**
   * Creates an object in the database. Appends a unique guid to the object.
   * @param {Object.type} type
   * @param {Object} properties
   * @param {Object} update
   * @returns {type}
   */
  create(type, properties, update) {
    update = update || false;
    try {
      // TODO: Check that the assigned guid is unique
      properties.realmSyncId = scripts.generateGuid();
      let savedObject = this.realm.create(type, properties, update);
      //
      scripts.addObjectToSyncQueue(type, savedObject, this.realm);
      return savedObject;
    } catch(error) {
      console.log("ERROR", error);
    }
  }

  // TODO: Determine if delete keyword can be used as a method in a class
  delete(realmObject) {

    let allRealmSyncIds = [];

    //Add realmSyncId's of deleted items to array
    if(realmObject.constructor.name === "Results") {
      realmObject.forEach(object => {
        allRealmSyncIds.push(object.realmSyncId);
      });
    } else {
      allRealmSyncIds.push(realmObject.realmSyncId);
    }

    try {
      this.realm.delete(realmObject);
      //After deleting, update syncQueue
      allRealmSyncIds.forEach(function(id) {
        scripts.deleteObjFromLocalChanges(id);
      });
    } catch(error) {
      console.log(error);
    }
  }
}

class SyncQueue {}
SyncQueue.schema = {
  name: 'SyncQueue',
  properties: {
    usn: Realm.Types.INT,
    realmSyncId: Realm.Types.STRING,
    type: Realm.Types.STRING,
    body: Realm.Types.STRING,
    modified: Realm.Types.INT
  }
};

realmSync.RealmSync = RealmSync;
module.exports = realmSync;
