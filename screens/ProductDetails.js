// Product Details Screen - METAS Design

import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  useWindowDimensions,
  BackHandler,
  Platform,
} from "react-native";
import { ScrollView, Text } from "react-native-gesture-handler";
import AppBar from "../src/components/layout/AppBar";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import apiServices from "../src/services/apiServices";
import { GlobalContext } from "../src/services/GlobalContext";

const ProductDetails = () => {
  const [productdetails, setproductdetails] = useState({});
  const route = useRoute();
  const navigation = useNavigation();
  const { name } = route.params || {};
  const { height, width } = useWindowDimensions();
  const { warehouseId } = useContext(GlobalContext);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Inventory");
        return true;
      };
      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  useEffect(() => {
    fetchProductDetails();
  }, [name]);

  const fetchProductDetails = async () => {
    try {
      const result = await apiServices.getInventoryDetails({ ProductName: name, WarehouseId: warehouseId });
      if (result.Status === 200) {
        setproductdetails(JSON.parse(result.Data));
      }
    } catch (error) {
      console.log("Error fetching product details:", error);
    }
  };

  const formatDate = (mssqlDate) => {
    const date = new Date(mssqlDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  return (
    <View style={styles.container}>
      <AppBar title="Product Details" onMenuPress={() => {}} />

      <View style={[styles.topContainer, { height: height / 2.7 }]}>
        <View style={styles.productHeader}>
          <View style={styles.productBadge}>
            <View style={styles.accentDot} />
            <Text style={styles.productTitle}>{productdetails.ProductName}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Serial Number</Text>
            <Text style={styles.value}>{productdetails.ProductSerialNumber}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>{productdetails.Location}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={[styles.statsRow, { width }]}>
        <View style={styles.statCard}>
          <Text style={styles.label}>Count</Text>
          <Text style={styles.statValue}>{productdetails.Count}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.label}>Last Modified By</Text>
          <Text style={styles.statValue}>{productdetails.Username || "No user"}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.label}>Last Modified On</Text>
          <Text style={styles.statValue}>{formatDate(productdetails.LastModifiedOn)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} />

      <BottomNavigation onOpen={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafc",
  },
  topContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "#f9fafc",
    paddingTop: 32,
  },
  productHeader: {
    alignItems: "center",
    marginBottom: 8,
  },
  productBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eaf3ff",
    borderRadius: 32,
    paddingHorizontal: 28,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: "#b3c6e6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  accentDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4e8df5",
    marginRight: 8,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#222",
    letterSpacing: 0.3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 12,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    minWidth: 140,
    alignItems: "center",
    borderColor: "#e0eaf5",
    borderWidth: 1,
    elevation: 1,
  },
  label: {
    fontSize: 13,
    color: "#6c7a8a",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e1e9f2",
    marginHorizontal: 24,
    marginVertical: 18,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    minWidth: 100,
    borderWidth: 1,
    borderColor: "#e1e9f2",
  },
  statValue: {
    color: "#3a6ea8",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
});

export default ProductDetails;