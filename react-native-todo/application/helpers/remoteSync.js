var remoteSync = {};

remoteSync.getUpdatesFromRemoteDB = function(latestUsn, userId, cb){
  fetch('https://4jqibux547.execute-api.us-west-2.amazonaws.com/test/sync?lastUpdate='+latestUsn+'&userId='+userId, {
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
        cb(null, data);
      })
      .catch((error) => {
        cb(error, null);
      });
};

remoteSync.pushLocalUpdatesToDB = function(updates) {
  fetch('https://4jqibux547.execute-api.us-west-2.amazonaws.com/test/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'X-API-Key': ''
        },
        body: JSON.stringify(updates)
      })
      .then((data) => {
        console.log('<><><>data: ', data);
        console.log('<><><>data.get: ', data.json());
      })
      .catch((error) => {
        console.error(error);
      });
};

module.exports = remoteSync;
