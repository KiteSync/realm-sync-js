'use strict';
var styles = require('../styles/styles');
var React = require('react-native');
var ToDoListItem = require('./ToDoListItem');
var RNFS = require('react-native-fs');
var { View, TouchableHighlight, Text} = React;


class FileSystemTests extends React.Component {


    constructor() {
        super();
    }
    componentWillMount() {

    }

    getDatabaseLocation() {
      console.log('get database location tapped')
    }

    //https://github.com/johanneslumpe/react-native-fs#usage
    listFiles() {
      console.log('listing the documents directory');
      RNFS.readDir(RNFS.DocumentDirectoryPath)
        .then((result) => {
          console.log('GOT RESULT', result);

          // stat the first file
          return Promise.all([RNFS.stat(result[0].path), result[0].path]);
        })
        .then((statResult) => {
          if (statResult[0].isFile()) {
            // if we have a file, read it
            return RNFS.readFile(statResult[1], 'utf8');
          }
          return 'no file';
        })
        .then((contents) => {
          // log the file contents
          console.log(contents);
        })
        .catch((err) => {
          console.log(err.message, err.code);
        });
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
                  onPress={this.getDatabaseLocation.bind(this)}>
                  <Text style={styles.buttonText}>Get database location</Text>
              </TouchableHighlight>

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
