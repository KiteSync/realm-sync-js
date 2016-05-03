'use strict';
var styles = require('../styles/styles');
var React = require('react-native');
var ToDoListItem = require('./ToDoListItem');
var { View, TouchableHighlight, Text} = React;


class FileSystemTests extends React.Component {


    constructor() {
        super();
    }
    componentWillMount() {

    }

    listFiles() {
      console.log('list files tapped')
    }

    addFile() {
      console.log('add file tapped')
    }

    deleteFile() {
      console.log('delete file tapped')
    }

    getFromS3() {
      console.log('get from s3 tapped')
    }

    putToS3() {
      console.log('Put to s3 tapped')
    }


    render() {
        return (
            <View style = {styles.container}>
              <TouchableHighlight
                  style={[styles.button, styles.newButton]}
                  underlayColor='#99d9f4'
                  onPress={this.listFiles.bind(this)}>
                  <Text style={styles.buttonText}>List Files</Text>
              </TouchableHighlight>

              <TouchableHighlight
                  style={[styles.button, styles.newButton]}
                  underlayColor='#99d9f4'
                  onPress={this.addFile.bind(this)}>
                  <Text style={styles.buttonText}>Add File</Text>
              </TouchableHighlight>

              <TouchableHighlight
                  style={[styles.button, styles.newButton]}
                  underlayColor='#99d9f4'
                  onPress={this.deleteFile.bind(this)}>
                  <Text style={styles.buttonText}>Delete File</Text>
              </TouchableHighlight>

              <TouchableHighlight
                style={[styles.button, styles.newButton]}
                underlayColor='#99d9f4'
                onPress={this.getFromS3.bind(this)}>
                <Text style={styles.buttonText}>Get from s3</Text>
              </TouchableHighlight>

              <TouchableHighlight
                  style={[styles.button, styles.newButton]}
                  underlayColor='#99d9f4'
                  onPress={this.putToS3.bind(this)}>
                  <Text style={styles.buttonText}>put to s3</Text>
              </TouchableHighlight>



            </View>
        );
    }

}


module.exports = FileSystemTests;
