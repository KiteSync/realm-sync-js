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
 * @construction{Array} - schema - schemas used by the App
                {String} - remoteDBPath - the path of the remote service
                {String} - path - the path of the realm database.
 *              If not declared, default database is used.
 */
class RealmSync {
  constructor(schema, remoteDBPath, path) {

    this.remoteDBPath = remoteDBPath;
    schema = schema || [];
    schema.push(SyncQueue);
    if (path) {
      this.realm = new Realm({path: path, schema: schema});
    } else {
      this.realm = new Realm({schema: schema})
    }
    usnHandler.getHighestLocalUsn(this.realm);

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
    var objToUpdate;

    //If update === true and passed in object has a realmSyncId
    if (update && properties.realmSyncId) {
      var filterText = 'realmSyncId = "' + properties.realmSyncId + '"';
      let filteredObjects = this.realm.objects(type).filtered(filterText);
      if (filteredObjects.length > 0) {
        objToUpdate = filteredObjects[0]
        for (key in properties) {
          objToUpdate[key] = properties[key];
        }
      }
    } else {
      properties.realmSyncId = scripts.generateGuid();
      if (update === true) {
        console.log("Can't find object in " + type + " with id " + properties.realmSyncId + ". Creating a new object" );
      }
    }

    try {
      // TODO: Check that the assigned guid is unique (1 / 1,000,000,000,000 chance)
      let savedObject = objToUpdate || this.realm.create(type, properties, update);
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
    //TODO: This logic shold go after deleting original object
    if(realmObject.constructor.name === "Results") {
      realmObject.forEach(object => {
        scripts.markSyncQueueObjectAsDeleted(this.realm, object);
      });
    } else {
      scripts.markSyncQueueObjectAsDeleted(this.realm, realmObject);
    }

    try {
      this.realm.delete(realmObject);
    } catch(error) {
      console.log(error);
    }
  }

  /**
   *
   * @param callback
   * @param policy
   */
  sync(callback, policy) {
    // TODO: Determine if a callback should be passed to not when syncing is finished
    // TODO: Possible refactor get user id to a method
    var dateInit = Date.now();
    console.log("1. Beginning of sync: " + (Date.now() - dateInit));
    var that = this;
    AsyncStorage.getItem('authData')
      .then((authData) => {
        console.log("2. inside .then(authData): " + (Date.now() - dateInit));
        if(authData) {
          var userId = JSON.parse(authData).userId;
          // Get local sync count
          sync.getLastSyncCount(function (localSyncCount) {
            console.log("3. inside sync.getLastSyncCount " + (Date.now() - dateInit));

            // Get highest sync count from server
            remoteSync.getHighestUSN(that.remoteDBPath, userId, function (error, remoteServiceCount) {
              console.log("4. inside getHighestUSN " + (Date.now() - dateInit));

              // if local sync count equals highest from remote service
              if (localSyncCount == remoteServiceCount) {
                console.log("5. iocalSyncCount == remoteServiceCount" + (Date.now() - dateInit));
                sendSyncQueueToRemoteService(userId);
              } else if (localSyncCount == 0) {// else if local count is 0 full sync
                remoteSync.getUpdatesFromRemoteDB(that.remoteDBPath, localSyncCount, userId, function (error, data) {
                  console.log("5. inside remoteSync.getUpdatesFromRemoteDB" + (Date.now() - dateInit));

                  if (error) {
                    callback(error, null);
                  } else {
                    var syncChunk = sync.convertRemoteDataToSyncChunk(data);
                    sync.localSyncFromServer(that.realm, syncChunk);
                  }
                });
                sendSyncQueueToRemoteService(userId);
              } else { // else incremental sync
                // incremental sync
                // call get updates from remote with current local usn
                remoteSync.getUpdatesFromRemoteDB(that.remoteDBPath, localSyncCount, userId, function (error, data) {
                  // in callback:
                  console.log("5. inside getUpdatesFromRemoteDB" + (Date.now() - dateInit));

                  if (error) {
                    callback(error, null);
                  } else {
                    // convert sync data to sync chunk
                    var syncChunk = sync.convertRemoteDataToSyncChunk(data);
                    // call incremental sync with sync chunk & policy
                    if (policy === undefined) {
                      policy = sync.timeRemoteServiceWinsPolicy;
                    }
                    sync.incrementalSync(that.realm, syncChunk, policy);
                    sendSyncQueueToRemoteService(userId);
                  }
                });
              }
            });
          });
        }
      })
    .catch((error) => {
      callback(error, null);
    });

    function sendSyncQueueToRemoteService(userId) {
      // when sync from remote is done
      // get data from sync queue
      // push local update to remote service
      // debugger;
      var updates = sync.localSyncQueuePush(that.realm);
      remoteSync.pushLocalUpdatesToDB(that.remoteDBPath, updates, userId, function (error, data) {
        if (error) {
          callback(error, null);
        } else {
          // in callback:
          // get highest number ???
          // TODO: should be a number
          remoteSync.getHighestUSN(that.remoteDBPath, userId, function(error, highestUsn) {
            if (!isNaN(highestUsn)) {
              // var highestUsn = Number.parseInt(data);
              // update local number
              sync.setLastSyncCount(highestUsn, function(newCount) {
                scripts.deleteObjectFromSyncQueue(that.realm);
                callback(null, true);
              });
            }
          });
        }
      });
    }
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

module.exports = RealmSync;
