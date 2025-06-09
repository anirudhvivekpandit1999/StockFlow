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
    backgroundColor: "#f1f3f6",
  },
  content: {
    padding: 16,
    alignItems: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#343a40",
  },
  input: {
    backgroundColor: "#f0f2f5",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    color: "#212529",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#17a2b8",
    padding: 12,
    borderRadius: 8,
  },
  listItem: {
    fontSize: 16,
    color: "#495057",
    paddingVertical: 4,
  },
  submitButton: {
    backgroundColor: "#ffc107",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
    width: "100%",
    alignItems: "center",
  },
  submitText: {
    color: "#212529",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SalesOrderForm;
