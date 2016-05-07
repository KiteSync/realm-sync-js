'use strict';
var styles = require('../styles/styles');
var scripts = require('../helpers/scripts');
var React = require('react-native');
var ToDoListItem = require('./ToDoListItem');
var { View, TouchableHighlight, Text} = React;
const Realm = require('realm');


let realm = new Realm({
  schema: [{
    name: 'Dog',
    properties: {
      name: 'string',
      realmSyncId: 'string',
    }
  }],
  schemaVersion: 4,
  migration: function(oldRealm, newRealm) {
    // only apply this change if upgrading to schemaVersion 1
    if (oldRealm.schemaVersion < 1) {
      var newObjects = newRealm.objects('Dog');

      // loop through all objects and set the name property in the new schema
      for (var i = 0; i < oldObjects.length; i++) {
        newObjects[i].realmSyncId = scripts.generateGuid();
      }
    }
  }
});


class RealmDbTests extends React.Component {

    constructor() {
        super();
    }
    componentWillMount() {

    }

    addItemToDB() {
      realm.write(() => {
        try {
          let dog = realm.create('Dog', {name: 'Phil', realmSyncId: scripts.generateGuid()});
          console.log(JSON.stringify(dog));
        } catch(error) {
          console.log("ERROR", error);
        }
      });
    }

    //https://github.com/johanneslumpe/react-native-fs#usage
    addItemToDB2() {

      realm.write(() => {
        try {
          realm.create('Dof', {name: 'Phil', realmSyncId: scripts.generateGuid()});
          console.log('success');
        } catch(error) {
          console.log(error);
        }
      });

    }

    modifyItemInDB() {
      console.log(scripts.generateGuid())
    }

    deleteItemFromDB() {
      console.log('delete item from DB')
    }
    deleteAllItemsFromDB() {
      realm.write(() => {
        try {
          let allDogs = realm.objects('Dog');
          let allDogsIds = [];
          allDogs.forEach(dog => {
            allDogsIds.push(dog.realmSyncId);
          });
          realm.delete(allDogs);
          console.log(allDogsIds);
        } catch(error) {
          console.log(error);
        }
      });
    }

    listItemsInDB() {
      let dogs = realm.objects('Dog')
      for(var i = 0; i < dogs.length; i++) {
        console.log(JSON.stringify(dogs[i]));
      }
    }

    render() {
        return (
            <View style = {styles.container}>
              <TouchableHighlight
                  style={[styles.button, styles.newButton]}
                  underlayColor='#99d9f4'
                  onPress={this.addItemToDB.bind(this)}>
                  <Text style={styles.buttonText}>Add Item to DB</Text>
              </TouchableHighlight>

              <TouchableHighlight
                  style={[styles.button, styles.newButton]}
                  underlayColor='#99d9f4'
                  onPress={this.addItemToDB2.bind(this)}>
                  <Text style={styles.buttonText}>Add item to DB test 2 (simulate error)</Text>
              </TouchableHighlight>

              <TouchableHighlight
                  style={[styles.button, styles.newButton, styles.buttonUnimplemented]}
                  underlayColor='#99d9f4'
                  onPress={this.modifyItemInDB.bind(this)}>
                  <Text style={styles.buttonText}>Modify item in DB</Text>
              </TouchableHighlight>

              <TouchableHighlight
                  style={[styles.button, styles.newButton, styles.buttonUnimplemented]}
                  underlayColor='#99d9f4'
                  onPress={this.deleteItemFromDB.bind(this)}>
                  <Text style={styles.buttonText}>Delete an item from DB</Text>
              </TouchableHighlight>

              <TouchableHighlight
                  style={[styles.button, styles.newButton]}
                  underlayColor='#99d9f4'
                  onPress={this.deleteAllItemsFromDB.bind(this)}>
                  <Text style={styles.buttonText}>Delete all items from DB</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={[styles.button, styles.newButton]}
                underlayColor='#99d9f4'
                onPress={this.listItemsInDB.bind(this)}>
                <Text style={styles.buttonText}>List items in DB</Text>
              </TouchableHighlight>
            </View>
        );
    }

}


module.exports = RealmDbTests;
