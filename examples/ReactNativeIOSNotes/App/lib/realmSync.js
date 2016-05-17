// import realm from '../components/realm';
import scripts from './helpers/scripts';
const Realm = require('realm');
import remoteSync from './helpers/remoteSync'
import sync from './helpers/Sync';
import usnHandler from './helpers/usnHandler';


//this is for dynamoDb sync.
var React = require('react-native');
var {AsyncStorage} = React;
//var realmSync = {};

// TODO: Determine if realm sync should be instantiated using class inheritance pattern
/**
 * Realm sync provides CRUD functions to provide syncing functionality to the database.
 * @constructon {String} - path - the path of the realm database.
 *              If not declared, default database is used.
 */
class RealmSync {
  constructor(schema, path) {

    schema = schema || [];
    schema.push(SyncQueue);

    if (path) {
      this.realm = new Realm({path: path, schema: schema});
    } else {
      this.realm = new Realm({schema: schema})
    }
    usnHandler.getHighestLocalUsn(this.realm); //error being recorded here

  }

  /**
  //Takes in the same parameters as realm.create
  //https://realm.io/docs/react-native/latest/api/Realm.html#create
   * Creates an object in the database. Appends a unique guid to the object.
   * @param {Object.type} type
   * @param {Object} properties
   * @param {Object} update
   * @returns {type}
   */
  create(type, properties, update) {
    update = update || false;
    properties.realmSyncId = scripts.generateGuid();
    try {
      // TODO: Check that the assigned guid is unique
      let savedObject = this.realm.create(type, properties, update);
      scripts.addObjectToSyncQueue(this.realm, type, savedObject);
      return savedObject;
    } catch(error) {
      console.log(error);
      return error;
    }
  }

  getRealmInstance() {
    return this.realm;
  }
  //takes in the same parameters as realm.delete
  //https://realm.io/docs/react-native/latest/api/Realm.html#delete
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
      allRealmSyncIds.forEach((id) => {
        scripts.deleteObjFromLocalChanges(this.realm, id);
      });
    } catch(error) {
      console.log(error);
    }
  }

  sync() {
    // if last sync date is never and USN is 0:
    var userId = '';
    AsyncStorage.getItem('authData').then((authData) => {
      if(authData) {
        authData = JSON.parse(authData);
      }
      userId += authData.userId;
      remoteSync.getUpdatesFromRemoteDB(0, userId, function(error, data){
        if (error) {
          console.log('Error', error);
        } else {
          console.log(data);
          var syncChunk = sync.convertRemoteDataToSyncChunk(data);
          sync.localSyncFromServer(this.realm, syncChunk);
        }
      });

      var updates = sync.localSyncQueuePush(this.realm);
      remoteSync.pushLocalUpdatesToDB(updates, userId, function(error, data){
        if (error) {
          console.log('Error', error);
        } else {
          console.log(data);
        }
      });
    });
  };
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

//realmSync.RealmSync = RealmSync;
var remoteFullSync = {
  1: {
    body: {
      name: "AndorrA",
    },
    modified: '1463096139904',
    realmSyncId: "216A4C28-0BC4-C644",
    type: "Dog"
  },
  2: {
    body: {
      name: "Comoros",
    },
    modified: '1463096139904',
    realmSyncId: "F0CE8695-3410-451D",
    type: "Dog"
  },
  3: {
    body: {
      name: "Bermuda",
    },
    modified: '1463096139904',
    realmSyncId: "2B533C1F-40AA-CFDC",
    type: "Dog"
  },
  4: {
    body: {
      name: "Cook Islands2",
    },
    modified: '1463096139904',
    realmSyncId: "A7353E1F-1KQ8-CQFC",
    type: "Dog"
  }
}

// realmSync.testSync = function() {
//   // if last sync date is never and USN is 0:
//   realm.write(() => {
//     for(key in remoteFullSync) {
//       var type = remoteFullSync[key].type;
//       var body = remoteFullSync[key].body;
//       body.realmSyncId = remoteFullSync[key].realmSyncId;
//
//       var filterText = 'realmSyncId = "' + body.realmSyncId + '"'
//       let objToUpdate = realm.objects(type).filtered(filterText);
//       if(objToUpdate.length > 0) {
//         for(key in body) {
//           objToUpdate[0][key] = body[key];
//         }
//       } else {
//         realm.create(type, body)
//       }
//     }
//   });
// }


// Handling fullsync from dynamo db.
// The logic (and imports at top) will need
// to be put in sync.js component

module.exports = RealmSync;


  // realm.write(() => {
  //   for(key in remoteFullSync) {
  //     var type = remoteFullSync[key].type;
  //     var body = remoteFullSync[key].body;
  //     body.realmSyncId = remoteFullSync[key].realmSyncId;
  //
  //     var filterText = 'realmSyncId = "' + body.realmSyncId + '"'
  //     let objToUpdate = realm.objects(type).filtered(filterText);
  //     if(objToUpdate.length > 0) {
  //       for(key in body) {
  //         objToUpdate[0][key] = body[key];
  //       }
  //     } else {
  //       realm.create(type, body)
  //     }
  //   }
  // });
