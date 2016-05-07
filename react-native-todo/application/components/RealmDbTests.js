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
  schemaVersion: 1,
  migration: function(oldRealm, newRealm) {
    // only apply this change if upgrading to schemaVersion 1
    if (oldRealm.schemaVersion < 1) {
      var oldObjects = oldRealm.objects('Dog');
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
        console.log('in realm write');

        try {
          realm.create('Dog', {name: 'Phil'});
          console.log('success');
        } catch(error) {
          console.log("ERROR", error);
        }
      });

    }

    //https://github.com/johanneslumpe/react-native-fs#usage
    addItemToDB2() {

      realm.write(() => {
        try {
          realm.create('Dof', {name: 'Phil'});
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
      console.log('delete all items from DB')
    }

    listItemsInDB() {
      let dogs = realm.objects('Dog')
      for(var i = 0; i < dogs.length; i++) {
        debugger;
        console.log(JSON.stringify(dogs[i]));
          for(var key in dogs[i]) {
            console.log(dogs[i][key]);
          }
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
                  style={[styles.button, styles.newButton]}
                  underlayColor='#99d9f4'
                  onPress={this.modifyItemInDB.bind(this)}>
                  <Text style={styles.buttonText}>Modify item in DB</Text>
              </TouchableHighlight>

              <TouchableHighlight
                  style={[styles.button, styles.newButton]}
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
