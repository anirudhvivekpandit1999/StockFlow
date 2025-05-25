import React, { useState } from "react";
import { Modal, PaperProvider, Portal, Button, Text, useTheme, Drawer, Menu } from "react-native-paper";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Formik } from "formik";
import FormField from "./FormField";
import { ScrollView } from "react-native-gesture-handler";
import FormFieldNav from "./FormFieldNav";
import { Picker } from "@react-native-picker/picker";

const initialValues = {
  serialNumber: "",
  productName: "",
  count: "",
};
const DepartmentList = ["Sales" , "Marketing"]
const NewTransferForm = ({ onDismiss }) => {
 
  const { width } = useWindowDimensions();
  const theme = useTheme();
const [deptMenuVisible, setDeptMenuVisible] = useState(false);    
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
          onSubmit={values => {
            console.log(values);
            onDismiss();
          }}
        >
          {({ handleSubmit ,values, setFieldValue}) => (
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
                Transfer Form
                </Text>
              <FormField 
              name="serialNumber" 
              label="Product Serial Number" 
              x="0" />
              <FormFieldNav 
              name="productName" 
              label="Product Name" 
              value={values.serialNumber} 
              x= "0"/>
              <FormField 
              name="count" 
              label="Count" 
              x="1"/>
             <Text 
             style={{ 
              marginTop: 12, 
              marginBottom: 4 }}>Department</Text>
      <View 
      style={{ 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 6, 
        marginBottom: 12 }}>
        <Picker
          selectedValue={values.department}
          onValueChange={itemValue => setFieldValue('department', itemValue)}
        >
          <Picker.Item label="Select Department" value="" />
          {DepartmentList.map(dept => (
            <Picker.Item key={dept} label={dept} value={dept} />
          ))}
        </Picker>
      </View>
              <FormField 
              name="location"
              label="Location"/>
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

export default NewTransferForm;