import React, { useState } from "react";
import { Modal, PaperProvider, Portal, Button, Text, useTheme } from "react-native-paper";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Formik } from "formik";
import FormField from "./FormField";
import { ScrollView } from "react-native-gesture-handler";
import { callStoredProcedure } from "../../services/procedureService";
import apiServices from "../../services/apiServices";

const initialValues = {
  serialNumber: "",
  productName: "",
  count: "",
};

const NewInboundForm = ({ onDismiss }) => {
 
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
        var result = await apiServices.addNewForm({
            ProductSerialNumber: values.serialNumber,
            ProductName: values.productName,
            Count: values.count,
            Name: values.Supplier,
            Location: values.location,
            StockStatus : 'Recieved'
        });
        console.log("result", result);
    }}
>

          {({ handleSubmit }) => (
            <ScrollView 
            style={styles.formContainer}
            showsVerticalScrollIndicator = {false}>
                <Text 
                style={{
                color : theme.colors.primary,
                fontWeight : "bold",
                textAlign : "center",
                fontSize : 20
                }}> 
                New Inbound Form
                </Text>
              <FormField 
              name="serialNumber" 
              label="Product Serial Number" 
              x = "0" />
              <FormField 
              name="productName" 
              label="Product Name" 
              x = "0"/>
              <FormField 
              name="count" 
              label="Count" 
              x="1"/>
              <FormField
              name = "Supplier"
              label = "Supplier"/>
              <FormField 
              name="location"
              label="Location"/>
              <View 
              style={styles.buttonContainer}>
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
    maxHeight: '80%',
  },
  formContainer: {
    gap: 12, 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  button: {
    minWidth: 80,
  },
});

export default NewInboundForm;