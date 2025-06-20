import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
  TouchableOpacity
} from "react-native";
import { TextInput, Button, Text, useTheme, IconButton } from "react-native-paper";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";

const initialValues = {
  payOrder: "Internal Transfer",
  internalTransferNumber: "",
  user: "",
  serialNumbers: [""],
  remark: ""
};

const usersList = ["Amit Sharma", "Sneha Rao", "Nikhil Mehta", "Priya Menon"];

const InternalTransferScreen = ({ navigation }) => {
  const theme = useTheme();
  const [formValues, setFormValues] = useState(initialValues);

  const addSerialField = (values, setFieldValue) => {
    const newList = [...values.serialNumbers, ""];
    setFieldValue("serialNumbers", newList);
    setFormValues(prev => ({ ...prev, serialNumbers: newList }));
  };

  const updateSerial = (index, text, values, setFieldValue) => {
    const updated = [...values.serialNumbers];
    updated[index] = text;
    setFieldValue("serialNumbers", updated);
    setFormValues(prev => ({ ...prev, serialNumbers: updated }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        initialValues={formValues}
        enableReinitialize
        onSubmit={values => {
          Alert.alert("Submitted", JSON.stringify(values, null, 2));
          navigation.goBack();
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <>
            <Text style={styles.header}>Internal Transfer</Text>

            {/* Pay Order (autofilled) */}
            <TextInput
              label="Pay Order"
              value="Internal Transfer"
              mode="outlined"
              disabled
              style={styles.input}
            />

            {/* Internal Transfer Number */}
            <TextInput
              label="Child Of (Internal Transfer Number)"
              value={values.internalTransferNumber}
              onChangeText={text =>
                setFieldValue("internalTransferNumber", text)
              }
              mode="outlined"
              style={styles.input}
            />

            {/* User Picker */}
            <Text style={styles.label}>Select User</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={values.user}
                onValueChange={itemValue => setFieldValue("user", itemValue)}
              >
                <Picker.Item label="Select User" value="" />
                {usersList.map(user => (
                  <Picker.Item key={user} label={user} value={user} />
                ))}
              </Picker>
            </View>

            {/* Serial Number Inputs with + button */}
            <Text style={styles.label}>Serial Numbers</Text>
            {values.serialNumbers.map((serial, index) => (
              <View key={index} style={styles.serialRow}>
                <TextInput
                  label={`Serial Number ${index + 1}`}
                  value={serial}
                  onChangeText={text =>
                    updateSerial(index, text, values, setFieldValue)
                  }
                  mode="outlined"
                  style={[styles.input, { flex: 1 }]}
                />
                {index === values.serialNumbers.length - 1 && (
                  <IconButton
                    icon="plus"
                    onPress={() => addSerialField(values, setFieldValue)}
                    style={{ marginLeft: 8, alignSelf: "center" }}
                  />
                )}
              </View>
            ))}

            {/* Remark */}
            <TextInput
              label="Remark"
              value={values.remark}
              onChangeText={text => setFieldValue("remark", text)}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
            />

            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.button}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.button}
              >
                Submit
              </Button>
            </View>
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9ff"
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4169e1",
    textAlign: "center",
    marginBottom: 20
  },
  input: {
    marginBottom: 16
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 16
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 8
  },
  serialRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 10
  }
});

export default InternalTransferScreen;
