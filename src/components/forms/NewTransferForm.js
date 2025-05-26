import React, { useState, useEffect } from "react";
import { Modal, Button, Text, useTheme } from "react-native-paper";
import { View, StyleSheet, useWindowDimensions, Alert } from "react-native";
import { Formik, useFormikContext } from "formik";
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";

import FormField from "./FormField";
import FormFieldNav from "./FormFieldNav";
import apiServices from "../../services/apiServices";

const initialValues = {
  serialNumber: "",
  productName: "",
  count: "",
  department: "",
  location: ""
};

const DepartmentList = ["Sales", "Marketing"];

const AutoFillProductName = () => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    let isMounted = true;

    const fetchProductName = async () => {
      const trimmed = values.serialNumber.trim();
      if (!trimmed) {
        setFieldValue("productName", "");
        return;
      }

      try {
        const response = await apiServices.getProductName({
          ProductSerialNumber: trimmed,
        });

        if (isMounted) {
          if (response && response.length > 0) {
            const parsed = JSON.parse(response[0].Data);
            setFieldValue("productName", parsed.ProductName);
          } else {
            setFieldValue("productName", "");
          }
        }
      } catch (error) {
        console.error("Failed to fetch product name", error);
        if (isMounted) setFieldValue("productName", "");
      }
    };

    fetchProductName();

    return () => {
      isMounted = false;
    };
  }, [values.serialNumber, setFieldValue]);

  return null;
};

const NewTransferForm = ({ onDismiss }) => {
  const { width } = useWindowDimensions();
  const theme = useTheme();

  return (
    <Modal
      visible={true}
      onDismiss={onDismiss}
      dismissable={true}
      contentContainerStyle={[
        styles.modalContent,
        { width: Math.min(width - 32, 400), zIndex: 9999 }
      ]}
      style={{ zIndex: 9999, elevation: 99 }}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={async values => {
          try {
            const result = await apiServices.addNewForm({
              ProductSerialNumber: values.serialNumber,
              ProductName: values.productName,
              Count: values.count,
              Name: values.department,
              Location: values.location,
              StockStatus: "Transferred"
            });

            Alert.alert(result[0].Message);
            onDismiss();
          } catch (error) {
            console.error("Form submission error:", error);
            Alert.alert("Error", "Failed to submit form.");
          }
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <ScrollView
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
          >
            <AutoFillProductName />

            <Text
              style={{
                color: theme.colors.primary,
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 20
              }}
            >
              Transfer Form
            </Text>

            <FormField
              name="serialNumber"
              label="Product Serial Number"
              x="0"
            />

            <FormField
              name="productName"
              label="Product Name"
              
              x="0"
            />

            <FormField name="count" label="Count" x="1" />

            <Text style={{ marginTop: 12, marginBottom: 4 }}>
              Department
            </Text>
            <View
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 6,
                marginBottom: 12
              }}
            >
              <Picker
                selectedValue={values.department}
                onValueChange={itemValue =>
                  setFieldValue("department", itemValue)
                }
              >
                <Picker.Item label="Select Department" value="" />
                {DepartmentList.map(dept => (
                  <Picker.Item key={dept} label={dept} value={dept} />
                ))}
              </Picker>
            </View>

            <FormField name="location" label="Location" />

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={onDismiss}
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
          </ScrollView>
        )}
      </Formik>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    margin: 16,
    elevation: 99,
    zIndex: 9999,
    maxHeight: "80%"
  },
  formContainer: {
    gap: 12
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24
  },
  button: {
    minWidth: 80
  }
});

export default NewTransferForm;