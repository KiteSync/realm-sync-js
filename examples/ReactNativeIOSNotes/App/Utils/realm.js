'use strict';

import Realm from 'realm';
var RealmSync = require('../lib/realmSync')


class Note {}
Note.schema = {
  name: 'Note',
  properties: {
    name: Realm.Types.STRING,
    realmSyncId: Realm.Types.STRING
  },
};

// export default new Realm({schema: [Note]});

module.exports.realmSync = new RealmSync([Note]);