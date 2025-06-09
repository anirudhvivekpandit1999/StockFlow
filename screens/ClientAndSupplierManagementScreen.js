import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import AppBar from "../src/components/layout/AppBar";
import { useNavigation } from "@react-navigation/native";
import SideBar from "../src/components/common/SideBar";
import { ScrollView } from "react-native-gesture-handler";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import { TouchableOpacity } from "react-native";
import apiServices from "../src/services/apiServices";
import { GlobalContext } from "../src/services/GlobalContext";

const ClientAndSupplierManagementScreen = () => {
  const [sideBar, showSidebar] = useState(false);
  const [clientsAndSuppliers, setClientsAndSuppliers] = useState([]);
  const navigation = useNavigation();
  const {warehouseId} = useContext(GlobalContext);

  useEffect(() => {
    // Replace API call with dummy data
    const dummyData = [
      { Name: "Client A", Contact: "123-456-7890", Location: "New York" },
      { Name: "Supplier B", Contact: "987-654-3210", Location: "Los Angeles" },
      { Name: "Client C", Contact: "555-555-5555", Location: "Chicago" },
      { Name: "Supplier D", Contact: "111-222-3333", Location: "Houston" },
    ];
    setClientsAndSuppliers(dummyData);
    fetchClientsAndSuppliersList();
  }, []);
  async function fetchClientsAndSuppliersList(){
    try {
      const result = await apiServices.getAllClientsAndSuppliersData({WarehouseId : warehouseId})
      console.log("Clients and Suppliers Data:", result.Data);
    } catch (error) {
      console.error("Error fetching clients and suppliers data:", error);
    }
  }
  function toggleSideBar() {
    showSidebar(true);
  }

  function closeSidebar() {
    showSidebar(false);
  }

  const handleDrawerOpen = () => {
    console.log("Drawer opened!");
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="Stock Flow"
        onMenuPress={() => toggleSideBar()}
        onBackPress={() => navigation.goBack()}
      />
      {sideBar && <SideBar onClose={closeSidebar} />}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {clientsAndSuppliers.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate('ClientAndSupplierDetails', { details: item })}
            style={styles.card}
          >
            <Text style={styles.title}>{item.Name}</Text>
            {/* <Text style={styles.details}>Contact: {item.Contact}</Text> */}
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
    backgroundColor: "#f7fafd",
  },
  content: {
    padding: 18,
    paddingBottom: 64,
  },
  card: {
    borderRadius: 18,
    padding: 20,
    marginVertical: 12,
    elevation: 0,
    backgroundColor: "#fff",
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e3eaf3',
  },
  title: {
    fontSize: 17,
    fontWeight: "500",
    color: "#3a6ea8",
    marginBottom: 4,
    letterSpacing: 0.1,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  details: {
    fontSize: 14,
    color: "#7a8ca3",
    marginBottom: 2,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
});

export default ClientAndSupplierManagementScreen;