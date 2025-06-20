// Dashboard screen with METAS Design Principles + Top 4 Icons

import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Animated,
  Easing,
  useWindowDimensions,
  Platform,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { ScrollView, Text } from "react-native-gesture-handler";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AppBar from "../src/components/layout/AppBar";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import SideBar from "../src/components/common/SideBar";
import { GlobalContext } from "../src/services/GlobalContext";
import apiServices from "../src/services/apiServices";
import { syncInventory } from "../src/services/syncService";
import NetInfo from "@react-native-community/netinfo";
import LinearGradient from "react-native-linear-gradient";
import { StackedBarChart, PieChart } from "react-native-chart-kit";
import { Button, useTheme } from "react-native-paper";
import ActivityItem from "../src/components/stock/ActivityItem";

const Dashboard = () => {
  const [sideBar, showSidebar] = useState(false);
  const [bardata, setBardata] = useState([]);
  const [count, setCount] = useState({ recieved: 0, dispatched: 0, transferred: 0 });
  const [recentActivities, setRecentActivities] = useState([]);
  const [syncStatus, setSyncStatus] = useState("idle");
  const { warehouseId } = useContext(GlobalContext);
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const theme = useTheme();

  const bgAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(bgAnim, { toValue: 1, duration: 1200, useNativeDriver: false }).start();
    Animated.timing(cardsAnim, { toValue: 1, duration: 900, delay: 400, easing: Easing.out(Easing.exp), useNativeDriver: true }).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAnalysisData();
    }, [warehouseId])
  );

  const fetchAnalysisData = async () => {
    const result = await apiServices.getAnalysis({ WarehouseId: warehouseId });
    const data = JSON.parse(result.Data);
    setBardata(data.BarData);
    setRecentActivities(data.Top2Activities);
    setCount({
      recieved: JSON.parse(data.RecievedCount).RecievedCount,
      dispatched: JSON.parse(data.DispatchedCount).DispatchedCount,
      transferred: JSON.parse(data.TransferredCount).TransferredCount,
    });
  };

  const toggleSideBar = () => showSidebar(true);
  const closeSidebar = () => showSidebar(false);
  const handleDrawerOpen = () => console.log("Drawer opened!");

  const syncWithStatus = async () => {
    setSyncStatus("syncing");
    try {
      await syncInventory();
      setSyncStatus("success");
    } catch {
      setSyncStatus("error");
    } finally {
      setTimeout(() => setSyncStatus("idle"), 2000);
    }
  };

  useEffect(() => {
    syncWithStatus();
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) syncWithStatus();
    });
    return () => unsubscribe();
  }, []);

  const pieData = [
    { name: "Recieved", population: count.recieved, color: "#ffb3b3", legendFontColor: "#000", legendFontSize: 13 },
    { name: "Dispatch", population: count.dispatched, color: "#8aeefc", legendFontColor: "#000", legendFontSize: 13 },
    { name: "Transfer", population: count.transferred, color: "#fabe3f", legendFontColor: "#000", legendFontSize: 13 },
  ];

  const leastStocks = bardata.sort((a, b) => a.Count - b.Count).slice(0, 3);
  const stackedBarData = {
    labels: leastStocks.map(item => item.ProductName),
    legend: ["Stock"],
    data: leastStocks.map(item => [item.Count]),
    barColors: ["#1976d2"]
  };

  const cardsTranslateY = cardsAnim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#e3ecff", "#f9f9f9"]} style={styles.gradientBg} />
      <AppBar title={<Text style={styles.dashboardTitle}>Stock Flow</Text>} onMenuPress={toggleSideBar} />

      <View style={styles.syncStatus}>
        {syncStatus === "syncing" && <Text style={styles.syncTextWarning}>Syncing...</Text>}
        {syncStatus === "success" && <Text style={styles.syncTextSuccess}>Synced ✓</Text>}
        {syncStatus === "error" && <Text style={styles.syncTextError}>Sync Failed</Text>}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: cardsAnim, transform: [{ translateY: cardsTranslateY }] }}>

          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Home")}> 
              <ImageBackground source={require("../src/assets/background.png")} style={styles.iconImage} imageStyle={styles.iconImageInner} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Inventory")}> 
              <ImageBackground source={require("../src/assets/Media.png")} style={styles.iconImage} imageStyle={styles.iconImageInner} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("reports")}> 
              <ImageBackground source={require("../src/assets/reports.png")} style={styles.iconImage} imageStyle={styles.iconImageInner} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("ClientAndSupplierManagementScreen")}> 
              <ImageBackground source={require("../src/assets/ClientAndSupplierConnectionIcon.png")} style={styles.iconImage} imageStyle={styles.iconImageInner} />
            </TouchableOpacity>
          </View>

          <View style={styles.chartCard}>
            <StackedBarChart
              data={stackedBarData}
              width={width - 40}
              height={220}
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                color: () => "#1976d2",
                labelColor: () => "#333",
              }}
              fromZero
              showValuesOnTopOfBars
              style={styles.chartStyle}
            />
          </View>

          <View style={styles.activitiesCard}>
            {recentActivities.map((t, i) => (
              <ActivityItem
                key={i}
                type={t.StockStatus.toLowerCase()}
                title={`${t.StockStatus}: ${t.Name}`}
                details={`${t.Count} - ${t.Location}`}
                time={t.TimeAgo}
                iconName={
                  t.StockStatus === "Recieved" ? "arrow-downward" :
                  t.StockStatus === "Dispatched" ? "arrow-upward" : "swap-horiz"
                }
              />
            ))}
          </View>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate("AllActivity")}
            style={styles.viewAllButton}
            labelStyle={styles.viewAllButtonText}
          >
            View All Activity
          </Button>

          <View style={styles.pieCard}>
            <PieChart
              data={pieData}
              width={width - 40}
              height={220}
              chartConfig={{
                color: () => `#000`,
                labelColor: () => `#000`
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chartStyle}
            />
          </View>
        </Animated.View>
      </ScrollView>

      <BottomNavigation onOpen={handleDrawerOpen} />
      {sideBar && <SideBar onClose={closeSidebar} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  gradientBg: { position: "absolute", top: 0, left: 0, right: 0, height: 180, zIndex: -1 },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  syncStatus: { position: "absolute", top: 16, right: 16, zIndex: 100 },
  syncTextWarning: { color: "#FFA500", fontWeight: "bold" },
  syncTextSuccess: { color: "#4CAF50", fontWeight: "bold" },
  syncTextError: { color: "#F44336", fontWeight: "bold" },
  content: { padding: 20, paddingBottom: 40 },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
  },
  iconButton: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#f4f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1565c0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e3ecff',
  },
  iconImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },
  iconImageInner: {
    borderRadius: 14,
    resizeMode: 'cover',
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  activitiesCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  viewAllButton: {
    borderRadius: 14,
    borderColor: "#1976d2",
    borderWidth: 1.5,
    backgroundColor: "#fff",
    marginVertical: 18,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  viewAllButtonText: {
    color: "#1976d2",
    fontWeight: "700",
    fontSize: 16,
  },
  pieCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
  },
  chartStyle: {
    borderRadius: 16,
  },
});

export default Dashboard;
