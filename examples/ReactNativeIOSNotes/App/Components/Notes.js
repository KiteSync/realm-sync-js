var React = require('react-native');
var api = require('../Utils/api');
var Separator = require('./Helpers/Separator');

import Realm from '../Utils/realm';
let realmSync = Realm.realmSync;
let realm = realmSync.getRealmInstance();

var {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight
} = React;

import { ListView } from 'realm/react-native';

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#503f59'
  },
  syncBarText: {
    fontSize: 18,
    color: 'white',
    marginLeft: 25
  },
  syncBar: {
    padding: 10,
    marginTop: 55,
    fontSize: 18,
    backgroundColor: '#928699',
    borderRadius: 6
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
  searchInput: {
    height: 60,
    padding: 10,
    fontSize: 18,
    color: '#111',
    flex: 10
  },
  rowContainer: {
    padding: 10,
    fontSize: 18,
    backgroundColor: 'white',
    borderRadius: 6
  },
  footerContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 6
  }
});

class Notes extends React.Component{
  constructor() {
    super();
    let note = realm.objects('Note');

    var notesArray = [];
    notesArray = note.slice();

    this.ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
    this.state = {
      dataSource: this.ds.cloneWithRows(notesArray),
      note: '',
      error: ''
    }
  }    

  
  handleChange(e) {
    this.setState({
      note: e.nativeEvent.text
    })
  }
  handleSubmit() {
    var note = this.state.note;
    this.setState({
      note: ''
    })
    realm.write(() => {
      realmSync.create('Note', {name: note});
    })
  }
  syncRemoteDB() {
    console.log('Inside Remote DB Sync Method')
  }
  renderRow(rowData) {
    rowData = JSON.stringify(rowData.name);

    return(
      <View>
        <View style={styles.rowContainer}>
          <Text> {rowData} </Text>
        </View>
        <Separator />
      </View>
    )
  }
  footer() {
    return(
      <View style={styles.footerContainer}>
        <TextInput
          style={styles.searchInput}
          value={this.state.note}
          onChange={this.handleChange.bind(this)}
          placeholder="New Note" />
        <TouchableHighlight
          style={styles.button}
          onPress={this.handleSubmit.bind(this)}
          underlayColor="red">
          <Text style={styles.buttonText}> Submit </Text>
        </TouchableHighlight>
      </View>
    )
  }
  render() {

    return(
      <View style={styles.container}>
        <TouchableHighlight
        style={styles.syncBar}
        onPress={this.syncRemoteDB.bind(this)}
        underlayColor="red">
          <Text style={styles.syncBarText}>(Last Synced Never)</Text>
        </TouchableHighlight>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow} />
        {this.footer()}
      </View>
    )
  }
};


module.exports = Notes;








