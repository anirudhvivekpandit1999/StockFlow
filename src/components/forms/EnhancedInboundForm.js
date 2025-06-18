import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Modal,
  Button,
  Text,
  useTheme,
  DataTable,
  TextInput,
  Menu,
  Divider,
  SegmentedButtons,
  IconButton
} from "react-native-paper";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  Alert,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { Formik } from "formik";
import * as Yup from 'yup';
import FormField from "./FormField";
import { ScrollView } from "react-native-gesture-handler";
import apiServices from "../../services/apiServices";
import { GlobalContext } from "../../services/GlobalContext";
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import XLSX from 'xlsx';
import { Camera } from 'react-native-vision-camera';
import { BarcodeScanner } from 'react-native-vision-camera-barcodescanner';

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
  serializedGRN: "", // Auto-generated
  grnNumber: "",
  vendor: "",
  warrantyPeriod: "",
  billingDate: new Date(),
  invoiceNumber: "",
  challanNumber: "", // Same as invoice number
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
      batchNumber: "", // Auto-generated
      location: {
        rack: "",
        shelf: "",
        bin: ""
      }
    }
  ],
  status: "Pending"
};

const NewEnhancedInboundForm = ({ onDismiss }) => {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const { userId, warehouseId } = useContext(GlobalContext);
  const [showScanner, setShowScanner] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [vendorList, setVendorList] = useState([]);
  const [payOrderSeries, setPayOrderSeries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateField, setActiveDateField] = useState(null);
  const barcodeInputRef = useRef(null);

  useEffect(() => {
    fetchVendorList();
    fetchPayOrderSeries();
    fetchLocations();
  }, []);

  const fetchVendorList = async () => {
    try {
      const vendors = await apiServices.getVendorList();
      setVendorList(vendors);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    }
  };

  const fetchPayOrderSeries = async () => {
    try {
      const series = await apiServices.getPayOrderSeries();
      setPayOrderSeries(series);
    } catch (error) {
      console.error('Failed to fetch pay order series:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const locs = await apiServices.getLocations();
      setLocations(locs);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  };

  const generateGRN = async (poNumber) => {
    try {
      const grn = await apiServices.generateGRN(poNumber);
      return grn;
    } catch (error) {
      console.error('Failed to generate GRN:', error);
      return null;
    }
  };

  const handleBulkUpload = async (formikProps) => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.xlsx, DocumentPicker.types.xls],
      });

      // Process Excel file
      const response = await fetch(result[0].uri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const items = XLSX.utils.sheet_to_json(firstSheet);
        
        formikProps.setFieldValue('items', items.map(item => ({
          serialNumber: item.SerialNumber || '',
          itemCode: item.ItemCode || '',
          description: item.Description || '',
          quantity: item.Quantity || 1,
          batchNumber: '',
          location: { rack: '', shelf: '', bin: '' }
        })));
      };
      
      reader.readAsArrayBuffer(blob);
    } catch (error) {
      console.error('Error uploading file:', error);
      Alert.alert('Error', 'Failed to upload file');
    }
  };

  const handleBarcodeScan = async (formikProps, index) => {
    try {
      const cameraPermission = await Camera.requestCameraPermission();
      if (cameraPermission === 'authorized') {
        setShowScanner(true);
        setSelectedItemIndex(index);
      } else {
        Alert.alert('Permission required', 'Camera permission is required for scanning');
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  };

  const onBarcodeDetected = (barcode, formikProps) => {
    const items = [...formikProps.values.items];
    items[selectedItemIndex].serialNumber = barcode.displayValue;
    formikProps.setFieldValue('items', items);
    setShowScanner(false);
  };

  return (
    <Modal
      visible={true}
      onDismiss={onDismiss}
      dismissable={true}
      contentContainerStyle={[
        styles.modalContent,
        { width: Math.min(width - 32, 800) },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              // Generate batch number if not exists
              if (!values.items[0].batchNumber) {
                const batchNumber = await apiServices.generateBatchNumber();
                values.items = values.items.map(item => ({
                  ...item,
                  batchNumber
                }));
              }

              const result = await apiServices.submitInboundForm({
                ...values,
                userId,
                warehouseId,
                status: 'QC_Pending'
              });

              Alert.alert('Success', 'Form submitted successfully');
              onDismiss();
            } catch (error) {
              Alert.alert('Error', 'Failed to submit form');
              console.error(error);
            }
          }}
        >
          {(formikProps) => (
            <ScrollView style={styles.formContainer}>
              <Text style={styles.title}>Enhanced Inbound Form</Text>

              <View style={styles.row}>
                <View style={styles.column}>
                  <FormField
                    name="payOrderSeries"
                    label="Pay Order Series"
                    type="dropdown"
                    options={payOrderSeries}
                    onChange={(value) => {
                      formikProps.setFieldValue('payOrderSeries', value);
                      formikProps.setFieldValue('payOrderNumber', '');
                    }}
                  />
                </View>
                <View style={styles.column}>
                  <FormField
                    name="payOrderNumber"
                    label="Pay Order Number"
                    disabled={!formikProps.values.payOrderSeries}
                  />
                </View>
              </View>

              {/* GRN Details Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>GRN Details</Text>
                <View style={styles.row}>
                  <FormField
                    name="grnNumber"
                    label="GRN Number"
                    disabled
                    value={formikProps.values.serializedGRN}
                  />
                  <FormField
                    name="challanNumber"
                    label="Challan Number"
                    value={formikProps.values.invoiceNumber}
                    disabled
                  />
                </View>
              </View>

              {/* Vendor & Dates Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vendor & Dates</Text>
                <View style={styles.row}>
                  <FormField
                    name="vendor"
                    label="Vendor"
                    type="dropdown"
                    options={vendorList}
                  />
                  <FormField
                    name="warrantyPeriod"
                    label="Warranty Period (months)"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.row}>
                  <DateField
                    label="Billing Date"
                    value={formikProps.values.billingDate}
                    onChange={(date) => formikProps.setFieldValue('billingDate', date)}
                  />
                  <DateField
                    label="GRN Date"
                    value={formikProps.values.grnDate}
                    onChange={(date) => formikProps.setFieldValue('grnDate', date)}
                  />
                </View>
              </View>

              {/* Items Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Items</Text>
                  <View style={styles.buttonGroup}>
                    <Button
                      mode="contained"
                      onPress={() => handleBulkUpload(formikProps)}
                      style={styles.actionButton}
                    >
                      Bulk Upload
                    </Button>
                    <Button
                      mode="contained"
                      onPress={() => {
                        const items = [...formikProps.values.items];
                        items.push({
                          serialNumber: "",
                          itemCode: "",
                          description: "",
                          quantity: 1,
                          batchNumber: items[0]?.batchNumber || "",
                          location: { rack: "", shelf: "", bin: "" }
                        });
                        formikProps.setFieldValue('items', items);
                      }}
                      style={styles.actionButton}
                    >
                      Add Item
                    </Button>
                  </View>
                </View>

                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Serial No.</DataTable.Title>
                    <DataTable.Title>Item Code</DataTable.Title>
                    <DataTable.Title>Description</DataTable.Title>
                    <DataTable.Title numeric>Quantity</DataTable.Title>
                    <DataTable.Title>Location</DataTable.Title>
                    <DataTable.Title>Actions</DataTable.Title>
                  </DataTable.Header>

                  {formikProps.values.items.map((item, index) => (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>
                        <View style={styles.serialNumberCell}>
                          <TextInput
                            value={item.serialNumber}
                            onChangeText={(value) => {
                              const items = [...formikProps.values.items];
                              items[index].serialNumber = value;
                              formikProps.setFieldValue('items', items);
                            }}
                            ref={index === selectedItemIndex ? barcodeInputRef : null}
                            style={styles.serialInput}
                          />
                          <IconButton
                            icon="barcode-scan"
                            onPress={() => handleBarcodeScan(formikProps, index)}
                          />
                        </View>
                      </DataTable.Cell>
                      <DataTable.Cell>
                        <TextInput
                          value={item.itemCode}
                          onChangeText={(value) => {
                            const items = [...formikProps.values.items];
                            items[index].itemCode = value;
                            formikProps.setFieldValue('items', items);
                          }}
                        />
                      </DataTable.Cell>
                      <DataTable.Cell>
                        <TextInput
                          value={item.description}
                          onChangeText={(value) => {
                            const items = [...formikProps.values.items];
                            items[index].description = value;
                            formikProps.setFieldValue('items', items);
                          }}
                        />
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                        <TextInput
                          value={String(item.quantity)}
                          onChangeText={(value) => {
                            const items = [...formikProps.values.items];
                            items[index].quantity = parseInt(value) || 0;
                            formikProps.setFieldValue('items', items);
                          }}
                          keyboardType="numeric"
                        />
                      </DataTable.Cell>
                      <DataTable.Cell>
                        <Menu
                          visible={item.showLocationMenu}
                          onDismiss={() => {
                            const items = [...formikProps.values.items];
                            items[index].showLocationMenu = false;
                            formikProps.setFieldValue('items', items);
                          }}
                          anchor={
                            <Button
                              onPress={() => {
                                const items = [...formikProps.values.items];
                                items[index].showLocationMenu = true;
                                formikProps.setFieldValue('items', items);
                              }}
                            >
                              Select Location
                            </Button>
                          }
                        >
                          {locations.map((location) => (
                            <Menu.Item
                              key={location.id}
                              onPress={() => {
                                const items = [...formikProps.values.items];
                                items[index].location = location;
                                items[index].showLocationMenu = false;
                                formikProps.setFieldValue('items', items);
                              }}
                              title={`${location.rack}-${location.shelf}-${location.bin}`}
                            />
                          ))}
                        </Menu>
                      </DataTable.Cell>
                      <DataTable.Cell>
                        <IconButton
                          icon="delete"
                          onPress={() => {
                            const items = [...formikProps.values.items];
                            items.splice(index, 1);
                            formikProps.setFieldValue('items', items);
                          }}
                        />
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>
              </View>

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
                  onPress={() => formikProps.handleSubmit()}
                  style={styles.button}
                >
                  Submit & Print
                </Button>
              </View>
            </ScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>

      {showScanner && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={devices[0]}
          isActive={true}
          frameProcessor={frameProcessor}
        />
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "#fafdff",
    padding: 26,
    borderRadius: 22,
    margin: 16,
    maxHeight: "90%",
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e3eaf3',
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  column: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 24,
    paddingBottom: 24,
  },
  button: {
    minWidth: 120,
    borderRadius: 12,
  },
  actionButton: {
    marginLeft: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  serialNumberCell: {
    flexDirection: "row",
    alignItems: "center",
  },
  serialInput: {
    flex: 1,
  },
});

// Date field component
const DateField = ({ label, value, onChange }) => {
  const [show, setShow] = useState(false);

  return (
    <View style={styles.column}>
      <Button onPress={() => setShow(true)}>
        {label}: {value.toLocaleDateString()}
      </Button>
      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          onChange={(event, date) => {
            setShow(false);
            if (date) onChange(date);
          }}
        />
      )}
    </View>
  );
};

export default NewEnhancedInboundForm;
