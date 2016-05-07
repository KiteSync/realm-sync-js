'use strict';
var styles = require('../styles/styles');
var React = require('react-native');
var ToDoListItem = require('./ToDoListItem');
var RNFS = require('react-native-fs');
var { View, TouchableHighlight, Text} = React;
import { RNS3 } from 'react-native-aws3';
const Realm = require('realm');


class FileSystemTests extends React.Component {


    constructor() {
        super();
    }
    componentWillMount() {

    }

    getDatabaseLocation() {
      console.log('get database location tapped', this.props.realmPath)
    }

    //https://github.com/johanneslumpe/react-native-fs#usage
    listFiles() {
      console.log('listing the documents directory');
      RNFS.readFile(statResult[1], 'base64')
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
      console.log('get from S3');
      RNFS.downloadFile(
        'https://s3-us-west-1.amazonaws.com/jsuploadbucket/uploads/realm.db.realm',
        this.props.realmPath
      );
      console.log('check!!', this.props.realmPath);
    }

    putToS3() {
      console.log('put to s3 tapped');
      let file = {
        // `uri` can also be a file system path (i.e. file://)
        uri: this.props.realmPath,
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
                  style={[styles.button, styles.newButton, styles.buttonUnimplemented ]}
                  underlayColor='#99d9f4'
                  onPress={this.addFile.bind(this)}>
                  <Text style={styles.buttonText}>Add File</Text>
              </TouchableHighlight>

              <TouchableHighlight
                  style={[styles.button, styles.newButton, styles.buttonUnimplemented]}
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

      // // console.log('get from s3 tapped')
      // // // Get request to S3
      // // fetch('https://s3-us-west-1.amazonaws.com/jsuploadbucket/realm.db.realm', {
      // //   method: 'GET',
      // //   headers: {
      // //     // 'Accept-Encoding': 'base64',
      // //     'Content-Type': 'multipart/form-data'
      // //   }
      // // })
      // // .then((data) => {
      // //   console.log('<><><>data: ', data);
      // //   console.log('<><><>data.get: ', data.blob());
      // // })
      // // .catch((error) => {
      // //   console.error(error);
      // // });
      // // // write fetch data to FS in realm location
      // var data = null;//new FormData();
      // // //data.append("avatars", {"0":{}});

      // var xhr = new XMLHttpRequest();
      // xhr.withCredentials = true;

      // xhr.onreadystatechange = (e) => {
      //   if (xhr.readyState === 4) {
      //     // console.log(xhr.responseText);
      //     RNFS.writeFile(this.props.realmPath+'1', xhr.responseText, 'base64')
      //       .then((success) => {
      //         console.log('DATABASE OVER-WRITTEN');
      //         console.log(Realm().objects('RealmTestClass2'));

      //       })
      //       .catch((err) => {
      //         console.log(err.message);
      //       });
      //   }
      // };

      // xhr.open("GET", "https://s3-us-west-1.amazonaws.com/jsuploadbucket/realm.db.realm");
      // xhr.setRequestHeader("cache-control", "no-cache");
      // // xhr.setRequestHeader("postman-token", "727cbfae-d5c6-95d3-a9d4-5c16b1654ddb");

      // xhr.send(data);
