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
import { useWindowDimensions } from "react-native";
import { Icon, Text } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import BottomNavigation from "../layout/BottomNavigation";
import SideBar from "../common/SideBar";
import AppBar from "../layout/AppBar";
import apiServices from "../../services/apiServices";

const PurchaseOrderForm = ({ navigation }) => {
  const [sideBar, showSidebar] = useState(false);
  const { width } = useWindowDimensions();

  const [supplierName, setSupplierName] = useState("");
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
    console.log("Order submitted:", { supplierName, items });
    items.map(async (item) => {
      await apiServices.sendOrderRequest({
        Flag: 1,
        ProductName: item,
        Count: 1,
        Name: supplierName,
      });
    });
    Alert.alert("Success", "Purchase order email sent to the respective team.");
    setItems([]);
    setSupplierName("");
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="Purchase Order"
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
          {/* Supplier Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Supplier Information</Text>
            <TextInput
              placeholder="Enter supplier name"
              style={styles.input}
              value={supplierName}
              onChangeText={setSupplierName}
              placeholderTextColor="#a0aab8"
            />
          </View>

          {/* Item List */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Items to Order</Text>
            <View style={styles.row}>
              <TextInput
                placeholder="Add new item"
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                value={newItem}
                onChangeText={setNewItem}
                placeholderTextColor="#a0aab8"
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
            <Text style={styles.submitText}>Submit Purchase Order</Text>
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
    backgroundColor: "#f4f6f8",
  },
  content: {
    padding: 18,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
    shadowColor: "#b3c6e6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#e3eaf3",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#3a6ea8",
    marginBottom: 12,
    fontFamily: Platform.OS === "ios" ? "San Francisco" : undefined,
  },
  input: {
    backgroundColor: "#fafdff",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    fontSize: 15,
    color: "#222",
    borderWidth: 1,
    borderColor: "#e3eaf3",
    fontFamily: Platform.OS === "ios" ? "San Francisco" : undefined,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#3a6ea8",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#b3c6e6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  listItem: {
    fontSize: 15,
    color: "#5a6b83",
    paddingVertical: 6,
    fontFamily: Platform.OS === "ios" ? "San Francisco" : undefined,
  },
  submitButton: {
    backgroundColor: "#3a6ea8",
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 32,
    shadowColor: "#b3c6e6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
    fontFamily: Platform.OS === "ios" ? "San Francisco" : undefined,
  },
});

export default PurchaseOrderForm;
