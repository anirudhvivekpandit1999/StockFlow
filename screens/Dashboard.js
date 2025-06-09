import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
import { ImageBackground, StyleSheet, useWindowDimensions, View, Animated, Easing } from "react-native";
import { ScrollView, Text } from "react-native-gesture-handler";
import AppBar from "../src/components/layout/AppBar";
import { GlobalContext } from "../src/services/GlobalContext";
import { toggleSideBar } from "../src/services/globals";
import SideBar from "../src/components/common/SideBar";
import { BarChart, PieChart, StackedBarChart } from "react-native-chart-kit";
import { Button, useTheme } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import ActivityItem from "../src/components/stock/ActivityItem";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native-svg";
import apiServices from "../src/services/apiServices";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import { syncInventory } from '../src/services/syncService';
import NetInfo from '@react-native-community/netinfo';

const Dashboard = () => {
  const [sideBar, showSidebar] = useState(false);
  const [bardata, setBardata] = useState([]);
  const [count, setCount] = useState({ "recieved": 0, "dispatched": 0, "transferred": 0 })
  const [recentActivities, setRecentActivities] = useState([]);
  const [syncStatus, setSyncStatus] = useState('idle');
  const theme = useTheme();
  const navigation = useNavigation();
  const { warehouseId } = useContext(GlobalContext);
  const { width } = useWindowDimensions();

  // Animation refs
  const bgAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(bgAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    }).start();
    Animated.timing(cardsAnim, {
      toValue: 1,
      duration: 900,
      delay: 400,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAnalysisData();
    }, [warehouseId])
  );
  const fetchAnalysisData = async () => {
    var result = await apiServices.getAnalysis({ WarehouseId: warehouseId });
    setBardata(JSON.parse(result.Data).BarData);
    setRecentActivities(JSON.parse(result.Data).Top2Activities);
    setCount({
      "recieved": JSON.parse(JSON.parse(result.Data).RecievedCount).RecievedCount,
      "dispatched": JSON.parse(JSON.parse(result.Data).DispatchedCount).DispatchedCount,
      "transferred": JSON.parse(JSON.parse(result.Data).TransferredCount).TransferredCount
    })
  }
  function toggleSideBar() {
    showSidebar(true)
  } function closeSidebar() {
    showSidebar(false)
  }
  const pieData = [
    {
      name: "Recieved",
      population: count.recieved,
      color: "rgba(255, 135, 135, 0.44)",
      legendFontColor: "#fff",
      legendFontSize: 13
    },
    {
      name: "Dispatch",
      population: count.dispatched,
      color: "rgba(138, 238, 252, 0.7)",
      legendFontColor: "#fff",
      legendFontSize: 13
    },
    {
      name: "Transfer",
      population: count.transferred,
      color: "rgba(250, 191, 63, 0.7)",
      legendFontColor: "#fff",
      legendFontSize: 13
    }
  ];
  const leastStocks = (bardata || [])
    .sort((a, b) => a.Count - b.Count)
    .slice(0, 3);
  const barData = {
    labels: leastStocks.map(item => item.ProductName),
    datasets: [
      {
        data: leastStocks.map(item => item.Count)
      }
    ]
  };
  const stackedBarDataFromBarData = {
    labels: barData.labels,
    legend: ['Value'],
    data: barData.datasets[0].data.map(val => [Number(val)]),
    barColors: ['#fff'],
  };
  const handleDrawerOpen = () => {
    console.log('Drawer opened!');
  };
  const syncWithStatus = async () => {
    setSyncStatus('syncing');
    try {
      await syncInventory();
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (e) {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  };
  useEffect(() => {
    syncWithStatus();
  }, []);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncWithStatus();
      }
    });
    return () => unsubscribe();
  }, []);

  // Animated background colors
  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f9f9f9', '#f9f9f9']
  });
  // bgOverlay removed, not used in new design
  const gradientColors = ['#e3ecff', '#f9f9f9', '#f9f9f9'];
  const cardsOpacity = cardsAnim;
  const cardsTranslateY = cardsAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0]
  });

  return (
    <View style={styles.container}>
      {/* Soft blue gradient at the top for visual interest */}
      <LinearGradient
        colors={gradientColors}
        style={styles.gradientBg}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: bgColor, zIndex: -2 }]} />
      <AppBar
        title={<Text style={styles.dashboardTitle}>Stock Flow</Text>}
        onMenuPress={() => toggleSideBar(showSidebar)}
      />
      {/* Divider below AppBar for separation */}
      <View style={styles.divider} />
      <View style={{ position: 'absolute', top: 16, right: 16, zIndex: 100 }}>
        {syncStatus === 'syncing' && <Text style={{ color: '#FFA500', fontWeight: 'bold' }}>Syncing...</Text>}
        {syncStatus === 'success' && <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>Synced ✓</Text>}
        {syncStatus === 'error' && <Text style={{ color: '#F44336', fontWeight: 'bold' }}>Sync Failed</Text>}
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: cardsOpacity, transform: [{ translateY: cardsTranslateY }] }}>
          <View
            style={styles.quickActionsRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={styles.quickActionButton}
            >
              <ImageBackground
                source={require('../src/assets/background.png')}
                style={styles.quickActionImage}
                imageStyle={styles.quickActionImageInner}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Inventory')}
              style={styles.quickActionButton}
            >
              <ImageBackground
                source={require('../src/assets/Media.png')}
                style={styles.quickActionImage}
                imageStyle={styles.quickActionImageInner}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('reports')}
              style={styles.quickActionButton}
            >
              <ImageBackground
                source={require('../src/assets/reports.png')}
                style={styles.quickActionImage}
                imageStyle={styles.quickActionImageInner}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('ClientAndSupplierManagementScreen')}
              style={styles.quickActionButton}
            >
              <ImageBackground
                source={require('../src/assets/ClientAndSupplierConnectionIcon.png')}
                style={styles.quickActionImage}
                imageStyle={styles.quickActionImageInner}
                onError={(error) => console.error('Error loading image:', error)}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[styles.card, styles.glassCard]}>

            <StackedBarChart
              data={stackedBarDataFromBarData}
              width={width - 20}
              height={220}
              chartConfig={{
                backgroundGradientFrom: theme.colors.tertiary,
                backgroundGradientTo: theme.colors.primary,
                color: () => '#fff',
                labelColor: () => '#fff',
                decimalPlaces: 0,
              }}
              style={{
                borderRadius: 16
              }}
              fromZero
              showValuesOnTopOfBars
            />
          </View>
          <View
            style={[styles.card, styles.glassCard]}>

            {(recentActivities || []).filter(
              t => t.StockStatus === 'Recieved'
            ).map((t, index) => (
              <ActivityItem
                key={index}
                type="inbound"
                title={`Inbound: ${t.Name}`}
                details={`${t.Count} - ${t.Location}`}
                time={t.TimeAgo}
                iconName="arrow-downward"
                iconColor={theme.colors.inbound}
                iconBgColor="#e8f0fe"
              />
            ))}

            {(recentActivities || []).filter(
              t => t.StockStatus === 'Dispatched'
            ).map((t, index) => (
              <ActivityItem
                key={index}
                type="dispatched"
                title={`Dispatched: ${t.Name}`}
                details={`${t.Count} - ${t.Location}`}
                time={t.TimeAgo}
                iconName="arrow-upward"
                iconColor={theme.colors.outbound}
                iconBgColor="#fce8e6"
              />
            ))}
            {(recentActivities || []).filter(
              t => t.StockStatus === 'Transferred'
            ).map((t, index) => (
              <ActivityItem
                key={index}
                type="transferred"
                title={`Transferred: ${t.Name}`}
                details={`${t.Count} - ${t.Location}`}
                time={t.TimeAgo}
                iconName="swap-horiz"
                iconColor={theme.colors.inbound}
                iconBgColor="orange"
              />
            ))}

          </View>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('AllActivity')}
            style={styles.viewAllButton}
            labelStyle={styles.viewAllButtonText}
          >
            View All Activity
          </Button>
          <View
            style={[styles.cardPurple, styles.glassCard]}>
            <LinearGradient
              colors={[theme.colors.tertiary, theme.colors.primary]}
              style={{ borderRadius: 16, padding: 8, marginVertical: 16 }}
            >
              <PieChart
                data={pieData}
                width={width - 32}
                height={220}
                chartConfig={{
                  color: () => `#000`,

                  decimalPlaces: 0,
                  labelColor: () => '#000',
                }}
                accessor={"population"}
                backgroundColor="transparent"
                paddingLeft={"15"}
                style={{ borderRadius: 16 }}
              />
            </LinearGradient>
          </View>

        </Animated.View>
      </ScrollView>
      <BottomNavigation
        onOpen={handleDrawerOpen} />
      {sideBar && <SideBar
        onClose={closeSidebar} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    zIndex: -3,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: 'white',
    letterSpacing: 0.3,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
    textShadowColor: 'rgba(21,101,192,0.08)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e3ecff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 1,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 2,
    gap: 12,
  },
  quickActionButton: {
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
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#e3ecff',
  },
  quickActionImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionImageInner: {
    borderRadius: 14,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#1565c0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#202124',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5f6368',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 10,
    color: '#1976d2',
    letterSpacing: 0.12,
  },
  viewAllButton: {
    marginVertical: 18,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#1976d2',
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  viewAllButtonText: {
    color: '#1976d2',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.12,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 22,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#1565c0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
    elevation: 4,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e3ecff',
    overflow: 'hidden',
  },
  cardPurple: {
    borderRadius: 22,
    marginVertical: 7,
    width: '100%',
    elevation: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(227,236,255,0.82)',
    borderWidth: 1.5,
    borderColor: '#b3c6ff',
    color: '#000',
    overflow: 'hidden',
  },
  glassCard: {
    // iOS glass effect
    ...Platform.select({
      ios: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(21,101,192,0.08)',
        borderWidth: 1,
      },
      android: {
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderColor: 'rgba(21,101,192,0.08)',
        borderWidth: 1,
      },
    }),
  },
  cardTitlePurple: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 14,
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.12,
  },
});
export default Dashboard;