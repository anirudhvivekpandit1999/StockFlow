// QRScanner.js
import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';

const PURPLE = '#7c3aed';

const QRScanner = () => {
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const cameraRef = useRef(null);
  const navigation = useNavigation();     
  useEffect(() => {
    const codeValue = 'Laptop';
    setScannedData(codeValue);
    setScanned(true);
      navigation.navigate('ProductDetails', { name: codeValue });
    
    // Optional: Show alert
    Alert.alert('QR Code Scanned', codeValue);
  }, [scanned]);

  const onReadCode = (event) => {
    const codeValue = 'Laptop';
    setScannedData(codeValue);
    setScanned(true);
      navigation.navigate('ProductDetails', { name: codeValue });
    
    // Optional: Show alert
    Alert.alert('QR Code Scanned', codeValue);
  };

  const resetScanner = () => {
    setScanned(false);
    setScannedData('');
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        cameraType={CameraType.Back}
        scanBarcode={true}
        onReadCode={onReadCode}
        showFrame={true}
        laserColor={PURPLE}
        frameColor={PURPLE}
        flashMode="auto"
        focusMode="on"
        zoomMode="on"
      />
      
      <View style={styles.overlayTop}>
        <Text style={styles.title}>Scan a QR Code</Text>
        <Text style={styles.subtitle}>
          Align the QR code within the purple frame
        </Text>
        {scannedData ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Scanned Data:</Text>
            <Text style={styles.resultValue}>{scannedData}</Text>
            <Text style={styles.resetText} onPress={resetScanner}>
              Tap to scan again
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlayTop: {
    position: 'absolute',
    top: 60,
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 20,
  },
  title: {
    color: PURPLE,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  resultText: {
    color: PURPLE,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultValue: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  resetText: {
    color: PURPLE,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default QRScanner;