import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
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
  const { details } = route.params; // Receive details from navigation
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Replace with dummy history data for now
    const dummyHistory = [
      { action: "Order Placed", date: "2025-05-01", amount: "$500" },
      { action: "Order Received", date: "2025-05-15", amount: "$300" },
      { action: "Payment Made", date: "2025-05-20", amount: "$200" },
    ];
    setHistory(dummyHistory);
  }, []);

  const handleDrawerOpen = () => {
    console.log("Drawer opened!");
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="Profile"
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.semicircleContainer}>
        <Svg
          width="100%"
          height="150"
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
          style={styles.semicircle}
        >
          <Defs>
            <LinearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#8854d0" />
              <Stop offset="100%" stopColor="#a084ee" />
            </LinearGradient>
          </Defs>
          <Path
            d="M0,50 C25,0 75,0 100,50 L100,0 L0,0 Z"
            fill="url(#purpleGradient)"
          />
        </Svg>
        <View style={styles.profileHeader}>
          <FastImage
            style={styles.profileImage}
            source={{
              uri: `https://source.unsplash.com/100x100/?profile,person&random=${Math.random()}`,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.cover}
            onError={(error) => {
              console.error('Error loading image:', error);
            }}
          />
          <Text style={styles.profileName}>{details.Name}</Text>
          {/* <Text style={styles.profileContact}>Contact: {details.Contact}</Text> */}
          <Text style={styles.profileLocation}>Location: {details.Location}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>History</Text>
        {history.map((item, index) => (
          <View key={index} style={styles.historyCard}>
            <Text style={styles.historyAction}>{item.action}</Text>
            <Text style={styles.historyDetails}>Date: {item.date}</Text>
            <Text style={styles.historyDetails}>Amount: {item.amount}</Text>
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
    backgroundColor: "#f4f6f8",
  },
  semicircleContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 24,
  },
  semicircle: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "white",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 8,
  },
  profileContact: {
    fontSize: 16,
    color: "black",
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 16,
    color: "black",
  },
  content: {
    padding: 16,
    paddingBottom: 64,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
    color: "#202124",
  },
  historyCard: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 2,
    backgroundColor: "white",
  },
  historyAction: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  historyDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
});

export default ClientAndSupplierDetails;