var React = require('react-native');
var Separator = require('./Helpers/Separator');
var Login = require('./Helpers/Login')

const Realm = require('realm');

var {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  AlertIOS,
  AsyncStorage
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

class FBAccount extends React.Component{
  constructor() {
    super();

    this.state = {

      loggedIn: false
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('authData').then(authData => {
      console.log('authData:',authData, this.state.loggedIn);
      if(authData) {
        authData = JSON.parse(authData);
        this.setState({
          loggedIn: true
        });
      }
    });
  }

  onLogin() {
    this.props.navigator.push({
      title: 'Login',
      component: Login
    });
  }

  render() {
    return(
      <View style={styles.container}>

        {(this.state.loggedIn
          ? ( <TouchableHighlight
            style={[styles.button, styles.newButton]}
            underlayColor='#99d94f'
            onPress={this.onLogin.bind(this)}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableHighlight> )
          : (<TouchableHighlight
            style={[styles.button, styles.newButton]}
            underlayColor='#99d94f'
            onPress={this.onLogin.bind(this)}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>)
        )}

      </View>
    )
  }
};



module.exports = FBAccount;







