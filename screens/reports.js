import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
  FlatList,
  ScrollView,
  Platform,
  PermissionsAndroid,
  Alert,
} from "react-native";
import AppBar from "../src/components/layout/AppBar";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import { SegmentedButtons, useTheme, FAB } from "react-native-paper";
import { ProgressChart, BarChart, StackedBarChart } from "react-native-chart-kit";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";
import RNFS from "react-native-fs";
import apiServices from "../src/services/apiServices";

const reportsScreen = ({ navigation }) => {
  const [value, setValue] = useState("Daily");
  const [fabOpen, setFabOpen] = useState(false);
  const { width, height } = useWindowDimensions();
  const [reportsData , setReportsData] = useState([]);
  const [stocks , setStocks] = useState([]);
  const theme = useTheme();
  useEffect(()=>{
    fetchReportsData2();
    console.log("Reports Fetched" , reportsData.filter(r=>r.Period === 'Daily').map(r => r.Recieved / r.Total)[0])
  },[])
  async function fetchReportsData2(){
    try {
      const reportData = await apiServices.testReportData({ WarehouseId: 1, TestDate: "2025-05-29" });
      console.log("Fetched reports data:", JSON.parse(reportData[0].SummaryData).filter(r=>r.Period === 'Daily').map(r=>r.Transferred)[0  ]);

      setReportsData(JSON.parse(reportData[0].SummaryData));
    } catch (error) {
      console.error("Error fetching reports data:", error);
    }
  }
  const handleDrawerOpen = () => {
    console.log("Drawer opened!");
  };

  const chartConfig = {
    backgroundGradientFrom: "white",
    backgroundGradientTo: "white",
    color: (opacity = 1) => `rgba(136, 84, 208, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForBackgroundLines: { stroke: "#e3e3e3" },
  };

  const dataMap = {
    Daily: [
      { label: "Received"
        , value: reportsData.filter(r=>r.Period === 'Daily').map(r => r.Recieved / r.Total)[0] || 0 ,
         count: reportsData.filter(r=>r.Period === 'Daily').map(r => r.Recieved )[0] || 0},
      { 
        label: "Dispatched", 
        value: reportsData.filter(r=>r.Period === 'Daily').map(r => r.Dispatched / r.Total)[0] || 0 , 
        count: reportsData.filter(r=>r.Period === 'Daily').map(r=> r.Dispatched)[0] || 0
      },
      { 
        label: "Transferred", 
        value: 0.3, 
        count: 9 
      }
    ],
    Monthly: [
      { label: "Received", value: 0.7, count: 70 },
      { label: "Dispatched", value: 0.5, count: 50 },
      { label: "Transferred", value: 0.4, count: 40 }
    ],
    Yearly: [
      { label: "Received", value: 0.85, count: 850 },
      { label: "Dispatched", value: 0.65, count: 650 },
      { label: "Transferred", value: 0.45, count: 450 }
    ]
  };

  const stockHistory = {
    Daily: [
      { date: "Today", action: "Received", amount: "150 units" },
      { date: "Today", action: "Dispatched", amount: "100 units" },
    ],
    Monthly: [
      { date: "May", action: "Received", amount: "3500 units" },
      { date: "May", action: "Dispatched", amount: "2400 units" },
    ],
    Yearly: [
      { date: "2024", action: "Received", amount: "43000 units" },
      { date: "2024", action: "Transferred", amount: "12000 units" },
    ],
  };

  const progressData = dataMap[value];
  const barChartData = {
    labels: progressData.map((d) => d.label),
    datasets: [{ data: progressData.map((d) => d.value * 100) }],
  };
  const stackedBarDataFromBarChartData = {
    labels: barChartData.labels,
    legend: ['Value'], // Single legend for each bar
    data: barChartData.datasets[0].data.map(val => [Number(val)]),
    barColors: ['#fff'], // Use white or your preferred color
  };

  const requestWritePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "App needs access to storage to save files",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        Alert.alert("Permission Error", "Failed to get permission.");
        return false;
      }
    }
    return true;
  };

  const exportToExcel = async () => {
    const hasPermission = await requestWritePermission();
    if (!hasPermission) return;

    const csv =
      "Date,Action,Amount\n" +
      stockHistory[value]
        .map((item) => `${item.date},${item.action},${item.amount}`)
        .join("\n");

    const fileName = `${value}_stock_report.csv`;
    const downloadsPath =
      Platform.OS === "android"
        ? RNFS.DownloadDirectoryPath
        : RNFS.DocumentDirectoryPath;

    const path = `${downloadsPath}/${fileName}`;

    try {
      await RNFS.writeFile(path, csv, "utf8");
      await Share.open({ url: `file://${path}`, type: "text/csv" });
    } catch (error) {
      console.error("Excel export failed:", error.message);
      Alert.alert("Export Failed", "Could not save Excel file.");
    }
  };

  const generatePDF = async () => {
    const hasPermission = await requestWritePermission();
    if (!hasPermission) return;

    const history = stockHistory[value]
      .map((item) => `<li>${item.date} - ${item.action} (${item.amount})</li>`)
      .join("");

    const html = `<h1>${value} Stock Report</h1><ul>${history}</ul>`;

    try {
      const downloadsPath =
        Platform.OS === "android"
          ? RNFS.DownloadDirectoryPath
          : RNFS.DocumentDirectoryPath;
      const pdfFile = await RNHTMLtoPDF.convert({
        html,
        fileName: `${value}_stock_report`,
        base64: false,
        directory: downloadsPath,
      });

      await Share.open({ url: `file://${pdfFile.filePath}`, type: "application/pdf" });
    } catch (error) {
      console.error("PDF export failed:", error.message);
      Alert.alert("Export Failed", "Could not generate PDF file.");
    }
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="Stock Flow"
        onMenuPress={handleDrawerOpen}
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            { value: "Daily", label: "Daily" },
            { value: "Monthly", label: "Monthly" },
            { value: "Yearly", label: "Yearly" },
          ]}
          style={{ marginBottom: 16 }}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {progressData.map((entry, index) => (
            <View
              key={index}
              style={[
                styles.progressCard,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text style={styles.chartTitle}>{entry.label}</Text>
              <ProgressChart
                data={{ labels: [entry.label], data: [entry.value] }}
                width={width / 3}
                height={180}
                strokeWidth={10}
                radius={30}
                chartConfig={chartConfig}
                hideLegend

              />
              <Text style={{ color: theme.colors.primary, fontSize: 16 }}>
                {entry.count} units
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.barChartCard}>
          <Text style={styles.chartTitle}>Stock Distribution</Text>
          {/* <BarChart
            data={barChartData}
            width={width - 60}
            height={220}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
            style={styles.barChart}
          /> */}
          <StackedBarChart
            data={stackedBarDataFromBarChartData}
            width={width - width / 6}
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

        <Text style={styles.sectionTitle}>Stock History</Text>
        <FlatList
          data={stockHistory[value]}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Text style={styles.historyText}>
                • {item.date} - {item.action} ({item.amount})
              </Text>
            </View>
          )}
        />
      </ScrollView>

      <FAB.Group
        open={fabOpen}
        icon={fabOpen ? "close" : "plus"}
        actions={[
          {
            icon: "file-pdf-box",
            label: "Export as PDF",
            onPress: generatePDF,
          },
          {
            icon: "file-excel",
            label: "Export as Excel",
            onPress: exportToExcel,
          },
        ]}
        onStateChange={({ open }) => setFabOpen(open)}
        visible={true}
        style={{
          position: "absolute",
          bottom: height / 10,
          right: width / 50,
        }}
      />

      <BottomNavigation onOpen={handleDrawerOpen} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  content: {
    padding: 16,
    paddingBottom: 64,
  },
  progressCard: {
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    elevation: 3,
    alignItems: "center",
    width: 160,
  },
  barChartCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    elevation: 3,
  },
  barChart: {
    marginTop: 8,
    borderRadius: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#202124",
  },
  historyItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
  },
  historyText: {
    fontSize: 14,
    color: "#444",
  },
});

export default reportsScreen;
