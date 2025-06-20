// Client and Supplier Details with METAS Design Principles

import React, { useEffect, useState } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { Text } from "react-native-paper";
import AppBar from "../src/components/layout/AppBar";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import FastImage from "react-native-fast-image";

const ClientAndSupplierDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { details } = route.params;
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const dummyHistory = [
      { action: "Order Placed", date: "2025-05-01", amount: "$500" },
      { action: "Order Received", date: "2025-05-15", amount: "$300" },
      { action: "Payment Made", date: "2025-05-20", amount: "$200" },
    ];
    setHistory(dummyHistory);
  }, []);

  const handleDrawerOpen = () => console.log("Drawer opened!");

  return (
    <View style={styles.container}>
      <AppBar title="Profile" onBackPress={() => navigation.goBack()} />

      <View style={styles.headerSection}>
        <Svg width="100%" height="150" viewBox="0 0 100 50" preserveAspectRatio="none" style={styles.svgCurve}>
          <Defs>
            <LinearGradient id="profileGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#5f72be" />
              <Stop offset="100%" stopColor="#9921e8" />
            </LinearGradient>
          </Defs>
          <Path d="M0,50 C25,0 75,0 100,50 L100,0 L0,0 Z" fill="url(#profileGradient)" />
        </Svg>

        <View style={styles.profileInfo}>
          <FastImage
            style={styles.profileImage}
            source={{ uri: `https://source.unsplash.com/100x100/?profile&random=${Math.random()}`, priority: FastImage.priority.high }}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text style={styles.profileName}>{details.Name}</Text>
          <Text style={styles.profileLocation}>Location: {details.Location}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>📜 History</Text>

        {history.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{item.action}</Text>
            <Text style={styles.cardSub}>Date: {item.date}</Text>
            <Text style={styles.cardSub}>Amount: {item.amount}</Text>
          </View>
        ))}
      </ScrollView>

      <BottomNavigation onOpen={handleDrawerOpen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6fb",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  svgCurve: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  profileInfo: {
    marginTop: 60,
    alignItems: "center",
    zIndex: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#3a3a3a",
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 14,
    color: "#666",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 16,
    alignSelf: "center",
    backgroundColor: "#e1e4f2",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3a6ea8",
    marginBottom: 6,
  },
  cardSub: {
    fontSize: 14,
    color: "#555",
  },
});

export default ClientAndSupplierDetails;
