'use strict';
var styles = require('../styles/styles');
var scripts = require('../helpers/scripts');
var realmSync = require('../helpers/realmSync');
var React = require('react-native');
var ToDoListItem = require('./ToDoListItem');
var { View, TouchableHighlight, Text} = React;
import realm from './realm';


class RealmDbTests extends React.Component {

    constructor() {
        super();
    }
    componentWillMount() {
      console.log('Database location: ', this.props.realmPath)

    }

    //
    addItemToDB() {
      realm.write(() => {
        realmSync.create('Dog', {name: scripts.randomName(), realmSyncId: scripts.generateGuid()})
      });
    }

    //Testing what happens if realm.create is broken.
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

    addThenRemoveFromDB() {
      realm.write(() => {
        var dog = realmSync.create('Dog', {name: scripts.randomName(), realmSyncId: scripts.generateGuid()})
        realmSync.delete(dog);

      });

    }

    modifyItemInDB() {

    }

    deleteItemFromDB() {
      console.log('delete item from DB')
    }

    deleteAllItemsFromDB() {
      let allDogs = realm.objects('Dog');
      realm.write(() => {
        realmSync.delete(allDogs)
      });
    }

    deleteAllItemsFromSyncQueue() {
      realm.write(() => {
        try {
          let SyncQueue = realm.objects('SyncQueue');
          realm.delete(SyncQueue);
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
                  style={[styles.button, styles.newButton]}
                  underlayColor='#99d9f4'
                  onPress={this.addThenRemoveFromDB.bind(this)}>
                  <Text style={styles.buttonText}>Add Then remove same item from db</Text>
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
                  onPress={this.deleteAllItemsFromSyncQueue.bind(this)}>
                  <Text style={styles.buttonText}>Delete all items from SyncQueue</Text>
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
