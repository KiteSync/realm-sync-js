'use strict';

import Realm from 'realm';

class Note {}
Note.schema = {
  name: 'Note',
  properties: {
    name: Realm.Types.STRING,
    realmSyncId: Realm.Types.STRING
  },
};

export default new Realm({schema: [Note]});
