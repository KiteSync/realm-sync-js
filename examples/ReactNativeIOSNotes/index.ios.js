import React, { Component } from 'react';
const Realm = require('realm');
var Notes = require('./App/Components/Notes')

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
        style={styles.container}
        initialRoute={{
          title: 'Notes',
          component: Notes
        }} />
    );
  }

}

AppRegistry.registerComponent('ReactNativeIOSNotes', () => ReactNativeIOSNotes);
