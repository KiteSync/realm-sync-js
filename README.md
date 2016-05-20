<img style="width:100%;" src="/github-banner.png">

# [KiteSync](http://kitesync.io)

## What is KiteSync?

KiteSync is an open-source solution to syncing realm.io react-native databases by using an external remote service. This library empowers developers to focus on offline first functionality in their mobile apps.

KiteSync is built on top of [Realm.io](https://realm.io/) and consists of
two components:

- [__KiteSync Api__](/api) -- a JavaScript library that allows syncing by using create, delete, update, and delete methods.     Syncing is initiated via the sync method coordinating synchronization with the remote service.
- [__KiteSync Example__](/example) -- an notes react-native application that demonstrates how easy KiteSync allows developers    to add syncing to their react-native apps.
- [__KiteSync Remote-Service__](/remote-service) -- a cloud-based solution for adding
  applications.

KiteSync provides the following service to developers:

- __Full Sync__ -- provides a full synchronization of user data from mobile device to mobile device.
- __Auth__ -- an authentication API that connects to common auth providers (Facebook).
- __Incremental Sync__ -- only synchronizes changes since the users last sync reducing the amount of data transferred.
- __Conflict Management__ -- resolves conflicts between identical objects on the client's device.

Upcoming versions of KiteSync will likely provide additional services:

- __Public/Private Routing__ -- allows developers to choose which data is privately synced per user and data synced to all mobile users.
- __Event Notification__ -- provides notification when syncing is initialized, in progress, and completed.
- __Backend Expansion__ -- an API/protocol to create custom backend solution.

## Why KiteSync?

An explanation about why KiteSync was developed and is an excellent solution for
developers.
[RethinkDB](http://www.rethinkdb.com) and

## Getting Started
###Requirements
- realm
- react-native

###Installation
```sh
$ npm install kitesync
```

###API Documentation
You can use KiteSync methods in a similar manner to how you would use realm CRUD methods.

__new RealmSync(schema[, path])__

Instantiate an instance of realm and realm sync.

__.create(type, properties[, update])__

Create an object that can be synchronized.

__.delete(realmObject)__

Delete an object from the local realm storage database. 

__.getRealmInstance()__

Provides an instantiated instance of the Realm library.

__.sync(callback [,serviceWinsPolicy])__

Synchronizes changes with remote service based on . Node style callback that return true for success.

##Example
```js
const Realm = require('realm');
const RealmSync = require('kitesync');
// Create your schema
var PersonSchema = {}
PersonSchema.schema = {
  name: 'Person',
  properties: {
    name: String,
    address: String
  }
}
// Instantiate KiteSync

const realmSync = RealmSync([PersonSchema]);
const realm = realmSync.getRealmInstance();

// Function used to create a person in realm
realm.write(() => {
  realmSync.create('Person', {
    name: 'Brian Smith',
    address: '123 Main St'
  });
});

realmSync.sync(function(error, success) {
  if (error) throw new Error(error);
  console.log(success);
});
```

## About / Philosophy
#### Kite Sync enables your local realm database to sync
We beleive that offline-first applications make for the best user experience: 
- Applications should work offline as seamlessly as possible with little or no disruption to the user.
- Once a user is authenticated and online, his/her data should be synchronized and persistant on the device.
- Apps should provide synonziation across multiple devices.

Products like _Evernote, Google Keep,_ and _Kindle_ have syncing solutions that highlight the merits of ensuring user data is available across devices and thus raised users expectation of how they interact with their mobile apps. Unfortunately syncing is a challenging technical problem and many businesses that solve it use their proprietary syncing technology as a competitive advantage. KiteSync’s goal is to make syncing an easy experienc both for developers and users alike.

Realm provides an exciting mobile database with a low memory and space footprint. We built an API wrapper over Realm to give full remote syncing functionality for react-native apps.


## Get Involved

This library was made possible by the creative efforts of developers like you and
we would be happy to have you contribute to KiteSync's future success. If you'd like to be a contributor,
check out our [Contributing guide](/CONTRIBUTING.md).

Also, checkout out [KiteSync.io](http://KiteSync.io) periodically for updates.

![](/assets/Lets-go.png)

## External Resources
- [Kite Sync Site](http://KiteSync.io)
- [Realm Site](https://realm.io/)
- [Realm Github](https://github.com/realm/realm-js)
- [About Offline-First Development](https://github.com/pazguille/offline-first)


## License

  [MIT](LICENSE)


