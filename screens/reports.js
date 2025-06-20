import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  Alert,
  useWindowDimensions,
  NativeModules,
  Text,
} from "react-native";
import AppBar from "../src/components/layout/AppBar";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import { SegmentedButtons, FAB, useTheme } from "react-native-paper";
import { ProgressChart } from "react-native-chart-kit";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import Share from "react-native-share";
import RNFS from "react-native-fs";
import apiServices from "../src/services/apiServices";
import { BluetoothTscPrinter } from "react-native-thermal-receipt-printer-image-qr";

const ReportsScreen = ({ navigation }) => {
  const [value, setValue] = useState("Daily");
  const [fabOpen, setFabOpen] = useState(false);
  const { width } = useWindowDimensions();
  const [reportsData, setReportsData] = useState([]);
  const [stocksData, setStocksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const { PrintModule } = NativeModules;

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);
        const reportData = await apiServices.testReportData({
          WarehouseId: 1,
          TestDate: "2025-05-29",
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

  const progressData = useMemo(() => {
    const periodData = reportsData.find(r => r.Period === value) || {};
    const total = periodData.Total || 1;
    return [
      {
        label: "Received",
        value: periodData.Recieved ? periodData.Recieved / total : 0,
        count: periodData.Recieved || 0,
      },
      {
        label: "Dispatched",
        value: periodData.Dispatched ? periodData.Dispatched / total : 0,
        count: periodData.Dispatched || 0,
      },
      {
        label: "Transferred",
        value: periodData.Transferred ? periodData.Transferred / total : 0,
        count: periodData.Transferred || 0,
      },
    ];
  }, [reportsData, value]);

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
      let csvContent = [];
      csvContent.push('StockFlow - ' + value + ' Report');
      csvContent.push('Generated on: ' + new Date().toLocaleDateString());
      csvContent.push('');
      csvContent.push('Stock Summary');
      csvContent.push('Category,Count');
      csvContent.push(`Received,${periodData.Recieved || 0}`);
      csvContent.push(`Dispatched,${periodData.Dispatched || 0}`);
      csvContent.push(`Transferred,${periodData.Transferred || 0}`);
      csvContent.push(`Total,${periodData.Total || 0}`);
      csvContent.push('');
      csvContent.push('Recent Activities');
      csvContent.push('Status,Product Name,Count,Location,Date');
      activities.slice(0, 10).forEach(activity => {
        csvContent.push(
          `${activity.StockStatus},${activity.ProductName},${activity.Count},${activity.Location},${new Date(activity.DatedOn).toLocaleDateString()}`
        );
      });
      const csv = csvContent.join('\r\n');
      const fileName = `StockFlow_${value.toLowerCase()}_report_${new Date().toISOString().split('T')[0]}.csv`;
      const downloadsPath = Platform.OS === "android" ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath;
      const path = `${downloadsPath}/${fileName}`;
      await RNFS.writeFile(path, csv, "utf8");
      await Share.open({ url: `file://${path}`, type: "text/csv" });
    } catch (error) {
      Alert.alert("Export Failed", "Could not save Excel file.");
    }
  };

  const generatePDF = async () => {
    const hasPermission = await requestWritePermission();
    if (!hasPermission) return;
    try {
      const periodData = reportsData.find(r => r.Period === value) || {};
      const acts = activities.slice(0, 10);
      const html = `<html><body><h1>StockFlow Report - ${value}</h1><p>Generated: ${new Date().toLocaleDateString()}</p></body></html>`;
      const downloadsPath = Platform.OS === "android" ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath;
      const pdfFile = await RNHTMLtoPDF.convert({ html, fileName: `${value}_stock_report`, base64: false, directory: downloadsPath });
      await Share.open({ url: `file://${pdfFile.filePath}`, type: "application/pdf" });
    } catch (error) {
      Alert.alert("Export Failed", "Could not generate PDF file.");
    }
  };

  const printReport = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert('POS Printing', 'Printing is only supported on Android POS devices.');
      return;
    }
    try {
      const periodData = reportsData.find(r => r.Period === value) || {};
      let summary = `Stock Report (${value})\nReceived: ${periodData.Recieved || 0}\nDispatched: ${periodData.Dispatched || 0}\nTransferred: ${periodData.Transferred || 0}\nTotal: ${periodData.Total || 0}\n`;
      const reportText = `StockFlow\n${summary}\n`;
      if (PrintModule) {
        PrintModule.printText(reportText);
        await BluetoothTscPrinter.connect('66:32:7B:27:86:8D');
        await BluetoothTscPrinter.printText(reportText + '\n\n', {
          encoding: 'GBK', codepage: 0, widthtimes: 0, heighttimes: 0, fonttype: 1
        });
      } else {
        Alert.alert('POS Printing Error', 'Native printer module not available.');
      }
    } catch (err) {
      Alert.alert('POS Printing Error', err?.message || 'Failed to print.');
    }
  };

  const handleDrawerOpen = () => {
    console.log("Drawer opened!");
  };

  if (loading) {
    return (
      <View style={styles.container}><AppBar title="Stock Flow" onMenuPress={handleDrawerOpen} /><ActivityIndicator size="large" color={theme.colors.primary} style={{ flex: 1 }} /></View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar title="Stock Flow" onMenuPress={handleDrawerOpen} onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[{ value: "Daily", label: "Daily" }, { value: "Monthly", label: "Monthly" }, { value: "Yearly", label: "Yearly" }]}
          style={styles.segmentedButtons}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 16 }}>
          {progressData.map((entry, index) => (
            <View key={index} style={styles.chartCard}>
              <Text style={styles.chartLabel}>{entry.label}</Text>
              <ProgressChart
                data={{ labels: [entry.label], data: [entry.value] }}
                width={140} height={180} strokeWidth={10} radius={30}
                chartConfig={{ color: () => '#3a6ea8' }}
                hideLegend
              />
              <Text style={styles.chartValue}>{entry.count} units</Text>
            </View>
          ))}
        </ScrollView>
        <Text style={styles.sectionTitle}>Activities</Text>
        {activities.length > 0 ? activities.map((item, index) => (
          <View key={index} style={styles.activityItem}>
            <Text>{item.StockStatus}: {item.ProductName}</Text>
            <Text>Count: {item.Count}</Text>
            <Text>Location: {item.Location}</Text>
            <Text>Date: {new Date(item.DatedOn).toLocaleDateString()}</Text>
          </View>
        )) : <Text style={{ textAlign: 'center', marginVertical: 20 }}>No activities found.</Text>}
      </ScrollView>
      <FAB.Group
        open={fabOpen}
        icon={fabOpen ? "close" : "plus"}
        actions={[
          { icon: "file-pdf-box", label: "Export PDF", onPress: generatePDF },
          { icon: "file-excel", label: "Export Excel", onPress: exportToExcel },
          { icon: "printer", label: "Print", onPress: printReport },
        ]}
        onStateChange={({ open }) => setFabOpen(open)}
        visible={true}
        fabStyle={{ backgroundColor: '#3a6ea8' }}
        style={{ position: "absolute", bottom: 80, right: 16 }}
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
  segmentedButtons: {
    marginVertical: 16,
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: "center",
  },
  chartLabel: {
    fontWeight: "500",
    marginBottom: 8,
  },
  chartValue: {
    fontWeight: "600",
    color: "#3a6ea8",
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginVertical: 12,
    textAlign: "center",
  },
  activityItem: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
});

export default ReportsScreen;