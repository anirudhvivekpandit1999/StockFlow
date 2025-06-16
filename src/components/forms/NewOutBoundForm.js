import React, { useContext, useEffect } from "react";
import { Modal, Button, Text, useTheme } from "react-native-paper";
import { View, StyleSheet, useWindowDimensions, Alert } from "react-native";
import { Formik } from "formik";
import FormField from "./FormField";
import { ScrollView } from "react-native-gesture-handler";
import FormFieldNav from "./FormFieldNav";
import apiServices from "../../services/apiServices";
import {GlobalContext} from "../../services/GlobalContext";

const initialValues = {
  serialNumber: "",
  productName: "",
  count: "",
  client: "",
  location: ""
};

const NewOutboundForm = ({ onDismiss }) => {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const {userId , warehouseId} = useContext(GlobalContext);

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
            Name: values.billto,
            Location: values.shipto,
            StockStatus: 'Dispatched',
            UserId : userId , 
            WarehouseId : warehouseId
          });
          Alert.alert(result[0].Message);
          onDismiss();
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => {
          useEffect(() => {
            let isMounted = true;
            const fetchAndSetProductName = async () => {
              if (values.serialNumber) {
                try {
                  const response = await apiServices.getProductName({ ProductSerialNumber: values.serialNumber , WarehouseId: 1 });
                  console.log("Product Name Response:", JSON.parse(response[0].Data).ProductName);
                  if (isMounted) {
                    if (response && response.length > 0) {
                      setFieldValue('productName', JSON.parse(response[0].Data).ProductName);
                    } else {
                      setFieldValue('productName', '');
                    }
                  }
                } catch (error) {
                  if (isMounted) setFieldValue('productName', '');
                }
              } else {
                if (isMounted) setFieldValue('productName', '');
              }
            };
            fetchAndSetProductName();
            return () => { isMounted = false; };
          }, [values.serialNumber]);

          return (
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 20
                }}
              >
                New Dispatch Form
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
              <FormField
                name="count"
                label="Count"
                x="1"
              />
              <FormField
                name="billto"
                label="Bill To"
              />
              <FormField
                name="shipto"
                label="Ship To"
              />
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={onDismiss}
                  style={styles.button}
                >
                  <Text>Cancel</Text>
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}
                >
                  <Text>Submit</Text>
                </Button>
              </View>
            </ScrollView>
          );
        }}
      </Formik>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "#fafdff",
    padding: 26,
    borderRadius: 22,
    margin: 16,
    elevation: 0,
    zIndex: 9999,
    maxHeight: '80%',
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e3eaf3',
  },
  formContainer: {
    gap: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 14,
    marginTop: 28,
  },
  button: {
    minWidth: 90,
    borderRadius: 16,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
});

export default NewOutboundForm;