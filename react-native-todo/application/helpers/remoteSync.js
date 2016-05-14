var remoteSync = {};

remoteSync.getUpdatesFromRemoteDB = function(latestUsn, userId){
  fetch('https://4jqibux547.execute-api.us-west-2.amazonaws.com/test/sync?lastUpdate='+userId+'&userId='+latestUsn, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then((res) => {
        console.log('<><><>data: ', res.json());
        var data = res.json();
        return data;
      })
      .then(() => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
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

