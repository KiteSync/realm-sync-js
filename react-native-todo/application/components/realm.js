'use strict';

import RealmSync from '../lib/realmSync';
import SyncSchema from '../helpers/SyncSchema';
import Realm from 'realm';
class Dog {}
Dog.schema = {
  name: 'Dog',
  properties: {
    name: Realm.Types.STRING,
    realmSyncId: Realm.Types.STRING,
  },
};

module.exports.realmSync = new RealmSync([Dog]);
//module.exports.realm = new Realm();




// //
// 'use strict';
//
// import Realm from 'realm';
// import SyncSchema from '../helpers/SyncSchema';
// import RealmSync from '../lib/realmSync';
//
//
// class Dog {}
// Dog.schema = {
//   name: 'Dog',
//   properties: {
//     name: Realm.Types.STRING,
//     realmSyncId: Realm.Types.STRING,
//   },
// };
//
// // User has to
// export default new Realm({schema: [Dog, SyncSchema.SyncQueue]});
