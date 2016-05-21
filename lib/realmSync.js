// import realm from '../components/realm';
import scripts from './helpers/scripts';
const Realm = require('realm');
import remoteSync from './helpers/remoteSync'
import sync from './helpers/sync';
import usnHandler from './helpers/usnHandler';


//this is for dynamoDb sync.
var React = require('react-native');
var {AsyncStorage} = React;

/**
 * Realm sync decorates Realm's CRUD functions to provide syncing functionality for the database.
 * @construction  {Array} schema - schemas used in the database
 *                {String} remoteDBPath - the path of the remote service
 *                {String} path - the path of the realm database. If not declared, the default database is used.
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
   * Creates an object in the database. Appends a unique realm sync id to the object.
   * https://realm.io/docs/react-native/latest/api/Realm.html#create
   *
   * @param {Object.type} type - schema type of the object
   * @param {Object} properties - properties to be stored in the database
   * @param {Object} update - true if properties are updating an exitsting object
   * @returns {type} an object if successful, otherwise an error is returned.
   */
  create(type, properties, update) {
    update = update || false;
    var objToUpdate;

    if (update && properties.realmSyncId) {
      var filterText = 'realmSyncId = "' + properties.realmSyncId + '"';
      let filteredObjects = this.realm.objects(type).filtered(filterText);
      if (filteredObjects.length > 0) {
        objToUpdate = filteredObjects[0];
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
      let savedObject = objToUpdate || this.realm.create(type, properties, update);
      scripts.addObjectToSyncQueue(this.realm, type, savedObject);
      return savedObject;
    } catch(error) {
      console.log(error);
      return error;
    }
  }

  /**
   * Gets the instance of realm instantiated.
   * @returns {realmConstructor} an instance of Realm.
   */
  getRealmInstance() {
    return this.realm;
  }

  /**
   * Deletes an object from the database and marks for deletion from the sync queue.
   * https://realm.io/docs/react-native/latest/api/Realm.html#delete
   * @param {Object} realmObject - object to be deleted
   */
  delete(realmObject) {
    let allRealmSyncIds = [];
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
   * Synchronizes local data to a remote service.
   * @param callback {function(error, success)} - callback to be called upon successful sync or error.
   * @param policy - @see incremental sync.
   */
  sync(callback, policy) {
    var that = this;
    AsyncStorage.getItem('authData')
      .then((authData) => {
        if(authData) {
          var userId = JSON.parse(authData).userId;
          // Get local sync count ond compare to remote service sync count to determine syncing action required
          sync.getLastSyncCount(function (localSyncCount) {
            remoteSync.getHighestUSN(that.remoteDBPath, userId, function (error, remoteServiceCount) {
              // Only send data to remote service if sync count is the same as remote service
              if (localSyncCount == remoteServiceCount) {
                sendSyncQueueToRemoteService(userId);
              } else if (localSyncCount == 0) { // else if local count is 0, perform a full sync
                remoteSync.getUpdatesFromRemoteDB(that.remoteDBPath, localSyncCount, userId, function (error, data) {
                  if (error) {
                    callback(error, null);
                  } else {
                    var syncChunk = sync.convertRemoteDataToSyncChunk(data);
                    sync.localSyncFromServer(that.realm, syncChunk);
                  }
                });
                sendSyncQueueToRemoteService(userId);
              } else { // otherwise perform an incremental sync
                remoteSync.getUpdatesFromRemoteDB(that.remoteDBPath, localSyncCount, userId, function (error, data) {
                  if (error) {
                    callback(error, null);
                  } else {
                    var syncChunk = sync.convertRemoteDataToSyncChunk(data);
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

    /**
     * Send data from sync queue to the remote service.
     * @param {String} userId - user's stored id.
     */
    function sendSyncQueueToRemoteService(userId) {
      var updates = sync.localSyncQueuePush(that.realm);
      remoteSync.pushLocalUpdatesToDB(that.remoteDBPath, updates, userId, function (error, data) {
        if (error) {
          callback(error, null);
        } else {
          remoteSync.getHighestUSN(that.remoteDBPath, userId, function(error, highestUsn) {
            if (!isNaN(highestUsn)) {
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
