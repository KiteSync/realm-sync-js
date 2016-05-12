var api = {
  getNotes(username){
    username = username.toLowerCase().trim();
    var url = `https://egghead-rn-tutorial.firebaseio.com/${username}.json`;
    return fetch(url).then((res) => res.json());
  },
  addNote(username, note){
    username = username.toLowerCase().trim();
    var url = `https://egghead-rn-tutorial.firebaseio.com/${username}.json`;
    return fetch(url, {
      method: 'post',
      body: JSON.stringify(note)
    }).then((res) => res.json());
  }
};


module.exports = api;