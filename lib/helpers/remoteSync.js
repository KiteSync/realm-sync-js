var remoteSync = {};

/**
 * Get the latest updates from the cloud (DynamoDB)
 * @param {String} remoteDB - end point url to get updates
 * @param {Number} lastUpdate - lastUpdate count saved in the client
 * @param {String} userId - Id of the user logged in
 * @param {function(err,data)} callback
 */
remoteSync.getUpdatesFromRemoteDB = function(remoteDB, lastUpdate, userId, callback){
  console.log(remoteDB.getUpdates)
  fetch(remoteDB+'?lastUpdate='+lastUpdate+'&userId='+userId,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then((res) => {
        var data = res.json();
        return data;
      })
      .then((data) => {
        callback(null, data);
      })
      .catch((error) => {
        callback(error, null);
      });
};

/**  
 * Pushes the recent changes in the sync queue to the cloud (DynamoDB)
 * @param {String} remoteDB - end point url to get updates
 * @param {Array of objects} updates - an array of updates(objects) (not JSON)
   [{
     "body": {
       "syncId": "232-534-1234",
       "usn": 3,
       "name": "jonas"
     },
   }, {...}, .. , {..}]
 * @param {String} userId - Id of the user logged in
 * @param {function(err,data)} callback
 */
remoteSync.pushLocalUpdatesToDB = function(remoteDB, updates, userId, callback) {
  fetch(remoteDB,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          logs: updates
        })
      })
      .then((res) => {
        var data = res.json();
        return data;
      })
      .then((data) => {
        callback(null, data);
      })
      .catch((error) => {
        callback(error, null);
      });
};

/**
 * Gets the highest USN count from DynamoDB for user passed in.
 * @param {String} remoteDB - end point url to get updates
 * @param {String} userId - Id of the user logged in
 * @param {function(err,data)} callback
 */
remoteSync.getHighestUSN = function(remoteDB, userId, callback) {
  fetch(remoteDB+'/count?userId='+userId,
    {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then((res) => {
        var data = res.json();
        return data;
      })
      .then((data) => {
        callback(null, data);
      })
      .catch((error) => {
        callback(error, null);
      });
};

module.exports = remoteSync;
