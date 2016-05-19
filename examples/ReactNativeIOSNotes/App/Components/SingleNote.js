var React = require('react-native');
var Separator = require('./Helpers/Separator');

var {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight
} = React;

class SingleNote extends React.Component {

  constructor() {
    super();
    // this is where the row data is coming from.
    // But it's not loading in the component
    // this.props.rowData
    this.state = {
      editing: false,
      noteText: ''
    }
  }

  updateNote() {
    console.log('updateNote')
    this.setState({editing: false});
  }

  deleteNote() {
    console.log('deleteNote')
    this.setState({editing: false});
  }

  renderSingleNote() {
    if(this.state.editing) {
      return(
        <View
          style={styles.rowContainer}>
          <TextInput
            style={styles.noteEditForm}
            value={this.props.rowData} />
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
          <Text style={styles.rowText}> {this.props.rowData} </Text>
          {/*<Text style={styles.rowText}> {this.state.noteText} </Text>*/}
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
