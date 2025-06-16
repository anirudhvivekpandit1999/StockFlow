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
  ActivityIndicator,NativeModules
} from "react-native";

import AppBar from "../src/components/layout/AppBar";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import { SegmentedButtons, useTheme, FAB, Dialog, Portal, Button } from "react-native-paper";
import { ProgressChart, BarChart, StackedBarChart } from "react-native-chart-kit";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";
import RNFS from "react-native-fs";
import apiServices from "../src/services/apiServices";
import { BluetoothTscPrinter } from 'react-native-thermal-receipt-printer-image-qr';
// import { USBPrinter } from 'react-native-thermal-receipt-printer-image-qr';
import { Linking } from 'react-native';

const ReportsScreen = ({ navigation }) => {
  const [value, setValue] = useState("Daily");
  const [fabOpen, setFabOpen] = useState(false);
  const { width } = useWindowDimensions();
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stocksData, setStocksData] = useState([]);
  const theme = useTheme();
  const {PrintModule} = NativeModules;


  // No connection logic needed for Sunmi built-in printer

  // Print report using Android Print Intent (for generic POS devices)
  const printReport = async () => {
  if (Platform.OS !== 'android') {
    Alert.alert('POS Printing', 'Printing is only supported on Android POS devices.');
    return;
  }
  try {
    // Prepare summary
    const periodData = reportsData.find(r => r.Period === value) || {};
    let summary = `Stock Report (${value})\n`;
    summary += `-----------------------------\n`;
    summary += `Received:     ${periodData.Recieved || 0}\n`;
    summary += `Dispatched:   ${periodData.Dispatched || 0}\n`;
    summary += `Transferred:  ${periodData.Transferred || 0}\n`;
    summary += `Total:        ${periodData.Total || 0}\n`;
    summary += `-----------------------------\n`;
//     await BluetoothTscPrinter.connect('66:32:7B:86:8D');
// await BluetoothTscPrinter.printText(reportText + '\n\n', {
//     encoding: 'GBK',
//     codepage: 0,
//     widthtimes: 0,
//     heighttimes: 0,
//     fonttype: 1
// });    // Prepare activities
    let activityText = '';
    const acts = activities.slice(0, 10); // Print up to 10 activities for brevity
    if (acts.length > 0) {
      activityText += 'Activities:\n';
      acts.forEach((a, idx) => {
        activityText += `${idx + 1}. ${a.StockStatus}: ${a.ProductName}\n   Count: ${a.Count}  Loc: ${a.Location}\n   Date: ${new Date(a.DatedOn).toLocaleDateString()}\n`;
      });
    } else {
      activityText += 'No activities for this period.\n';
    }

    // Compose the report text
    const reportText = `StockFlow\n${summary}\n${activityText}\n\n`;

    // Call the native module to print
    if (PrintModule) {
      PrintModule.printText(reportText);
      Alert.alert('POS Printing', 'Report sent to POS printer.');
      await BluetoothTscPrinter.connect('66:32:7B:27:86:8D');

// Then use printText method (not calling BluetoothTscPrinter directly)
await BluetoothTscPrinter.printText(reportText + '\n\n', {
    encoding: 'GBK',
    codepage: 0,
    widthtimes: 0,
    heighttimes: 0,  // Fixed the typo from 'heigthtimes'
    fonttype: 1
});
      
    } else {
      Alert.alert('POS Printing Error', 'Native printer module not available.');
    }
  } catch (err) {
    Alert.alert('POS Printing Error', err?.message || 'Failed to print.');
  }
};

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
          setStocksData(JSON.parse(reportData[0].ActivityData) || []);
        }
      } catch (error) {
        console.error("Error fetching reports data:", error);
        Alert.alert("Error", "Failed to load reports data");
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
    
  }, []);

  const handleDrawerOpen = () => {
    console.log("Drawer opened!");
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(58, 110, 168, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(34, 34, 34, ${opacity})`,
    style: { borderRadius: 18 },
    propsForBackgroundLines: { stroke: "#e3eaf3" },
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
      const periodData = reportsData.find(r => r.Period === value) || {};
      
      // Create a formatted CSV with sections
      let csvContent = [];
      
      // Add header with styling
      csvContent.push('StockFlow - ' + value + ' Report');
      csvContent.push('Generated on: ' + new Date().toLocaleDateString());
      csvContent.push('');
      
      // Add summary section
      csvContent.push('Stock Summary');
      csvContent.push('Category,Count');
      csvContent.push(`Received,${periodData.Recieved || 0}`);
      csvContent.push(`Dispatched,${periodData.Dispatched || 0}`);
      csvContent.push(`Transferred,${periodData.Transferred || 0}`);
      csvContent.push(`Total,${periodData.Total || 0}`);
      csvContent.push('');
      
      // Add activities section
      csvContent.push('Recent Activities');
      csvContent.push('Status,Product Name,Count,Location,Date');
      
      // Add activity data
      activities.slice(0, 10).forEach(activity => {
        csvContent.push(
          `${activity.StockStatus},${activity.ProductName},${activity.Count},${activity.Location},${new Date(activity.DatedOn).toLocaleDateString()}`
        );
      });

      // Join all lines with proper line endings
      const csv = csvContent.join('\r\n');

      const fileName = `StockFlow_${value.toLowerCase()}_report_${new Date().toISOString().split('T')[0]}.csv`;
      const downloadsPath =
        Platform.OS === "android"
          ? RNFS.DownloadDirectoryPath
          : RNFS.DocumentDirectoryPath;

      const path = `${downloadsPath}/${fileName}`;

      await RNFS.writeFile(path, csv, "utf8");
      await Share.open({ 
        url: `file://${path}`, 
        type: "text/csv",
        subject: `StockFlow ${value} Report`,
        message: `StockFlow ${value} Report generated on ${new Date().toLocaleDateString()}`
      });
    } catch (error) {
      console.error("Excel export failed:", error.message);
      Alert.alert("Export Failed", "Could not save Excel file.");
    }
  };
  const generatePDF = async () => {
    const hasPermission = await requestWritePermission();
    if (!hasPermission) return;

    try {
      const periodData = reportsData.find(r => r.Period === value) || {};
      const acts = activities.slice(0, 10);
      
      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: 'Helvetica', Arial, sans-serif;
                padding: 40px;
                color: #333;
                line-height: 1.6;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #3a6ea8;
              }
              .logo {
                color: #3a6ea8;
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .report-date {
                color: #666;
                font-size: 14px;
              }
              .summary-card {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .summary-title {
                color: #3a6ea8;
                font-size: 20px;
                margin-bottom: 15px;
              }
              .summary-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
              }
              .summary-item {
                padding: 10px;
                background: white;
                border-radius: 8px;
              }
              .summary-label {
                color: #666;
                font-size: 14px;
              }
              .summary-value {
                color: #3a6ea8;
                font-size: 24px;
                font-weight: bold;
              }
              .activities {
                margin-top: 30px;
              }
              .activity-card {
                background: white;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 10px;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
              .activity-title {
                color: #3a6ea8;
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 5px;
              }
              .activity-details {
                color: #666;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">StockFlow</div>
              <div class="report-date">${value} Report - ${new Date().toLocaleDateString()}</div>
            </div>

            <div class="summary-card">
              <div class="summary-title">Stock Summary</div>
              <div class="summary-grid">
                <div class="summary-item">
                  <div class="summary-label">Received</div>
                  <div class="summary-value">${periodData.Recieved || 0}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">Dispatched</div>
                  <div class="summary-value">${periodData.Dispatched || 0}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">Transferred</div>
                  <div class="summary-value">${periodData.Transferred || 0}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-label">Total</div>
                  <div class="summary-value">${periodData.Total || 0}</div>
                </div>
              </div>
            </div>

            <div class="activities">
              <div class="summary-title">Recent Activities</div>
              ${acts.length > 0 ? acts.map((activity, index) => `
                <div class="activity-card">
                  <div class="activity-title">${activity.StockStatus}: ${activity.ProductName}</div>
                  <div class="activity-details">
                    Count: ${activity.Count} • Location: ${activity.Location}<br>
                    Date: ${new Date(activity.DatedOn).toLocaleDateString()}
                  </div>
                </div>
              `).join('') : '<div class="activity-card">No activities found for this period</div>'}
            </div>
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
        <View style={styles.segmentedPillWrap}>
          <SegmentedButtons
            value={value}
            onValueChange={setValue}
            buttons={[
              { value: "Daily", label: "Daily" },
              { value: "Monthly", label: "Monthly" },
              { value: "Yearly", label: "Yearly" },
            ]}
            style={styles.segmentedPill}
          />
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
        >
          {progressData.map((entry, index) => (
            <View
              key={index}
              style={styles.progressCard}
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
              <Text style={styles.progressUnits}>
                {entry.count} units
              </Text>
              <Text style={styles.progressPercent}>
                {(entry.value * 100).toFixed(1)}%
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.barChartCard}>
          <Text style={styles.chartTitle}>Stock Distribution</Text>
          {/* <StackedBarChart
            data={barChartData}
            width={width - 32}
            height={220}
            chartConfig={chartConfig}
            style={styles.barChart}
            showValuesOnTopOfBars
            withHorizontalLabels
            segments={4}
            hideLegend
          /> */}
          <View style={styles.legend}>
            {barChartData.legend.map((label, index) => (
              <View key={index} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: ['#3a6ea8', '#b3c6e6', '#7a8ca3'][index] }]} />
                <Text style={styles.legendText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Activities</Text>
        <ScrollView style={{ marginBottom: 16 }}>
          {activities.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#777', padding: 16 }}>
              No activities found for the selected period.
            </Text>
          ) : (
            activities.map((activity, index) => (
              <View key={index} style={styles.activityCard}>
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
          {
            icon: "printer",
            label: "Print Report",
            onPress: printReport,
            color: Platform.OS === 'android' ? '#3a6ea8' : '#ccc',
            style: { opacity: Platform.OS === 'android' ? 1 : 0.5 },
          },
        ]}
        onStateChange={({ open }) => setFabOpen(open)}
        visible={true}
        fabStyle={{ backgroundColor: '#3a6ea8', borderRadius: 22, width: 48, height: 48, alignItems: 'center', justifyContent: 'center', elevation: 0 }}
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
  segmentedPillWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  segmentedPill: {
    backgroundColor: '#eaf2fb',
    borderRadius: 22,
    paddingHorizontal: 8,
    paddingVertical: 2,
    elevation: 0,
  },
  progressCard: {
    borderRadius: 20,
    padding: 18,
    marginRight: 14,
    elevation: 0,
    alignItems: "center",
    width: 160,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  progressUnits: {
    color: '#3a6ea8',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 0,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  progressPercent: {
    color: '#7a8ca3',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 0,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  barChartCard: {
    borderRadius: 20,
    padding: 18,
    marginTop: 16,
    elevation: 0,
    backgroundColor: '#fff',
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  barChart: {
    marginTop: 8,
    borderRadius: 16,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#3a6ea8",
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.1,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
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
  activityTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#3a6ea8",
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  activityDetails: {
    fontSize: 13,
    color: "#7a8ca3",
    marginBottom: 2,
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
});

export default ReportsScreen;