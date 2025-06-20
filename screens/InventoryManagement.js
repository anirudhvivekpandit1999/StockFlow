// Inventory Management Screen - METAS UI

import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Alert,
  StyleSheet,
  useWindowDimensions,
  View,
  Animated,
  Easing,
  Dimensions,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { FlatList, ScrollView, Text } from "react-native-gesture-handler";
import AppBar from "../src/components/layout/AppBar";
import { GlobalContext } from "../src/services/GlobalContext";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import SideBar from "../src/components/common/SideBar";
import { Divider, FAB, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import apiServices from "../src/services/apiServices";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const { width: screenWidth } = Dimensions.get("window");

const InventoryManagement = () => {
  const { showSidebar, setShowSidebar, warehouseId } = useContext(GlobalContext);
  const [inventoryListData, setInventoryListData] = useState([]);
  const navigation = useNavigation();
  const theme = useTheme();
  const { width } = useWindowDimensions();

  const bgAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(bgAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    }).start();
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 900,
      delay: 400,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    fetchInventoryList();
  }, []);

  const fetchInventoryList = async () => {
    try {
      const result = await apiServices.getInventoryList({ WarehouseId: warehouseId });
      if (result.Status === 200) {
        setInventoryListData(JSON.parse(result.Data));
      }
    } catch (error) {
      console.error("Error fetching inventory list:", error);
    }
  };

  const toggleSideBar = () => setShowSidebar(true);
  const closeSidebar = () => setShowSidebar(false);
  const handleDrawerOpen = () => {};

  const bgColor = bgAnim.interpolate({ inputRange: [0, 1], outputRange: ["#fff", "#f9f9f9"] });
  const cardTranslateY = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  return (
    <View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: bgColor }]} />
      <AppBar title="Inventory" onMenuPress={toggleSideBar} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: cardAnim, transform: [{ translateY: cardTranslateY }] }}>
          <FlatList
            data={inventoryListData}
            keyExtractor={item => item.ProductSerialNumber}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("ProductDetails", { name: item.ProductName })}
                activeOpacity={0.9}
              >
                <View style={styles.cardHeaderRow}>
                  <Image source={require("../src/assets/Media.png")} style={styles.cardIcon} resizeMode="cover" />
                  <Text style={styles.cardTitle}>{item.ProductName}</Text>
                </View>
                <Text style={styles.cardLocation}>Location: {item.Location}</Text>
                <Divider style={styles.cardDivider} />
                <View style={styles.cardDetailsRow}>
                  <Text style={styles.cardDetail}>Count: {item.Count}</Text>
                  <Text style={styles.cardDetail}>Serial: {item.ProductSerialNumber}</Text>
                </View>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        </Animated.View>
      </ScrollView>

      <FAB
        icon={({ size }) => <Icon name="qrcode-scan" size={size} color="#fff" />}
        style={styles.fab}
        color="#fff"
        onPress={() => navigation.navigate("QRScanner")}
      />

      <BottomNavigation onOpen={handleDrawerOpen} />
      {showSidebar && <SideBar onClose={closeSidebar} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 40 },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 80,
    backgroundColor: "#1976d2",
    elevation: 3,
    borderRadius: 32,
    zIndex: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#e3ecff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  cardIcon: {
    width: 42,
    height: 42,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: "#f0f4ff",
    borderWidth: 1,
    borderColor: "#d6e2ff",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    letterSpacing: 0.2,
  },
  cardLocation: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#6e6e6e",
    marginBottom: 6,
  },
  cardDivider: {
    backgroundColor: "#e3ecff",
    marginVertical: 6,
    height: 1,
  },
  cardDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  cardDetail: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#1976d2",
  },
});

export default InventoryManagement;