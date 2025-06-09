import React, { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AppBar from "../src/components/layout/AppBar";
import SideBar from "../src/components/common/SideBar";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import { Icon, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

const DispatchedOrders = () => {
  const [sideBar, showSidebar] = useState(false);
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();

  const toggleSideBar = () => showSidebar(true);
  const onClose = () => showSidebar(false);

  const handleDrawerOpen = () => {
    console.log("Drawer opened!");
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="Stock Flow"
        onMenuPress={toggleSideBar}
        onBackPress={() => navigation.goBack()}
      />

      {sideBar && <SideBar onClose={onClose} />}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={[styles.card, { width: width - 48, height: height /3 -10}]} onPress={()=>navigation.navigate('PurchaseOrderForm')}>
          <View style={styles.cardInner}>
            <Icon source="arrow-down" color="#28a745" size={28} />
            <Text style={styles.cardTitle}>Received Orders</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { width: width - 48, height: height /3 -10 }]} onPress={()=>navigation.navigate('SalesOrderForm')}>
          <View style={styles.cardInner}>
            <Icon source="arrow-up" color="#dc3545" size={28} />
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
  content: {
    padding: 18,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 24,
    marginVertical: 16,
    elevation: 0,
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: '#e3eaf3',
  },
  cardInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "500",
    marginLeft: 14,
    color: "#3a6ea8",
    letterSpacing: 0.1,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
});

export default DispatchedOrders;
