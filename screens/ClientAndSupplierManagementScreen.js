import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import AppBar from "../src/components/layout/AppBar";
import { useNavigation } from "@react-navigation/native";
import SideBar from "../src/components/common/SideBar";
import { ScrollView } from "react-native-gesture-handler";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import { TouchableOpacity } from "react-native";

const ClientAndSupplierManagementScreen = () => {
  const [sideBar, showSidebar] = useState(false);
  const [clientsAndSuppliers, setClientsAndSuppliers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Replace API call with dummy data
    const dummyData = [
      { Name: "Client A", Contact: "123-456-7890", Location: "New York" },
      { Name: "Supplier B", Contact: "987-654-3210", Location: "Los Angeles" },
      { Name: "Client C", Contact: "555-555-5555", Location: "Chicago" },
      { Name: "Supplier D", Contact: "111-222-3333", Location: "Houston" },
    ];
    setClientsAndSuppliers(dummyData);
  }, []);

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
            <Text style={styles.details}>Contact: {item.Contact}</Text>
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
    backgroundColor: "#f4f6f8",
  },
  content: {
    padding: 16,
    paddingBottom: 64,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
    backgroundColor: "white",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
});

export default ClientAndSupplierManagementScreen;