import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import BottomNavigation from "../layout/BottomNavigation";
import { Icon, Text } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import SideBar from "../common/SideBar";
import AppBar from "../layout/AppBar";
import { useWindowDimensions } from "react-native";
import apiServices from "../../services/apiServices";

const SalesOrderForm = ({ navigation }) => {
  const [sideBar, showSidebar] = useState(false);
  const { width, height } = useWindowDimensions();

  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const toggleSideBar = () => showSidebar(true);
  const onClose = () => showSidebar(false);

  const handleDrawerOpen = () => {
    console.log("Drawer opened!");
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleSubmitOrder = () => {
    console.log("Sales order submitted:", { customerName, items });
    // Add backend submission logic here
    items.map(async(item)=>{
        var result = await apiServices.sendOrderRequest({Flag : 2 , ProductName : item , Count : 1 , Name : customerName})
    })
    Alert.alert('Successfully generated Sales Request , Please check with your Administrator')
    setItems([])
    setCustomerName('')
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="Sales Order"
        onMenuPress={toggleSideBar}
        onBackPress={() => navigation.goBack()}
      />
      {sideBar && <SideBar onClose={onClose} />}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Customer Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Customer Information</Text>
            <TextInput
              placeholder="Enter customer name"
              style={styles.input}
              value={customerName}
              onChangeText={setCustomerName}
            />
          </View>

          {/* Item List */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Items to Sell</Text>
            <View style={styles.row}>
              <TextInput
                placeholder="Add item to sell"
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                value={newItem}
                onChangeText={setNewItem}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                <Icon source="plus" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.listItem}>• {item}</Text>
              )}
              style={{ marginTop: 12 }}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmitOrder}>
            <Text style={styles.submitText}>Submit Sales Order</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNavigation onOpen={handleDrawerOpen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafd",
  },
  content: {
    padding: 18,
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 24,
    marginVertical: 16,
    elevation: 0,
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e3eaf3',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "500", 
    marginBottom: 12,
    color: "#3a6ea8",
    letterSpacing: 0.1,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  input: {
    backgroundColor: "#fafdff",
    padding: 12,
    borderRadius: 14,
    fontSize: 16,
    color: "#222",
    borderWidth: 1,
    borderColor: '#e3eaf3',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#3a6ea8",
    padding: 12,
    borderRadius: 16,
    marginLeft: 2,
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 0,
  },
  listItem: {
    fontSize: 16,
    color: "#7a8ca3",
    paddingVertical: 4,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  submitButton: {
    backgroundColor: "#3a6ea8",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 22,
    marginTop: 28,
    width: "100%",
    alignItems: "center",
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 0,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.1,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
});

export default SalesOrderForm;
