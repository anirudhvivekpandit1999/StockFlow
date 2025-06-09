// QRScanner.js
import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';

const ACCENT = '#3a6ea8';
const SOFT_BG = 'rgba(255,255,255,0.85)';
const SOFT_GRAY = '#7a8ca3';

const QRScanner = () => {
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const cameraRef = useRef(null);
  const navigation = useNavigation();     
  // useEffect(() => {
  //   const codeValue = 'Laptop';
  //   setScannedData(codeValue);
  //   setScanned(true);
  //     navigation.navigate('ProductDetails', { name: codeValue });
    
  //   Alert.alert('QR Code Scanned', codeValue);
  // }, [scanned]);

  const onReadCode = (event) => {
    
    const codeValue = 'Laptop';
    setScannedData(codeValue);
    setScanned(true);
      navigation.navigate('ProductDetails', { name: codeValue });
    
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
        laserColor={ACCENT}
        frameColor={ACCENT}
        flashMode="auto"
        focusMode="on"
        zoomMode="on"
      />

      <View style={styles.overlayTop}>
        <View >
          <Text style={styles.title}>Scan </Text>
        </View>
        <Text style={styles.subtitle}>
          Align the QR code within the blue frame
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
  headerPill: {
    // backgroundColor: SOFT_BG,
    // borderRadius: 22,
    // paddingHorizontal: 28,
    // paddingVertical: 8,
    // marginBottom: 12,
    // shadowColor: '#b3c6e6',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.08,
    // shadowRadius: 8,
    // elevation: 2,
  },
  title: {
    color: ACCENT,
    fontSize: 22,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.1,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  subtitle: {
    color: SOFT_GRAY,
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  resultContainer: {
    backgroundColor: SOFT_BG,
    padding: 22,
    borderRadius: 18,
    marginTop: 22,
    alignItems: 'center',
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  resultText: {
    color: ACCENT,
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 5,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  resultValue: {
    color: '#222',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  resetText: {
    color: ACCENT,
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: '400',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
});

export default QRScanner;