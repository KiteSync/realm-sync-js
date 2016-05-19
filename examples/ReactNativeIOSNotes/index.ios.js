import React, { Component } from 'react';
var Notes = require('./App/Components/Notes')
var FBAccount = require('./App/Components/FBAccount')


import Realm from './App/Utils/realm';
let realmSync = Realm.realmSync;
let realm = realmSync.getRealmInstance();

import {
  AppRegistry,
  StyleSheet,
  Text,
  NavigatorIOS,
  View
} from 'react-native';

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111'
  },
});


class ReactNativeIOSNotes extends Component {


  render() {

    return (
      <NavigatorIOS
        ref="nav"
        style={styles.container}
        initialRoute={{
          title: 'Notes',
          component: Notes,
          rightButtonTitle: 'Account',
          onRightButtonPress: () => {
            this.refs.nav.push({
              title: 'Account',
              component: FBAccount
            });
          }
        }} />
    );
  }

}

AppRegistry.registerComponent('ReactNativeIOSNotes', () => ReactNativeIOSNotes);
