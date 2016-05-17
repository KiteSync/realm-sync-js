var remoteSync = {};

//getUpdatesFromRemoteDB method get the latest updates from the cloud (DynamoDB)
//pass in the last update count and the userId of the user logged in
//and callback to manipulate the response from DynamoDB
remoteSync.getUpdatesFromRemoteDB = function(lastUpdate, userId, callback){
  fetch('https://4jqibux547.execute-api.us-west-2.amazonaws.com/test/sync?lastUpdate='+lastUpdate+'&userId='+userId, {
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

/*pushLocalUpdatesToDB method takes in updates that are in the sync queue to the cloud (DynamoDB)
  pass in the an array of updates (not JSON) and the userId of the user logged in
  and callback to manipulate the response from DynamoDB
  format of every update in the array, 
  {
    "body": {
      "syncId": "232-534-1234",
      "name": "jonas"
    },
    "usn": 3,
  } */
remoteSync.pushLocalUpdatesToDB = function(updates, userId, callback) {
  fetch('https://4jqibux547.execute-api.us-west-2.amazonaws.com/test/sync', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'X-API-Key': ''
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

//getHighestUSN gets the highest USN count from DynamoDB for user passed in.
remoteSync.getHighestUSN = function(userId, callback) {
  fetch(' https://4jqibux547.execute-api.us-west-2.amazonaws.com/test/sync/count',
    {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
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

module.exports = remoteSync;
