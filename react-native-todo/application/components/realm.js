
'use strict';

import Realm from 'realm';

class Dog {}
Dog.schema = {
  name: 'Dog',
  properties: {
    name: Realm.Types.STRING,
    realmSyncId: Realm.Types.STRING,
  },
};
class SyncQueue {}
SyncQueue.schema = {
  name: 'SyncQueue',
  properties: {
    usn: Realm.Types.INT,
    realmSyncId: Realm.Types.STRING,
    body: Realm.Types.STRING
  },
};
export default new Realm({schema: [Dog, SyncQueue]});
