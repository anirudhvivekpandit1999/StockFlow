import React, { useCallback, useContext, useEffect, useState } from "react";
import { ImageBackground, StyleSheet, useWindowDimensions, View } from "react-native";
import { ScrollView, Text } from "react-native-gesture-handler";
import AppBar from "../src/components/layout/AppBar";
import { GlobalContext } from "../src/services/GlobalContext";
import { toggleSideBar } from "../src/services/globals";
import SideBar from "../src/components/common/SideBar";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Button, useTheme } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import ActivityItem from "../src/components/stock/ActivityItem";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native-svg";
import apiServices from "../src/services/apiServices";
import BottomNavigation from "../src/components/layout/BottomNavigation";

const Dashboard = () => {
    const [sideBar, showSidebar] = useState(false);
  const [bardata, setBardata] = useState([]);
  const [count, setCount] = useState({ "recieved": 0, "dispatched": 0, "transferred": 0 })
  const [recentActivities, setRecentActivities] = useState([]);
  const theme = useTheme();
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      fetchAnalysisData();
    }, [])
  );
  const fetchAnalysisData = async () => {
    var result = await apiServices.getAnalysis();
    setBardata(JSON.parse(result.Data).BarData);
    setRecentActivities(JSON.parse(result.Data).Top2Activities);
    setCount({
      "recieved": JSON.parse(JSON.parse(result.Data).RecievedCount).RecievedCount,
      "dispatched": JSON.parse(JSON.parse(result.Data).DispatchedCount).DispatchedCount,
      "transferred": JSON.parse(JSON.parse(result.Data).TransferredCount).TransferredCount
    })
    console.log(JSON.parse(JSON.parse(result.Data).TransferredCount).TransferredCount);
  }
  function toggleSideBar() {
    showSidebar(true)
  } function closeSidebar() {
    showSidebar(false)
  }
  const { width } = useWindowDimensions()
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
  const stockData = [
    { name: "Item A", stocks: 40 },
    { name: "Item B", stocks: 10 },
    { name: "Item C", stocks: 25 },
    { name: "Item D", stocks: 5 },
    { name: "Item E", stocks: 15 }
  ];
  const leastStocks = bardata
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

  return (
    <View style={styles.container}>
      <AppBar
        title="Stock Flow"
        onMenuPress={() => toggleSideBar(showSidebar)}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{ flex: 1, flexDirection: "row" , gap : 10}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={{
              width: 100,
              height: 100,
              borderRadius: 8,
              alignSelf: 'flex-end',
              marginBottom: 8,
              overflow: 'hidden',
            }}
          >
            <ImageBackground
              source={require('../src/assets/background.png')}
              style={{
                width: 100,
                height: 100,
                borderRadius: 8,
                resizeMode: 'cover',
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Inventory')}
            style={{
              width: 100,
              height: 100,
              borderRadius: 8,
              alignSelf: 'flex-end',
              marginBottom: 8,
              overflow: 'hidden',
            }}
          >
            <ImageBackground
              source={require('../src/assets/Media.png')}
              style={{
                width: 100,
                height: 100,
                borderRadius: 8,
                resizeMode: 'cover',
              }}
            />
          </TouchableOpacity>

        </View>

        <View
          style={[styles.cardPurple]}>

          <BarChart
            data={barData}
            width={width - 20}
            height={220}
            chartConfig={{
              backgroundGradientFrom: theme.colors.tertiary,
              backgroundGradientTo: theme.colors.primary,
              color: () => "#fff",
              labelColor: () => "#fff",
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
          style={styles.card}>

          {recentActivities.filter(
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

          {recentActivities.filter(
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
          {recentActivities.filter(
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
          labelStyle={{ color: theme.colors.accent }}
        >
          View All Activity
        </Button>
        <View
          style={styles.cardPurple}>
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

      </ScrollView>
      <BottomNavigation
        onOpen={toggleSideBar} />
      {sideBar && <SideBar
        onClose={closeSidebar} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,

  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#202124',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5f6368',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#202124',
  },
  viewAllButton: {
    marginVertical: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 5,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 8,

    elevation: 2,
    alignItems: 'center',
  },
  cardPurple: {

    borderRadius: 20,
    // padding: 10,
    marginVertical: 5,
    // shadowColor: '#8854d0',
    // shadowOffset: { width: 20, height: 4 },
    // shadowOpacity: 1,
    // shadowRadius: 12,
    elevation: 0,
    alignItems: 'center',
    color: "#000"
  },
  cardTitlePurple: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(136,84,208,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
export default Dashboard;