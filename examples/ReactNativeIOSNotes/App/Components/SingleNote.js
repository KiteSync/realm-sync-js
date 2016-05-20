var React = require('react-native');

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

  componentWillReceiveProps(nextProps) {
    this.state = {
      editing: false,
      noteName: nextProps.rowData.name
    }
  }

  updateNote() {
    this.props.realm.write(() => {
      this.props.rowData.name = this.state.noteName;
      this.props.realmSync.create('Note', this.props.rowData, true);
    });
    this.setState({editing: false});
  }

  deleteNote() {
    objToDelete = this.props.rowData;
    this.props.realm.write(() => {
      this.props.realmSync.delete(objToDelete);
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

            <View style={styles.buttonHolder}>

              <TouchableHighlight
                style={styles.updateButton}
                onPress={this.updateNote.bind(this)}>
                <Text style={styles.updateText}>Update</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={styles.deleteButton}
                onPress={this.deleteNote.bind(this)}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableHighlight>

            </View>

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
      </View>
    )
  }
}

var styles = StyleSheet.create({

  rowContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 6,
    marginBottom: 10
  },

  rowText: {
    fontSize: 16
  },

  noteEditForm: {
    backgroundColor: '#D3D3D3',
    borderRadius: 6,
    marginBottom: 10,
    height: 40,
    padding: 10,
    fontSize: 18,
    color: '#111',
    flexDirection: 'row',
    flex: 10
  },

  buttonHolder: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  updateButton: {
    backgroundColor: '#4DBD33',
    borderRadius: 6,
    height: 40,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  updateText: {
    fontSize: 14,
    color: 'white',
  },

  deleteButton: {
    backgroundColor: '#FF6347',
    borderRadius: 6,
    height: 40,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  deleteText: {
    fontSize: 14,
    color: 'white',
  },

});

module.exports = SingleNote;
