var React = require('react-native');
var Separator = require('./Helpers/Separator');
import Realm from '../Utils/realm';
let realmSync = Realm.realmSync;
let realm = realmSync.getRealmInstance();

var {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight
} = React;

class SingleNote extends React.Component {

  constructor(props) {
    super(props);
    // this is where the row data is coming from.
    // But it's not loading in the component
    // this.props.rowData
    this.state = {
      editing: false,
      noteName: this.props.rowData.name
    }
  }

  updateNote() {
    realm.write(() => {
      this.props.rowData.name = this.state.noteName;
      realmSync.create('Note', this.props.rowData, true);
    });
    this.setState({editing: false});
  }

  deleteNote() {
    objToDelete = this.props.rowData;
    realm.write(() => {
      realmSync.delete(objToDelete);
    });
    this.setState({editing: false});
  }


  renderSingleNote() {
    if(this.state.editing) {
      return(
        <View
          style={styles.rowContainer}>
          <TextInput
            style={styles.noteEditForm}
            value={this.state.noteName}
            onChangeText={(noteName) => this.setState({noteName})}/>
            <TouchableHighlight
              onPress={this.updateNote.bind(this)}>
              <Text>Update</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={this.deleteNote.bind(this)}>
              <Text>Delete</Text>
            </TouchableHighlight>

        </View>
      )
    } else {
      return(
        <TouchableHighlight
          style={styles.rowContainer}
          onPress={() => {this.setState({editing: true})}} >
          <Text style={styles.rowText}> {this.state.noteName} </Text>
        </TouchableHighlight>
      )
    }
  }

  render() {
    return (
      <View>
        {this.renderSingleNote()}
        <Separator />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  separator: {
    height: 1,
    padding: 5,
    flex: 1,
    marginLeft: 15
  },
  rowContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 6
  },
  rowText: {
    fontSize: 18
  },
  noteEditForm: {
    height: 60,
    padding: 10,
    fontSize: 18,
    color: '#111',
    flex: 10
  },
});

module.exports = SingleNote;
