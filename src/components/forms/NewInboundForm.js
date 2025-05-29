import React, { useContext, useEffect } from "react";
import {
  Modal,
  Button,
  Text,
  useTheme
} from "react-native-paper";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Alert
} from "react-native";
import { Formik } from "formik";
import FormField from "./FormField";
import { ScrollView } from "react-native-gesture-handler";
import apiServices from "../../services/apiServices";
import { GlobalContext } from "../../services/GlobalContext";

const initialValues = {
  serialNumber: "",
  productName: "",
  count: "",
  Supplier: "",
  location: "",
};

const NewInboundForm = ({ onDismiss }) => {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const { userId } = useContext(GlobalContext);

  return (
    <Modal
      visible={true}
      onDismiss={onDismiss}
      dismissable={true}
      contentContainerStyle={[
        styles.modalContent,
        { width: Math.min(width - 32, 400), zIndex: 9999 },
      ]}
      style={{ zIndex: 9999, elevation: 99 }}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          try {
            const result = await apiServices.addNewForm({
              ProductSerialNumber: values.serialNumber,
              ProductName: values.productName,
              Count: values.count,
              Name: values.Supplier,
              Location: values.location,
              StockStatus: "Recieved",
              UserId: userId,
            });

            const data = result[0];
            Alert.alert(data.Message);
          } catch (error) {
            Alert.alert("Error", "Failed to submit form.");
            console.error(error);
          }
          onDismiss();
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => {
          useEffect(() => {
            let isMounted = true;
            const fetchAndSetProductName = async () => {
              if (values.serialNumber) {
                try {
                  const response = await apiServices.getProductName({
                    ProductSerialNumber: values.serialNumber,
                  });
                  if (isMounted) {
                    if (response && response.length > 0) {
                      const parsed = JSON.parse(response[0].Data);
                      setFieldValue("productName", parsed.ProductName || "");
                    } else {
                      setFieldValue("productName", "");
                    }
                  }
                } catch (error) {
                  if (isMounted) setFieldValue("productName", "");
                }
              } else {
                if (isMounted) setFieldValue("productName", "");
              }
            };
            fetchAndSetProductName();
            return () => {
              isMounted = false;
            };
          }, [values.serialNumber]);

          return (
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <Text
                style={{
                  color: theme.colors.primary,
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: 20,
                  marginBottom: 16,
                }}
              >
                New Inbound Form
              </Text>

              <FormField name="serialNumber" label="Product Serial Number" x="0" />
              <FormField name="productName" label="Product Name" x="0" />
              <FormField name="count" label="Count" x="1" />
              <FormField name="Supplier" label="Supplier" />
              <FormField name="location" label="Location" />

              <View style={styles.buttonContainer}>
                <Button mode="outlined" onPress={onDismiss} style={styles.button}>
                  Cancel
                </Button>
                <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                  Submit
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
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    margin: 16,
    elevation: 99,
    zIndex: 9999,
    maxHeight: "80%",
  },
  formContainer: {
    gap: 12,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24,
  },
  button: {
    minWidth: 80,
  },
});

export default NewInboundForm;
