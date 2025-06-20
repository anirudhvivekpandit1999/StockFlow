// AllActivity screen with METAS Design Principles

import React, { useState } from "react";
import SideBar from "../src/components/common/SideBar";
import AppBar from "../src/components/layout/AppBar";
import { Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BottomNavigation from "../src/components/layout/BottomNavigation";

const AllActivity = () => {
  const [sideBar, showSideBar] = useState(false);

  const toggleSideBar = () => showSideBar(true);
  const onClose = () => showSideBar(false);
  const handleDrawerOpen = () => console.log("Drawer opened!");

  return (
    <View style={styles.container}>
      <AppBar title="Stock Flow" onMenuPress={toggleSideBar} />

      {sideBar && <SideBar onClose={onClose} />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.heading}>📋 All Activity</Text>
        <Text style={styles.paragraph}>
          This screen will display all recent stock activities, including inbound, outbound,
          returns, and transfers. You can filter or search based on date, status, and type.
        </Text>
      </ScrollView>

      <BottomNavigation onOpen={handleDrawerOpen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa"
  },
  scrollContent: {
    padding: 16,
    gap: 12
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#2c3e50"
  },
  paragraph: {
    fontSize: 16,
    color: "#555"
  }
});

export default AllActivity;
