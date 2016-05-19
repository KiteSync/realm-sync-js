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

        <View>
          <Text style={styles.headerText}>Connect with Facebook</Text>
          <Separator />
        </View>
        {(this.state.loggedIn

          ? ( <TouchableHighlight
            style={styles.button}
            underlayColor='#99d94f'
            onPress={this.onLogin.bind(this)}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableHighlight> )

          : (<TouchableHighlight
            style={styles.button}
            underlayColor='#99d94f'
            onPress={this.onLogin.bind(this)}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>)
        )}

      </View>
    )
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 60,
    flexDirection: 'column',
    backgroundColor: '#D3D3D3'
  },
  headerText: {
    color: 'black',
    fontSize: 20
  },
  buttonText: {
    fontSize: 20,
    color: 'white'
  },
  button: {
    height: 60,
    backgroundColor: '#3B5998',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6
  }
});

module.exports = FBAccount;







