import React, { useEffect, useState, useMemo } from "react";
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
  ActivityIndicator
} from "react-native";
import AppBar from "../src/components/layout/AppBar";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import { SegmentedButtons, useTheme, FAB } from "react-native-paper";
import { ProgressChart, BarChart, StackedBarChart } from "react-native-chart-kit";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";
import RNFS from "react-native-fs";
import apiServices from "../src/services/apiServices";

const ReportsScreen = ({ navigation }) => {
  const [value, setValue] = useState("Daily");
  const [fabOpen, setFabOpen] = useState(false);
  const { width } = useWindowDimensions();
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stocksData, setStocksData] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);
        const reportData = await apiServices.testReportData({ 
          WarehouseId: 1, 
          TestDate: "2025-05-29" 
        });
        
        if (reportData?.length > 0) {
          setReportsData(JSON.parse(reportData[0].SummaryData) || []);
          console.log("here is the report data", JSON.parse(JSON.parse(reportData[0].ActivityData).map(item => item.MonthlyActivities)));
         setStocksData(JSON.parse(reportData[0].ActivityData) || []);
        }
      } catch (error) {
        console.error("Error fetching reports data:", error);
        Alert.alert("Error", "Failed to load reports data");
      } finally {
        setLoading(false);
        console.log("Stocks data loaded successfully", stocksData);
      }
    };

    fetchReportsData();
    
  }, []);

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
    barPercentage: 0.5,
  };

  // Memoized progress data calculation
  const progressData = useMemo(() => {
    const periodData = reportsData.find(r => r.Period === value) || {};
    const total = periodData.Total || 1; // Prevent division by zero
    
    return [
      { 
        label: "Received",
        value: periodData.Recieved ? periodData.Recieved / total : 0,
        count: periodData.Recieved || 0
      },
      { 
        label: "Dispatched", 
        value: periodData.Dispatched ? periodData.Dispatched / total : 0,
        count: periodData.Dispatched || 0
      },
      { 
        label: "Transferred", 
        value: periodData.Transferred ? periodData.Transferred / total : 0,
        count: periodData.Transferred || 0
      }
    ];
  }, [reportsData, value]);

  // Memoized bar chart data
  const barChartData = useMemo(() => {
    const periodData = reportsData.find(r => r.Period === value) || {};
    return {
      labels: ['Stock Flow'],
      data: [
        [periodData.Recieved || 0],
        [periodData.Dispatched || 0],
        [periodData.Transferred || 0]
      ],
      barColors: ['#8854d0', '#8854d0', '#8854d0'],
      legend: ['Received', 'Dispatched', 'Transferred']
    };
  }, [reportsData, value]);

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

    try {
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

    try {
      const history = stockHistory[value]
        .map((item) => `<li>${item.date} - ${item.action} (${item.amount})</li>`)
        .join("");

      const html = `
        <html>
          <head>
            <style>
              body { font-family: Arial; padding: 20px; }
              h1 { color: #333; }
              ul { list-style-type: none; padding: 0; }
              li { margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <h1>${value} Stock Report</h1>
            <ul>${history}</ul>
          </body>
        </html>
      `;

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

  const activities = useMemo(() => {
    if (value === 'Daily') {
      return stocksData.map(item => item.DailyActivities ? JSON.parse(item.DailyActivities) : []).flat();
    } else if (value === 'Monthly') {
      return stocksData.map(item => item.MonthlyActivities ? JSON.parse(item.MonthlyActivities) : []).flat();
    } else if (value === 'Yearly') {
      return stocksData.map(item => item.YearlyActivities ? JSON.parse(item.YearlyActivities) : []).flat();
    }
    return [];
  }, [value, stocksData]);

  if (loading) {
    return (
      <View style={styles.container}>
        <AppBar
          title="Stock Flow"
          onMenuPress={handleDrawerOpen}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

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

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
        >
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
                width={140}
                height={180}
                strokeWidth={10}
                radius={30}
                chartConfig={chartConfig}
                hideLegend
              />
              <Text style={{ 
                color: theme.colors.primary, 
                fontSize: 16,
                fontWeight: 'bold'
              }}>
                {entry.count} units
              </Text>
              <Text style={{ 
                color: theme.colors.secondary, 
                fontSize: 14 
              }}>
                {(entry.value * 100).toFixed(1)}%
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={[
          styles.barChartCard,
          { backgroundColor: theme.colors.surface }
        ]}>
          <Text style={styles.chartTitle}>Stock Distribution</Text>
          <StackedBarChart
            data={barChartData}
            width={width - 32}
            height={220}
            chartConfig={chartConfig}
            style={styles.barChart}
            showValuesOnTopOfBars
            withHorizontalLabels
            segments={4}
            hideLegend
          />
          <View style={styles.legend}>
            {barChartData.legend.map((label, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: barChartData.barColors[index] }]} />
                <Text style={styles.legendText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* <Text style={styles.sectionTitle}>Stock History</Text>
        <ScrollView style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 12, color: '#333' }}>
            {JSON.stringify(stocksData, null, 2)}
          </Text>
        </ScrollView> */}

        <Text style={styles.sectionTitle}>Activities</Text>
        <ScrollView style={{ marginBottom: 16 }}>
          {activities.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#777', padding: 16 }}>
              No activities found for the selected period.
            </Text>
          ) : (
            activities.map((activity, index) => (
              <View key={index} style={[styles.activityCard, { backgroundColor: theme.colors.surface }]}>
                <Text style={styles.activityTitle}>{activity.StockStatus}: {activity.ProductName}</Text>
                <Text style={styles.activityDetails}>Count: {activity.Count}</Text>
                <Text style={styles.activityDetails}>Location: {activity.Location}</Text>
                <Text style={styles.activityDetails}>Date: {new Date(activity.DatedOn).toLocaleDateString()}</Text>
              </View>
            ))
          )}
        </ScrollView>
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
        fabStyle={{ backgroundColor: theme.colors.primary }}
        style={{
          position: "absolute",
          bottom: 80,
          right: 16,
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardsContainer: {
    paddingBottom: 8
  },
  progressCard: {
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    elevation: 3,
    alignItems: "center",
    width: 160,
    justifyContent: 'space-between'
  },
  barChartCard: {
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
    marginTop: 24,
    marginBottom: 12,
    color: "#202124",
  },
  historyItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
  },
  historyText: {
    fontSize: 14,
    color: "#444",
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontSize: 14,
    color: "#444",
  },
  activityCard: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  activityDetails: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
});

export default ReportsScreen;