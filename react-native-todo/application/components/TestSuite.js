'use strict';
var styles = require('../styles/styles');
var React = require('react-native');
var tests = require('../helpers/tests');
var {
  View, TouchableHighlight, Text
  } = React;
import realm from './realm';

class TestSuite extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style = {styles.container}>
        <Text style={styles.button} onPress={tests.runTests}>
          Tap to Run All Tests
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    )
  }
}

module.exports = TestSuite;