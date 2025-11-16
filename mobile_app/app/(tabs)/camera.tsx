import { View, Text, Button, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { CameraView, useCameraPermissions } from 'expo-camera';
import { InferenceSession, Tensor } from 'onnxruntime-react-native';

const camera = () => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false)
  const [model, setModel] = useState<InferenceSession | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        // TODO: The user will manually place the best.pt file in this path
        const modelPath = 'mobile_app/assets/models/best.pt';
        const session = await InferenceSession.create(modelPath);
        setModel(session);
      } catch (error) {
        console.error('Failed to load model:', error);
      }
    };
    loadModel();
  }, []);


  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <Button title={showCamera ? "Close Camera" : "Open Camera"} onPress={() => setShowCamera(!showCamera)} />
      {showCamera &&
        <CameraView style={styles.camera} facing={facing}>
          <View style={styles.buttonContainer}>
            <Button title="Flip Camera" onPress={toggleCameraFacing} />
          </View>
        </CameraView>}
    </View>
  )
}

export default camera

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
