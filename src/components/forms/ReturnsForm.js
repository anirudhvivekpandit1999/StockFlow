// ✅ Return Form Screen using METAS principles

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AppBar from '../layout/AppBar';


const ReturnFormScreen = () => {
  const navigation = useNavigation();

  const [serialNumber, setSerialNumber] = useState('');
  const [reason, setReason] = useState('');
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        SerialNumber: serialNumber,
        Reason: reason,
        Remark: remark,
      };
      // Make your API call here
      console.log('Submitting Return:', payload);

      // Reset form after submission
      setSerialNumber('');
      setReason('');
      setRemark('');
      navigation.goBack();
    } catch (error) {
      console.error('Return submission failed', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppBar title="New Return" onBackPress={() => navigation.goBack()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          <TextInput
            label="Serial Number"
            value={serialNumber}
            onChangeText={setSerialNumber}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Reason for Return"
            value={reason}
            onChangeText={setReason}
            style={styles.input}
            mode="outlined"
            multiline
          />

          <TextInput
            label="Remark (Optional)"
            value={remark}
            onChangeText={setRemark}
            style={styles.input}
            mode="outlined"
            multiline
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting || !serialNumber || !reason}
            style={styles.submitButton}
            labelStyle={styles.submitLabel}
          >
            Submit Return
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  formContainer: {
    padding: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  submitButton: {
    borderRadius: 14,
    paddingVertical: 6,
    backgroundColor: '#5856D6',
  },
  submitLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default ReturnFormScreen;
