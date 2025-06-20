// QRScanner.js
import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, Alert, Platform } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';

const ACCENT = '#3a6ea8';
const SOFT_BG = 'rgba(255,255,255,0.9)';
const SOFT_GRAY = '#7a8ca3';

const QRScanner = () => {
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const cameraRef = useRef(null);
  const navigation = useNavigation();

  const onReadCode = (event) => {
    const codeValue = 'Laptop'; // Replace this logic for actual QR data if needed
    setScannedData(codeValue);
    setScanned(true);
    Alert.alert('QR Code Scanned', codeValue);
    navigation.navigate('ProductDetails', { name: codeValue });
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
        laserColor={ACCENT}
        frameColor={ACCENT}
        flashMode="auto"
        focusMode="on"
        zoomMode="on"
      />

      <View style={styles.overlayTop}>
        <Text style={styles.title}>Scan</Text>
        <Text style={styles.subtitle}>Align the QR code within the frame</Text>

        {scannedData ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Scanned:</Text>
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
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  overlayTop: {
    position: 'absolute',
    top: 60,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  title: {
    color: ACCENT,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  subtitle: {
    color: SOFT_GRAY,
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  resultContainer: {
    backgroundColor: SOFT_BG,
    borderRadius: 20,
    padding: 20,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  resultText: {
    color: ACCENT,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  resultValue: {
    color: '#222',
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
    marginBottom: 10,
  },
  resetText: {
    color: ACCENT,
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
});

export default QRScanner;
