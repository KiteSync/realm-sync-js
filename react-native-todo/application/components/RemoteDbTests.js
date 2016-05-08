'use strict';
var styles = require('../styles/styles');
var scripts = require('../helpers/scripts');
var React = require('react-native');
var ToDoListItem = require('./ToDoListItem');
var { View, TouchableHighlight, Text} = React;

class RemoteDbTests extends React.Component {

    constructor() {
        super();
    }
    componentWillMount() {

    }

    addItemToRemoteDB() {
      console.log('add item to remote db');
      // fetch('https://fk6uzmbdhc.execute-api.us-east-1.amazonaws.com/test/pets', {
      //   method: 'POST',
      //   headers: {
      //     // 'Accept-Encoding': 'base64',
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({"pets": [ {"id": 1, "type": "pup", "price": 249.99},
      //      {"id": 2, "type": "kitten", "price": 124.99}
      //    ]
      //   })
      // })
      // .then((data) => {
      //   console.log('<><><>data: ', data);
      //   console.log('<><><>data.get: ', data.json());
      // })
      // .catch((error) => {
      //   console.error(error);
      // });
    }

    //https://github.com/johanneslumpe/react-native-fs#usage
    addItemToRemoteDB2() {
      console.log('add item to remote db (simulate error)');
    }

    getItemsFromRemoteDB() {
      console.log('get items from remote db')
      fetch('https://fk6uzmbdhc.execute-api.us-east-1.amazonaws.com/test/pets', {
        method: 'GET',
        headers: {
          // 'Accept-Encoding': 'base64',
          'Content-Type': 'application/json'
        }
      })
      .then((data) => {
        console.log('<><><>data: ', data);
        console.log('<><><>data.get: ', data.json());
      })
      .catch((error) => {
        console.error(error);
      });
    }

    modifyItemInRemoteDB() {
      console.log('modify items in remote db')
    }

    deleteItemFromRemoteDB() {
      console.log('delete item from DB')
    }
    
    listItemsInRemoteDB() {
      console.log('delete all items from DB')
    }

    render() {
        return (
            <View style = {styles.container}>
              <TouchableHighlight
                  style={[styles.button, styles.newButton]}
                  underlayColor='#99d9f4'
                  onPress={this.addItemToRemoteDB.bind(this)}>
                  <Text style={styles.buttonText}>Add Item to Remote DB</Text>
              </TouchableHighlight>

              <TouchableHighlight
                  style={[styles.button, styles.newButton]}
                  underlayColor='#99d9f4'
                  onPress={this.addItemToRemoteDB2.bind(this)}>
                  <Text style={styles.buttonText}>Add item to Remote DB test 2 (simulate error)</Text>
              </TouchableHighlight>

              <TouchableHighlight
                  style={[styles.button, styles.newButton]}
                  underlayColor='#99d9f4'
                  onPress={this.getItemsFromRemoteDB.bind(this)}>
                  <Text style={styles.buttonText}>Get items from Remote DB</Text>
              </TouchableHighlight>

              <TouchableHighlight
                  style={[styles.button, styles.newButton]}
                  underlayColor='#99d9f4'
                  onPress={this.modifyItemInRemoteDB.bind(this)}>
                  <Text style={styles.buttonText}>Modify item in Remote DB</Text>
              </TouchableHighlight>

              <TouchableHighlight
                  style={[styles.button, styles.newButton]}
                  underlayColor='#99d9f4'
                  onPress={this.deleteItemFromRemoteDB.bind(this)}>
                  <Text style={styles.buttonText}>Delete an item from Remote DB</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={[styles.button, styles.newButton]}
                underlayColor='#99d9f4'
                onPress={this.listItemsInRemoteDB.bind(this)}>
                <Text style={styles.buttonText}>List items in Remote DB</Text>
              </TouchableHighlight>
            </View>
        );
    }

}


module.exports = RemoteDbTests;
