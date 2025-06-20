import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Platform } from "react-native";
import { Text, Button, TextInput, useTheme } from "react-native-paper";
import { Formik, FieldArray } from "formik";

const initialValues = {
  payOrderNumber: "",
  client: "",
  clientAddress: "",
  requestNumber: "",
  deliveryNoteNumber: "",
  deliveryDate: "",
  warehouse: "",
  soldTo: "",
  soldToAddress: "",
  deliverTo: "",
  deliverToAddress: "",
  description: "",
  unit: "",
  quantity: "",
  serialNumbers: [],
  remark: "",
  tos: "",
  customerStamp: "",
  customerSignName: "",
  customerSignDate: ""
};

const NewDispatchScreen = ({ navigation }) => {
  const theme = useTheme();
  const [formValues, setFormValues] = useState(initialValues);

  useEffect(() => {
    const qty = parseInt(formValues.quantity);
    if (!isNaN(qty)) {
      const currentLength = formValues.serialNumbers.length;
      if (qty > currentLength) {
        setFormValues(prev => ({
          ...prev,
          serialNumbers: [...prev.serialNumbers, ...Array(qty - currentLength).fill("")]
        }));
      } else if (qty < currentLength) {
        setFormValues(prev => ({
          ...prev,
          serialNumbers: prev.serialNumbers.slice(0, qty)
        }));
      }
    }
  }, [formValues.quantity]);

  const toLabel = key =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase())
      .replace("tos", "TOS");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Formik
        enableReinitialize
        initialValues={formValues}
        onSubmit={values => {
          Alert.alert("Form Submitted!", JSON.stringify(values, null, 2));
          navigation.goBack();
        }}
      >
        {({ handleSubmit, values, handleChange, setFieldValue }) => (
          <>
            <Text style={styles.header}>New Dispatch Form</Text>

            {/* Pay Order Number + Auto-filled (simulate later) */}
            <TextInput
              label="Pay Order Number"
              value={values.payOrderNumber}
              onChangeText={text => {
                setFieldValue("payOrderNumber", text);
                setFieldValue("client", "Client XYZ");
                setFieldValue("clientAddress", "123, Client Street");
              }}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Client"
              value={values.client}
              mode="outlined"
              style={styles.input}
              disabled
            />
            <TextInput
              label="Client Address"
              value={values.clientAddress}
              mode="outlined"
              style={styles.input}
              disabled
            />

            {/* Other inputs */}
            {[
              "requestNumber",
              "deliveryNoteNumber",
              "deliveryDate",
              "warehouse",
              "soldTo",
              "soldToAddress",
              "deliverTo",
              "deliverToAddress",
              "description",
              "unit",
              "quantity",
              "remark",
              "tos",
              "customerStamp",
              "customerSignName",
              "customerSignDate"
            ].map(field => (
              <TextInput
                key={field}
                label={toLabel(field)}
                value={values[field]}
                onChangeText={text => {
                  setFieldValue(field, text);
                  if (field === "quantity") {
                    setFormValues(prev => ({ ...prev, quantity: text }));
                  }
                }}
                mode="outlined"
                style={styles.input}
              />
            ))}

            {/* Serial Number Inputs */}
            {values.serialNumbers.map((serial, index) => (
              <TextInput
                key={index}
                label={`Serial Number ${index + 1}`}
                value={serial}
                onChangeText={text => {
                  const updatedSerials = [...values.serialNumbers];
                  updatedSerials[index] = text;
                  setFieldValue("serialNumbers", updatedSerials);
                  setFormValues(prev => ({ ...prev, serialNumbers: updatedSerials }));
                }}
                mode="outlined"
                style={styles.input}
              />
            ))}

            {/* Submit / Cancel */}
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

export default NewDispatchScreen;
