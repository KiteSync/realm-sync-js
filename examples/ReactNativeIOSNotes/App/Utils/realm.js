'use strict';

import Realm from 'realm';
var RealmSync = require('../lib/realmSync')
var remoteDBPath = 'https://4jqibux547.execute-api.us-west-2.amazonaws.com/test/sync';

class Note {}
Note.schema = {
  name: 'Note',
  properties: {
    name: Realm.Types.STRING,
    realmSyncId: Realm.Types.STRING
  },
};

// export default new Realm({schema: [Note]});

module.exports.realmSync = new RealmSync([Note], remoteDBPath);