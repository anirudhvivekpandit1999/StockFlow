// DispatchedOrders screen using METAS design principles

import React, { useState } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { ScrollView, Text } from "react-native-gesture-handler";
import { Icon } from "react-native-paper";
import AppBar from "../src/components/layout/AppBar";
import SideBar from "../src/components/common/SideBar";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import { useNavigation } from "@react-navigation/native";

const DispatchedOrders = () => {
  const [sideBar, showSidebar] = useState(false);
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const toggleSideBar = () => showSidebar(true);
  const onClose = () => showSidebar(false);

  const handleDrawerOpen = () => console.log("Drawer opened!");

  return (
    <View style={styles.container}>
      <AppBar
        title={<Text style={styles.title}>Stock Flow</Text>}
        onMenuPress={toggleSideBar}
        onBackPress={() => navigation.goBack()}
      />

      {sideBar && <SideBar onClose={onClose} />}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={[styles.card, { width: width - 48, height: height / 3 - 20 }]}
          onPress={() => navigation.navigate("PurchaseOrderForm")}
        >
          <View style={styles.cardInner}>
            <Icon source="arrow-down" color="#2e7d32" size={32} />
            <Text style={styles.cardTitle}>Received Orders</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { width: width - 48, height: height / 3 - 20 }]}
          onPress={() => navigation.navigate("SalesOrderForm")}
        >
          <View style={styles.cardInner}>
            <Icon source="arrow-up" color="#c62828" size={32} />
            <Text style={styles.cardTitle}>Dispatched Orders</Text>
          </View>
        </TouchableOpacity>
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
  title: {
    fontSize: 20,
    fontWeight: Platform.OS === "ios" ? "600" : "bold",
    color: "white",
    letterSpacing: 0.3,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 24,
    marginVertical: 16,
    elevation: 3,
    shadowColor: "#1565c0",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#e3ecff",
  },
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 14,
    color: "#1565c0",
    letterSpacing: 0.2,
    fontFamily: Platform.OS === "ios" ? "San Francisco" : undefined,
  },
});

export default DispatchedOrders;