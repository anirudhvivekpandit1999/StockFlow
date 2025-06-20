// ReceivedOrders.js
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, View, Platform } from "react-native";
import { Text } from "react-native-paper";
import AppBar from "../src/components/layout/AppBar";
import SideBar from "../src/components/common/SideBar";
import BottomNavigation from "../src/components/layout/BottomNavigation";

const ReceivedOrders = () => {
  const [sideBar, showSideBar] = useState(false);

  const toggleSideBar = () => showSideBar(true);
  const onClose = () => showSideBar(false);

  const handleDrawerOpen = () => {
    console.log("Drawer opened!");
  };

  return (
    <View style={styles.container}>
      <AppBar title="Received Orders" onMenuPress={toggleSideBar} />
      {sideBar && <SideBar onClose={onClose} />}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Received Orders</Text>
          <Text style={styles.subText}>
            This screen will list all incoming orders for your warehouse.
          </Text>
        </View>
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
    padding: 20,
    paddingBottom: 100,
  },
  headingContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    borderColor: "#e3eaf3",
    borderWidth: 1,
  },
  headingText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "San Francisco" : undefined,
    letterSpacing: 0.3,
  },
  subText: {
    fontSize: 15,
    fontWeight: "400",
    color: "#6e6e6e",
    fontFamily: Platform.OS === "ios" ? "San Francisco" : undefined,
    letterSpacing: 0.2,
  },
});

export default ReceivedOrders;
