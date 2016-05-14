'use strict';
var styles = require('../styles/styles');
var React = require('react-native');
var FileSystemTests = require('./FileSystemTests');
var RealmDbTests = require('./RealmDbTests');
var RemoteDbTests = require('./RemoteDbTests');
var TestSuite = require('./TestSuite');
var Login = require('./Authentication/Login')
var { Text, View, ListView, TouchableHighlight, AlertIOS, AsyncStorage } = React;
const Realm = require('realm');


class ToDoContainer extends React.Component {
    constructor() {
        super();

        this.state = {
            items: [
                {txt: 'Learn react native', complete: false},
                {txt: 'Make a to-do app', complete: true}
            ],
            realmPath: Realm.defaultPath,
            loggedIn: false
        };
    }

    componentDidMount() {
        AsyncStorage.getItem('authData').then(authData => {
            // console.log('authData:',authData, this.state.loggedIn);
            if(authData) {
              authData = JSON.parse(authData);
              this.setState({
                loggedIn: true
              });
            }
        });
    }

    openFileSystemTests() {
        this.props.navigator.push({
            title: 'Testing File System',
            component: FileSystemTests,
            passProps: {realmPath: this.state.realmPath}
        });
    }

    openRealmDbTests() {
        this.props.navigator.push({
            title: 'Testing Realm DB',
            component: RealmDbTests,
            passProps: {realmPath: this.state.realmPath}
        });
    }

    openRemoteDbTests() {
        this.props.navigator.push({
            title: 'Testing Remote DB',
            component: RemoteDbTests,
            passProps: {realmPath: this.state.realmPath}
        });
    }


    openTestSuite() {
        this.props.navigator.push({
          title: 'Testing Suite',
          component: TestSuite,
          passProps: {realmPath: this.state.realmPath}
        });
    }

    onLogin() {
        this.props.navigator.push({
            title: 'Login',
            component: Login
        });
    }

    render() {
        return (
          <View style = {styles.container}>
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

                <TouchableHighlight
                    style={[styles.button, styles.newButton]}
                    underlayColor='#99d9f4'
                    onPress={this.openRemoteDbTests.bind(this)}>
                    <Text style={styles.buttonText}>Test remote DB</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    style={[styles.button, styles.newButton]}
                    underlayColor='#99d9f4'
                    onPress={this.openRealmDbTests.bind(this)}>
                    <Text style={styles.buttonText}>Test realm DB</Text>
                </TouchableHighlight>


                <TouchableHighlight
                    style={[styles.button, styles.newButton]}
                    underlayColor='#99d9f4'
                    onPress={this.openFileSystemTests.bind(this)}>
                    <Text style={styles.buttonText}>Test filesystem</Text>
                </TouchableHighlight>

                <TouchableHighlight
                  style={[styles.button, styles.newButton]}
                  underlayColor='#00ff00'
                  onPress={this.openTestSuite.bind(this)}>
                    <Text style={styles.buttonText}>Auto Test Suite</Text>
                </TouchableHighlight>

            </View>
        );
    }
}

module.exports = ToDoContainer;
