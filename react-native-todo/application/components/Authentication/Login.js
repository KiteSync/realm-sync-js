'use strict';
var React = require('react-native');
var {StyleSheet, Image, Text, View, AsyncStorage} = React;
var FBLogin = require('react-native-facebook-login');
var FBLoginManager = require('NativeModules').FBLoginManager;

var FB_PHOTO_WIDTH = 200;

class Login extends React.Component {
  constructor () {
    super();
    this.state = {
      user: null
    };
  }

  handleLogin(data) {
    console.log("Logged in!");
    console.log(data);
    this.setState({ user : data.credentials });
    AsyncStorage.setItem('authData', JSON.stringify(data.credentials));
  }

  handleLogout() {
    console.log("Logged out.");
    this.setState({ user : null });
  }

  handleLoginFound(data) {
    console.log("Existing login found.");
    console.log(data);
    this.setState({ user : data.credentials}); 
  }

  handleLoginNotFound() {
    console.log("No user logged in.");
    this.setState({ user : null}); 
  }

  handleError(data){
    console.log("ERROR");
    console.log(data);
  }

  handleCancel(){
    console.log("User cancelled.");
  }

  handlePermissionsMissing(data){
    console.log("Check permissions!");
    console.log(data);
  }
  render () {
    var user = this.state.user;

    return (
      <View style={styles.loginContainer}>

        <FBLogin style={{ marginBottom: 10, }}
          permissions={["email","user_friends"]}
          onLogin={(data) => this.handleLogin(data)}
          onLogout={() => this.handleLogout()}
          onLoginFound={(data) => this.handleLoginFound(data)}
          onLoginNotFound={() => this.handleLoginNotFound()}
          onError={(data) => this.handleError()}
          onCancel={() => this.handleCancel()}
          onPermissionsMissing={(data) => this.handlePermissionsMissing(data)}
        />
        <Text>{ user ? user.token : "N/A" }</Text>
      </View>
    );
  }
}

class Photo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: null
    };
    this.propTypes = {
      user: React.PropTypes.object.isRequired,
    }
  }
  componentWillMount(){
    var _this = this;
    var user = this.props.user;
    var api = `https://graph.facebook.com/v2.3/${user.userId}/picture?width=${FB_PHOTO_WIDTH}&redirect=false&access_token=${user.token}`;

    fetch(api)
      .then((response) => response.json())
      .then((responseData) => {
        _this.setState({
          photo : {
            url : responseData.data.url,
            height: responseData.data.height,
            width: responseData.data.width,
          },
        });
      })
      .done();
  }
  render(){
    if(this.state.photo == null) return this.renderLoading();
    
    var photo = this.state.photo;

    return (
      <View style={styles.bottomBump}>

        <Image
          style={photo &&
            {
              height: photo.height,
              width: photo.width,
            }
          }
          source={{uri: photo && photo.url}}
        />
      </View>
    );
  }
  renderLoading(){
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
} 

class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null
    };
    this.propTypes = {
      user: React.PropTypes.object.isRequired,
    }
  }
  componentWillMount(){
    var _this = this;
    var user = this.props.user;
    var api = `https://graph.facebook.com/v2.3/${user.userId}?fields=name,email&access_token=${user.token}`;

    fetch(api)
      .then((response) => response.json())
      .then((responseData) => {
        _this.setState({
          info : {
            name : responseData.name,
            email: responseData.email,
          },
        });
      })
      .done();
  }
  render(){
    var info = this.state.info;

    return (
      <View style={styles.bottomBump}>
        <Text>{ info && this.props.user.userId }</Text>
        <Text>{ info && info.name }</Text>
        <Text>{ info && info.email }</Text>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  loginContainer: {
    marginTop: 150,

    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBump: {
    marginBottom: 15,
  },
});

module.exports = Login;