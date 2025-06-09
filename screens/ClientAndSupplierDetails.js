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
    backgroundColor: "#f7fafd",
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
    width: '100%',
    height: 150,
    backgroundColor: '#eaf2fb',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    zIndex: 0,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 50,
    zIndex: 1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#eaf2fb",
    backgroundColor: '#fff',
  },
  profileName: {
    fontSize: 19,
    fontWeight: "500",
    color: "#3a6ea8",
    marginBottom: 8,
    letterSpacing: 0.1,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  profileContact: {
    fontSize: 15,
    color: "#7a8ca3",
    marginBottom: 4,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  profileLocation: {
    fontSize: 15,
    color: "#7a8ca3",
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  content: {
    padding: 18,
    paddingBottom: 64,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "500",
    marginTop: 28,
    marginBottom: 14,
    color: "#222",
    backgroundColor: '#eaf2fb',
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingVertical: 7,
    borderRadius: 22,
    overflow: 'hidden',
    letterSpacing: 0.1,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  historyCard: {
    borderRadius: 18,
    padding: 18,
    marginVertical: 10,
    elevation: 0,
    backgroundColor: '#fff',
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  historyAction: {
    fontSize: 15,
    fontWeight: "500",
    color: "#3a6ea8",
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  historyDetails: {
    fontSize: 13,
    color: "#7a8ca3",
    marginBottom: 2,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
});

export default ClientAndSupplierDetails;