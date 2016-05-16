var React = require('react-native');
var api = require('../Utils/api');
var Separator = require('./Helpers/Separator');

var {
  View,
  Text,
  ListView,
  TextInput,
  StyleSheet,
  TouchableHighlight
} = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#503f59'
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
    backgroundColor: 'white',
    borderRadius: 6
  }
});

class Notes extends React.Component{
  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
    this.state = {
      // dataSource: this.ds.cloneWithRows(this.props.notes),
// FIX THIS DATA SOURCE!
      dataSource: this.ds.cloneWithRows(['hello', 'world', 'this', 'is', 'a', 'test', 'sgkjndgnkejgjaebjgensjgvz,xdnfkadgjhdrbgjhadzkjvnkjdgjdsbgjsfksjnsfksgkjsgfkjb']),
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
//FIX FETCH REQUEST HERE    
    // api.addNote(this.props.userInfo.login, note)
    //   .then((data) => {
    //     api.getNotes(this.props.userInfo.login)
    //       .then((data) => {
    //         this.setState({
    //           dataSource: this.ds.cloneWithRows(data)
    //         })
    //       })
    //   }).catch((err) => {
    //     console.log('request failed', err);
    //     this.setState({error})
    //   })
  }
  renderRow(rowData) {
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
        <View
        style={styles.syncBar}>
          <Text>(Last Synced Never)</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow} />
        {this.footer()}
      </View>
    )
  }
};

Notes.propTypes = {
  userInfo: React.PropTypes.object.isRequired,
  notes: React.PropTypes.object.isRequired
}

module.exports = Notes;








