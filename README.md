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

## Why Horizon?

An explanation about why KiteSync was developed and is an excellent solution for
developers.
[RethinkDB](http://www.rethinkdb.com) and

## Get Involved

This library was made possible by the creative efforts of developers like you and
we would be happy to have you contribute to KiteSync's future success. If you'd like to be a contributor,
check out our [Contributing guide](/CONTRIBUTING.md).

Also, checkout out [KiteSync.io](https://KiteSync.io) periodically for updates.

![](/assets/Lets-go.png)

## FAQ

### How do you start KiteSync?

This first step is to install the KiteSync command line tool.

```sh
$ npm install kitesync
# require 'kitesync' in your files
```

Check out the [Getting Started](/GETTING-STARTED.md) guide for a complete walkthrough.

### What does the code look like?

Here is currently what you'd write on the front-end for a simple todo list application:

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
***Want to see more?*** Check out [our README for the KiteSync api library](https://github.com/rethinkdb/horizon/tree/next/client#horizon-client-library), we have an initial set of docs as well as a expanded getting started guide to get you started with using Horizon.

### How do I get it?

You have two options:

1. `npm install kitesync`
1. Move into the `/src` folder here and run `./setupDev.sh` which will install it on your system using this repo.

Refer to the the [CLI README](/cli/README.md) for the most up-to-date public install instructions.

### Where do I start?

Check out our [Getting Started guide](/GETTING-STARTED.md). If you have more questions, feel free to tweet Colin at [@kitesyncjs](https://twitter.com/kitesyncjs).

![](/assets/how-is-horizon-different.png)

### How is KiteSync different from []?

There are a few major differences:

- Difference.
- Another difference.
- Other difference.


### How will KiteSync be licensed?

The KiteSync api, example and remote-service are available under the ??? license
