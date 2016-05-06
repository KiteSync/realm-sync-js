'use strict';
var styles = require('../styles/styles');
var React = require('react-native');
var ToDoListItem = require('./ToDoListItem');
var { View, TouchableHighlight, Text} = React;
const Realm = require('realm');


let realm = new Realm({
  schema: [{name: 'Dog', properties: {name: 'string'}}]
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
          realm.create('Dog', {name: 'Phil'});
          console.log('success');
        } catch(error) {
          console.log(error);
        }
      });

    }

    //https://github.com/johanneslumpe/react-native-fs#usage
    addItemToDB2() {

      realm.write(() => {
        try {
          realm.create('Dofg', {name: 'Phil'});
          console.log('success');
        } catch(error) {
          console.log(error);
        }
      });

    }

    modifyItemInDB() {
      console.log('modify items in db')
    }

    deleteItemFromDB() {
      console.log('delete item from DB')
    }
    deleteAllItemsFromDB() {
      console.log('delete all items from DB')
    }

    listItemsInDB() {
      console.log('listItemsInDB');
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
                  <Text style={styles.buttonText}>Add item to DB test 2</Text>
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
