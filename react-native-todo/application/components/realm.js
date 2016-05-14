
'use strict';

import Realm from 'realm';
import SyncSchema from '../helpers/SyncSchema';

class Dog {}
Dog.schema = {
  name: 'Dog',
  properties: {
    name: Realm.Types.STRING,
    realmSyncId: Realm.Types.STRING,
  },
};

// User has to
export default new Realm({schema: [Dog, SyncSchema.SyncQueue]});
