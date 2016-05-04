'use strict';
var styles = require('../styles/styles');
var React = require('react-native');
var ToDoListItem = require('./ToDoListItem');
var RNFS = require('react-native-fs');
var { View, TouchableHighlight, Text} = React;
import { RNS3 } from 'react-native-aws3';

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
      console.log('put to s3 tapped');
      let file = {
        // `uri` can also be a file system path (i.e. file://)
        uri: "https://s3-us-west-1.amazonaws.com/jsuploadbucket/realm.db.realm",
        name: "realm.db.realm",
        type: "application/octet-stream"
      }

      let options = {
        keyPrefix: "uploads/",
        bucket: "jsuploadbucket",
        region: "us-west-1",
        accessKey: "",
        secretKey: "",
        successActionStatus: 201
      }

      RNS3.put(file, options).then(response => {
        if (response.status !== 201)
          throw new Error("Failed to upload image to S3");
        console.log(response.body);
        /**
         * {
         *   postResponse: {
         *     bucket: "your-bucket",
         *     etag : "9f620878e06d28774406017480a59fd4",
         *     key: "uploads/image.png",
         *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
         *   }
         * }
         */
      });

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
