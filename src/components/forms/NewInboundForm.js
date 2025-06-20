// Full NewInboundForm with METAS Design Principles

import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Text,
  useTheme,
  DataTable,
  TextInput,
  Menu,
  Appbar,
  Card,
  Chip
} from "react-native-paper";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView
} from "react-native";
import { Formik } from "formik";
import * as Yup from 'yup';
import FormField from "./FormField";
import { ScrollView } from "react-native-gesture-handler";
import { GlobalContext } from "../../services/GlobalContext";
import DateTimePicker from '@react-native-community/datetimepicker';

const validationSchema = Yup.object().shape({
  payOrderSeries: Yup.string().required('Pay Order Series is required'),
  payOrderNumber: Yup.string().required('Pay Order Number is required'),
  grnNumber: Yup.string().required('GRN Number is required'),
  vendor: Yup.string().required('Vendor is required'),
  billingDate: Yup.date().required('Billing Date is required'),
  invoiceNumber: Yup.string().required('Invoice Number is required'),
  warrantyPeriod: Yup.number().required('Warranty Period is required'),
  items: Yup.array().of(
    Yup.object().shape({
      serialNumber: Yup.string().required('Serial Number is required'),
      itemCode: Yup.string().required('Item Code is required'),
      description: Yup.string().required('Description is required'),
      quantity: Yup.number().required('Quantity is required').min(1),
    })
  ).min(1, 'At least one item is required')
});

const initialValues = {
  payOrderSeries: "",
  payOrderNumber: "",
  serializedGRN: `GRN-${Date.now()}`,
  grnNumber: "",
  vendor: "",
  warrantyPeriod: "",
  billingDate: new Date(),
  invoiceNumber: "",
  challanNumber: "",
  poNumber: "",
  grnDate: new Date(),
  challanDate: new Date(),
  invoiceDate: new Date(),
  poDate: new Date(),
  datedOn: new Date(),
  warehouse: "",
  items: [
    {
      serialNumber: "",
      itemCode: "",
      description: "",
      quantity: 1,
      batchNumber: `BATCH-${Date.now()}`,
      location: {
        rack: "",
        shelf: "",
        bin: ""
      }
    }
  ],
  status: "Pending"
};

const NewInboundForm = ({ navigation }) => {
  const theme = useTheme();
  const { userId, warehouseId } = useContext(GlobalContext);
  const [formKey, setFormKey] = useState(0);
  const [vendorList, setVendorList] = useState([]);
  const [payOrderSeriesList, setPayOrderSeriesList] = useState([]);

  useEffect(() => {
    setVendorList([
      { label: 'Demo Vendor 1', value: '1' },
      { label: 'Demo Vendor 2', value: '2' },
      { label: 'ABC Electronics', value: '3' },
      { label: 'XYZ Supplies', value: '4' }
    ]);

    setPayOrderSeriesList([
      { label: 'PO-SERIES-A', value: 'A' },
      { label: 'PO-SERIES-B', value: 'B' },
      { label: 'PO-SERIES-C', value: 'C' }
    ]);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation?.addListener('focus', () => setFormKey(prev => prev + 1));
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation?.goBack()} />
        <Appbar.Content title="Inbound Entry" titleStyle={styles.title} />
        <Appbar.Action icon="help-circle-outline" onPress={() => Alert.alert('Info', 'Fill all required fields')} />
      </Appbar.Header>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Formik
          key={formKey}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log('Submitted Values:', values);
            Alert.alert('Success', 'Form Submitted');
          }}
        >
          {(props) => (
            <ScrollView contentContainerStyle={styles.content}>
              <Card style={styles.card}>
                <Card.Content>
                  <Chip style={styles.chip}>Status: {props.values.status}</Chip>

                  <FormField
                    name="payOrderSeries"
                    label="Pay Order Series"
                    type="dropdown"
                    options={payOrderSeriesList}
                  />
                  <FormField
                    name="payOrderNumber"
                    label="Pay Order Number"
                    placeholder="Enter PO Number"
                  />
                  <FormField
                    name="grnNumber"
                    label="GRN Number"
                    placeholder="Auto-filled"
                    disabled
                    value={props.values.serializedGRN}
                  />
                  <FormField
                    name="vendor"
                    label="Vendor"
                    type="dropdown"
                    options={vendorList}
                  />
                  <FormField
                    name="invoiceNumber"
                    label="Invoice Number"
                    placeholder="Enter Invoice Number"
                  />
                  <FormField
                    name="warrantyPeriod"
                    label="Warranty Period (Months)"
                    placeholder="e.g. 12"
                    keyboardType="numeric"
                  />
                </Card.Content>
              </Card>

              <View style={styles.actions}>
                <Button mode="outlined" onPress={() => navigation?.goBack()}>Cancel</Button>
                <Button mode="contained" onPress={props.handleSubmit}>Submit</Button>
              </View>
            </ScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  flex: {
    flex: 1
  },
  header: {
    backgroundColor: "#fff",
    elevation: 2
  },
  title: {
    fontSize: 18,
    fontWeight: "bold"
  },
  content: {
    padding: 16,
    gap: 16
  },
  card: {
    borderRadius: 12,
    elevation: 1
  },
  chip: {
    alignSelf: "flex-start",
    marginBottom: 12
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 24
  }
});

export default NewInboundForm;