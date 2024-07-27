import { Camera, CameraView, useCameraPermissions, CameraType, CameraPictureOptions } from 'expo-camera';
import React, { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import Markdown from 'react-native-markdown-display';
// import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import FormData from 'form-data'
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [markdownResponse, setMarkdownResponse] = useState<string>('');
  const [loading, setLoading] = useState(false)
  const [size, setSize] = useState({
    width: 100,
    height: 160
  });
  const cameraRef = useRef<CameraView | any>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    camera: {
      flex: 1,
      position: 'relative',
    },
    resPreview: {
      width: size.width,
      height: size.height,
      marginTop: 10,
      marginLeft: 10,
      backgroundColor: "#ffff",
    },
    buttonContainer: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
      margin: 64,
    },
    flp_button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    cpr_button: {
      flex: 2,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'black',
      alignSelf: 'center',
    },
    markdownContainer: {
      flex: 1,
      width: 500
      // padding: 20,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  });

  if (!cameraPermission) {
    // Camera permissions are still loading.
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    ); 
  }

  if (!cameraPermission.granted) {
    // Camera permissions are not granted yet.
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestCameraPermission} title="grant permission" />
      </SafeAreaView>
    );
  }

  function toggleCameraFacing() {
    console.log('toggle')
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePictureAndUpload() {
    // if (cameraRef.current) {
    const options: CameraPictureOptions = {
      quality: 1,
      base64: true,
      exif: false
    }
      try { 
        console.log('ready')
        const newPhoto = await cameraRef.current.takePictureAsync(options); // Take picture
        console.log('took')
        const uri = newPhoto.uri;        
        
        console.log(uri);
        // Send the image to the server
        if(newPhoto) {
          const formData = new FormData();
          formData.append('image', {
            uri: uri,
            type: 'image/jpeg',
            name: 'photo.jpg',
          });

          setLoading(true)
          const response = await axios.post('http://192.168.1.184:3000/scanner',
            formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': process.env.EXPO_PUBLIC_TOKEN as string,
            }
          });
          console.log(response.data.document)
          setMarkdownResponse(response.data.document);
          setLoading(false)
        } else {
          console.log('Photo does not exist')
        };


        console.log('Image uploaded successfully');
      } catch (error) {
        console.error('Error taking picture and uploading', error);
      }
    // } else {
    //   return <Text>Loading...</Text>
    // }
  }

  const changeSize = () => {
    if(size.width === 100 && size.height === 160) {
      setSize({
        width: 250,
        height: 400
      })
    } else if (size.width === 250 && size.height === 400) {
      setSize({
        width: 100,
        height: 160
      })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView 
      style={styles.camera} 
      facing={facing}
      ref={cameraRef}
      animateShutter={true}
      onCameraReady={() => (setCameraReady(true))}
      >
        <View style={styles.resPreview}>
          {markdownResponse && !loading ? (
            <ScrollView  horizontal={true}>
              <ScrollView style={styles.markdownContainer}>
                <TouchableOpacity onPress={changeSize}>
                  <Text>
                    Change Size
                  </Text>
                </TouchableOpacity>
                <Markdown>{markdownResponse}</Markdown>
              </ScrollView>
            </ScrollView>
          ) : loading ?
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
            </View>
            :
            null
          }
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.flp_button} onPress={toggleCameraFacing}>
            <MaterialIcons name="flip-camera-android" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cpr_button} onPress={takePictureAndUpload}>
            <Feather name="circle" size={50} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

