import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Button,
  Text,
  useTheme,
  DataTable,
  TextInput,
  Menu,
  Divider,
  SegmentedButtons,
  IconButton,
  Card,
  Chip,
  Appbar
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
  serializedGRN: "GRN-001", // Mock auto-generated value
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
      batchNumber: "BATCH-001", // Mock auto-generated value
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
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const { userId, warehouseId } = useContext(GlobalContext);
  const [vendorList, setVendorList] = useState([]);
  const [payOrderSeries, setPayOrderSeries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateField, setActiveDateField] = useState(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    // Mock vendor data
    setVendorList([
      { label: 'Demo Vendor 1', value: '1' },
      { label: 'Demo Vendor 2', value: '2' },
      { label: 'ABC Electronics', value: '3' },
      { label: 'XYZ Supplies', value: '4' }
    ]);
    
    // Mock pay order series
    setPayOrderSeries([
      { label: 'PO-SERIES-A', value: 'A' },
      { label: 'PO-SERIES-B', value: 'B' },
      { label: 'PO-SERIES-C', value: 'C' }
    ]);
    
    // Mock locations
    setLocations([
      { id: '1', rack: 'R1', shelf: 'S1', bin: 'B1' },
      { id: '2', rack: 'R2', shelf: 'S2', bin: 'B2' },
      { id: '3', rack: 'R3', shelf: 'S1', bin: 'B3' },
      { id: '4', rack: 'R1', shelf: 'S3', bin: 'B2' }
    ]);
  }, []);

  // Reset form when screen is focused
  useEffect(() => {
    const unsubscribe = navigation?.addListener('focus', () => {
      setFormKey(prev => prev + 1);
    });
    return unsubscribe;
  }, [navigation]);

  const handleBulkUpload = async (formikProps) => {
    Alert.alert(
      'Bulk Upload', 
      'This feature allows you to upload multiple items via CSV/Excel file. Would you like to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Upload', onPress: () => Alert.alert('Info', 'File picker will be implemented') }
      ]
    );
  };

  const generateAutoNumbers = () => {
    const timestamp = Date.now();
    return {
      grnNumber: `GRN-${timestamp}`,
      batchNumber: `BATCH-${timestamp}`
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation?.goBack()} />
        <Appbar.Content title="New Inbound Entry" titleStyle={styles.headerTitle} />
        <Appbar.Action 
          icon="help-circle-outline" 
          onPress={() => Alert.alert('Help', 'Fill in all required fields to create a new inbound entry')} 
        />
      </Appbar.Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <Formik
          key={formKey}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              // Generate batch number if not present
              if (!values.items[0].batchNumber) {
                const { batchNumber } = generateAutoNumbers();
                values.items = values.items.map(item => ({
                  ...item,
                  batchNumber: batchNumber
                }));
              }

              // Mock submission
              console.log('Submitting form:', values);
              Alert.alert(
                'Success', 
                'Inbound form submitted successfully!\n\nGRN Number: ' + values.serializedGRN,
                [
                  { text: 'Print GRN', onPress: () => console.log('Print GRN') },
                  { text: 'Close', onPress: () => navigation?.goBack() }
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to submit form: ' + error.message);
              console.error(error);
            }
          }}
        >
          {(formikProps) => (
            <ScrollView 
              style={styles.formContainer} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              {/* Status Section */}
              <View style={styles.statusSection}>
                <Chip 
                  icon="clock-outline" 
                  style={styles.statusChip}
                  textStyle={styles.statusText}
                >
                  Status: {formikProps.values.status}
                </Chip>
              </View>

              {/* Pay Order Section */}
              <Card style={styles.sectionCard}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>🏷️ Pay Order Details</Text>
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
                        placeholder="Enter PO number"
                      />
                    </View>
                  </View>
                </Card.Content>
              </Card>

              {/* GRN Details Section */}
              <Card style={styles.sectionCard}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>📋 GRN Details</Text>
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <TextInput
                        label="GRN Number"
                        value={formikProps.values.serializedGRN}
                        disabled
                        style={styles.disabledInput}
                        left={<TextInput.Icon icon="barcode" />}
                      />
                    </View>
                    <View style={styles.column}>
                      <TextInput
                        label="Challan Number"
                        value={formikProps.values.invoiceNumber || 'Auto-generated'}
                        disabled
                        style={styles.disabledInput}
                        left={<TextInput.Icon icon="receipt" />}
                      />
                    </View>
                  </View>
                  
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <FormField
                        name="invoiceNumber"
                        label="Invoice Number"
                        placeholder="Enter invoice number"
                        required
                      />
                    </View>
                    <View style={styles.column}>
                      <FormField
                        name="poNumber"
                        label="PO Number"
                        placeholder="Enter PO number"
                      />
                    </View>
                  </View>
                </Card.Content>
              </Card>

              {/* Vendor & Dates Section */}
              <Card style={styles.sectionCard}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>🏢 Vendor & Timeline</Text>
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <FormField
                        name="vendor"
                        label="Vendor"
                        type="dropdown"
                        options={vendorList}
                        placeholder="Select vendor"
                        required
                      />
                    </View>
                    <View style={styles.column}>
                      <FormField
                        name="warrantyPeriod"
                        label="Warranty Period (months)"
                        keyboardType="numeric"
                        placeholder="Enter warranty period"
                        required
                      />
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.column}>
                      <DateField
                        label="Billing Date"
                        value={formikProps.values.billingDate}
                        onChange={(date) => formikProps.setFieldValue('billingDate', date)}
                        icon="calendar"
                      />
                    </View>
                    <View style={styles.column}>
                      <DateField
                        label="GRN Date"
                        value={formikProps.values.grnDate}
                        onChange={(date) => formikProps.setFieldValue('grnDate', date)}
                        icon="calendar-check"
                      />
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.column}>
                      <DateField
                        label="Invoice Date"
                        value={formikProps.values.invoiceDate}
                        onChange={(date) => formikProps.setFieldValue('invoiceDate', date)}
                        icon="calendar-text"
                      />
                    </View>
                    <View style={styles.column}>
                      <DateField
                        label="PO Date"
                        value={formikProps.values.poDate}
                        onChange={(date) => formikProps.setFieldValue('poDate', date)}
                        icon="calendar-plus"
                      />
                    </View>
                  </View>
                </Card.Content>
              </Card>

              {/* Items Section */}
              <Card style={styles.sectionCard}>
                <Card.Content>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>📦 Items ({formikProps.values.items.length})</Text>
                    <View style={styles.buttonGroup}>
                      <Button
                        mode="outlined"
                        onPress={() => handleBulkUpload(formikProps)}
                        style={styles.actionButton}
                        icon="cloud-upload"
                      >
                        Bulk Upload
                      </Button>
                      <Button
                        mode="contained"
                        onPress={() => {
                          const items = [...formikProps.values.items];
                          const { batchNumber } = generateAutoNumbers();
                          items.push({
                            serialNumber: "",
                            itemCode: "",
                            description: "",
                            quantity: 1,
                            batchNumber: items[0]?.batchNumber || batchNumber,
                            location: { rack: "", shelf: "", bin: "" }
                          });
                          formikProps.setFieldValue('items', items);
                        }}
                        style={styles.actionButton}
                        icon="plus"
                      >
                        Add Item
                      </Button>
                    </View>
                  </View>

                  <View style={styles.tableContainer}>
                    <DataTable style={styles.dataTable}>
                      <DataTable.Header style={styles.tableHeader}>
                        <DataTable.Title style={styles.headerCell}>Serial No.</DataTable.Title>
                        <DataTable.Title style={styles.headerCell}>Item Code</DataTable.Title>
                        <DataTable.Title style={styles.headerCell}>Description</DataTable.Title>
                        <DataTable.Title style={styles.headerCell} numeric>Qty</DataTable.Title>
                        <DataTable.Title style={styles.headerCell}>Location</DataTable.Title>
                        <DataTable.Title style={styles.headerCell}>Actions</DataTable.Title>
                      </DataTable.Header>

                      {formikProps.values.items.map((item, index) => (
                        <DataTable.Row key={index} style={styles.tableRow}>
                          <DataTable.Cell style={styles.tableCell}>
                            <TextInput
                              value={item.serialNumber}
                              onChangeText={(value) => {
                                const items = [...formikProps.values.items];
                                items[index].serialNumber = value;
                                formikProps.setFieldValue('items', items);
                              }}
                              style={styles.cellInput}
                              placeholder="SN..."
                              dense
                            />
                          </DataTable.Cell>
                          <DataTable.Cell style={styles.tableCell}>
                            <TextInput
                              value={item.itemCode}
                              onChangeText={(value) => {
                                const items = [...formikProps.values.items];
                                items[index].itemCode = value;
                                formikProps.setFieldValue('items', items);
                              }}
                              style={styles.cellInput}
                              placeholder="Code..."
                              dense
                            />
                          </DataTable.Cell>
                          <DataTable.Cell style={styles.tableCell}>
                            <TextInput
                              value={item.description}
                              onChangeText={(value) => {
                                const items = [...formikProps.values.items];
                                items[index].description = value;
                                formikProps.setFieldValue('items', items);
                              }}
                              style={styles.cellInput}
                              placeholder="Description..."
                              dense
                            />
                          </DataTable.Cell>
                          <DataTable.Cell style={styles.tableCell} numeric>
                            <TextInput
                              value={String(item.quantity)}
                              onChangeText={(value) => {
                                const items = [...formikProps.values.items];
                                items[index].quantity = parseInt(value) || 0;
                                formikProps.setFieldValue('items', items);
                              }}
                              keyboardType="numeric"
                              style={[styles.cellInput, styles.numericInput]}
                              placeholder="0"
                              dense
                            />
                          </DataTable.Cell>
                          <DataTable.Cell style={styles.tableCell}>
                            <Menu
                              visible={item.showLocationMenu}
                              onDismiss={() => {
                                const items = [...formikProps.values.items];
                                items[index].showLocationMenu = false;
                                formikProps.setFieldValue('items', items);
                              }}
                              anchor={
                                <Button
                                  mode="outlined"
                                  onPress={() => {
                                    const items = [...formikProps.values.items];
                                    items[index].showLocationMenu = true;
                                    formikProps.setFieldValue('items', items);
                                  }}
                                  style={styles.locationButton}
                                  compact
                                >
                                  {item.location.rack ? 
                                    `${item.location.rack}-${item.location.shelf}-${item.location.bin}` : 
                                    'Location'
                                  }
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
                                  leadingIcon="map-marker"
                                />
                              ))}
                            </Menu>
                          </DataTable.Cell>
                          <DataTable.Cell style={styles.tableCell}>
                            <IconButton
                              icon="delete"
                              iconColor={theme.colors.error}
                              size={20}
                              onPress={() => {
                                if (formikProps.values.items.length > 1) {
                                  const items = [...formikProps.values.items];
                                  items.splice(index, 1);
                                  formikProps.setFieldValue('items', items);
                                } else {
                                  Alert.alert('Warning', 'At least one item is required');
                                }
                              }}
                            />
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))}
                    </DataTable>
                  </View>

                  {/* Items Summary */}
                  <View style={styles.summaryContainer}>
                    <Text style={styles.summaryText}>
                      Total Items: {formikProps.values.items.length} | 
                      Total Quantity: {formikProps.values.items.reduce((sum, item) => sum + (item.quantity || 0), 0)}
                    </Text>
                  </View>
                </Card.Content>
              </Card>

              {/* Form Actions */}
              <View style={styles.actionContainer}>
                <Button
                  mode="outlined"
                  onPress={() => navigation?.goBack()}
                  style={[styles.actionButton, styles.cancelButton]}
                  icon="close"
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={() => {
                    if (formikProps.isValid) {
                      formikProps.handleSubmit();
                    } else {
                      Alert.alert('Validation Error', 'Please fill all required fields');
                    }
                  }}
                  style={[styles.actionButton, styles.submitButton]}
                  icon="printer"
                  loading={formikProps.isSubmitting}
                  disabled={formikProps.isSubmitting}
                >
                  Submit & Print
                </Button>
              </View>

              {/* Form Validation Summary */}
              {!formikProps.isValid && formikProps.submitCount > 0 && (
                <Card style={styles.errorCard}>
                  <Card.Content>
                    <Text style={styles.errorTitle}>Please fix the following errors:</Text>
                    {Object.keys(formikProps.errors).map((key) => (
                      <Text key={key} style={styles.errorText}>
                        • {formikProps.errors[key]}
                      </Text>
                    ))}
                  </Card.Content>
                </Card>
              )}
            </ScrollView>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const DateField = ({ label, value, onChange, icon = "calendar" }) => {
  const [show, setShow] = useState(false);
  const theme = useTheme();

  return (
    <View style={styles.dateFieldContainer}>
      <Button 
        mode="outlined"
        onPress={() => setShow(true)}
        style={styles.dateButton}
        icon={icon}
        contentStyle={styles.dateButtonContent}
      >
        {label}: {value.toLocaleDateString()}
      </Button>
      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShow(false);
            if (date) onChange(date);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusChip: {
    backgroundColor: '#e3f2fd',
  },
  statusText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  sectionCard: {
    marginBottom: 20,
    elevation: 2,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: '#2c3e50',
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
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    borderRadius: 8,
  },
  disabledInput: {
    backgroundColor: '#f8f9fa',
  },
  tableContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  dataTable: {
    backgroundColor: '#ffffff',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  headerCell: {
    justifyContent: 'center',
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 60,
  },
  tableCell: {
    paddingVertical: 8,
  },
  cellInput: {
    height: 40,
    fontSize: 14,
    backgroundColor: '#ffffff',
  },
  numericInput: {
    textAlign: 'center',
  },
  locationButton: {
    minWidth: 80,
    height: 36,
  },
  summaryContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    minWidth: 120,
    borderColor: '#dc3545',
  },
  submitButton: {
    minWidth: 140,
    backgroundColor: '#28a745',
  },
  errorCard: {
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc3545',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    marginBottom: 4,
  },
  dateFieldContainer: {
    flex: 1,
  },
  dateButton: {
    justifyContent: 'flex-start',
    borderRadius: 8,
  },
  dateButtonContent: {
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
  },
});

export default NewInboundForm;