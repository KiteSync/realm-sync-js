var React = require('react-native');
var api = require('../Utils/api');
var Separator = require('./Helpers/Separator');
const Realm = require('realm');

var {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight
} = React;


var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#503f59'
  },
  buttonText: {
    fontSize: 18,
    color: 'black'
  },
  button: {
    height: 60,
    backgroundColor: '#c1dfb5',
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6
  },
  formInput: {
    height: 60,
    padding: 10,
    fontSize: 18,
    color: '#111',
    flex: 10
  },
  formContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 6
  }
});

class Account extends React.Component{
  constructor() {
    super()

  handleSubmit() {

  }

  render() {
    return(
      <View style={styles.container}>

        <Text>Existing User</Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.formInput}
            placeholder="Username" />
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor="red">
            <Text style={styles.buttonText}> Submit </Text>
          </TouchableHighlight>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.formInput}
            placeholder="Password" />
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor="red">
            <Text style={styles.buttonText}> Submit </Text>
          </TouchableHighlight>
        </View>

        <Separator />


        <Text>New User</Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.formInput}
            placeholder="Username" />
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor="red">
            <Text style={styles.buttonText}> Submit </Text>
          </TouchableHighlight>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.formInput}
            placeholder="Password" />
          <TouchableHighlight
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
            underlayColor="red">
            <Text style={styles.buttonText}> Submit </Text>
          </TouchableHighlight>
        </View>


      </View>
    )
  }
};



module.exports = Notes;








