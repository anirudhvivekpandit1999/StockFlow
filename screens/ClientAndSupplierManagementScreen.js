import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import AppBar from "../src/components/layout/AppBar";
import { useNavigation } from "@react-navigation/native";
import SideBar from "../src/components/common/SideBar";
import { ScrollView } from "react-native-gesture-handler";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import apiServices from "../src/services/apiServices";
import { GlobalContext } from "../src/services/GlobalContext";

const ClientAndSupplierManagementScreen = () => {
  const [sideBar, showSidebar] = useState(false);
  const [clientsAndSuppliers, setClientsAndSuppliers] = useState([]);
  const navigation = useNavigation();
  const { warehouseId } = useContext(GlobalContext);

  useEffect(() => {
    const dummyData = [
      { Name: "Client A", Contact: "123-456-7890", Location: "New York" },
      { Name: "Supplier B", Contact: "987-654-3210", Location: "Los Angeles" },
      { Name: "Client C", Contact: "555-555-5555", Location: "Chicago" },
      { Name: "Supplier D", Contact: "111-222-3333", Location: "Houston" },
    ];
    setClientsAndSuppliers(dummyData);
    fetchClientsAndSuppliersList();
  }, []);

  async function fetchClientsAndSuppliersList() {
    try {
      const result = await apiServices.getAllClientsAndSuppliersData({ WarehouseId: warehouseId });
      console.log("Clients and Suppliers Data:", result.Data);
      // setClientsAndSuppliers(result.Data); // Uncomment to use actual data
    } catch (error) {
      console.error("Error fetching clients and suppliers data:", error);
    }
  }

  const toggleSideBar = () => showSidebar(true);
  const closeSidebar = () => showSidebar(false);
  const handleDrawerOpen = () => console.log("Drawer opened!");

  return (
    <View style={styles.container}>
      <AppBar title="Client & Supplier Management" onMenuPress={toggleSideBar} onBackPress={() => navigation.goBack()} />
      {sideBar && <SideBar onClose={closeSidebar} />}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>🧾 Select a Profile</Text>
        <Text style={styles.subheading}>Tap on a client or supplier to view more details</Text>

        {clientsAndSuppliers.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate("ClientAndSupplierDetails", { details: item })}
            style={styles.card}
          >
            <Text style={styles.title}>{item.Name}</Text>
            <Text style={styles.details}>Location: {item.Location}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNavigation onOpen={handleDrawerOpen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
    gap: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e3eaf3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#3a6ea8",
    marginBottom: 6,
  },
  details: {
    fontSize: 13,
    color: "#6c757d",
  },
});

export default ClientAndSupplierManagementScreen;