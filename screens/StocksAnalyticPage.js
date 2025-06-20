// Same imports as before
import React, { useRef, useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Alert,
  NativeModules,
} from 'react-native';
import {
  Text,
  useTheme,
  Card,
  Title,
  FAB,
  Portal,
  Provider,
} from 'react-native-paper';
import {
  LineChart,
  PieChart,
  BarChart,
} from 'react-native-chart-kit';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import AppBar from '../src/components/layout/AppBar';

const { width: screenWidth } = Dimensions.get('window');
const { PrintModule } = NativeModules;

const StockAnalyticsPage = () => {
  const theme = useTheme();
  const viewShotRef = useRef(null);
  const [fabOpen, setFabOpen] = useState(false);

  const summaryCards = useMemo(() => [
    { title: 'Total Stock', value: '12,450 Units', bgColor: '#EAF3FF' },
    { title: 'Dispatch Ratio', value: '76%', bgColor: '#E8F5E8' },
    { title: 'Fulfillment Accuracy', value: '97%', bgColor: '#F1FFF6' },
  ], []);

  const chartConfig = useMemo(() => ({
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(58, 110, 168, ${opacity})`,
    labelColor: () => '#333',
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#3A6EA8',
    },
    style: { borderRadius: 16 },
  }), []);

  const data = {
    stockTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{ data: [1000, 1200, 900, 1400, 1300, 1500] }],
    },
    monthlyDispatch: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{ data: [800, 1100, 950, 1250, 1150, 1400] }],
    },
    fulfillmentTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{ data: [92, 94, 95, 96, 98, 97] }],
    },
    reorderPatterns: {
      labels: ['Electronics', 'Furniture', 'Apparel', 'Other'],
      datasets: [{ data: [3, 1, 2, 2] }],
    },
    leadTimeTrend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{ data: [5, 4.8, 4.3, 4.2, 4.1, 3.9] }],
    },
    returnsVsDamage: {
      labels: ['Returns', 'Damaged'],
      datasets: [{ data: [120, 52] }],
    },
    categoryDistribution: [
      { name: 'Electronics', quantity: 4500, color: '#007AFF', legendFontColor: '#333', legendFontSize: 14 },
      { name: 'Furniture', quantity: 3000, color: '#FF9500', legendFontColor: '#333', legendFontSize: 14 },
      { name: 'Apparel', quantity: 2000, color: '#34C759', legendFontColor: '#333', legendFontSize: 14 },
      { name: 'Other', quantity: 2950, color: '#AF52DE', legendFontColor: '#333', legendFontSize: 14 },
    ],
  };

  const requestWritePermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to save PDF reports',
          buttonPositive: 'Allow',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      Alert.alert('Permission Denied', 'Unable to get storage access.');
      return false;
    }
  };

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Share.open({ url: uri, title: 'Stock Analytics Report' });
    } catch (err) {
      console.error('Share Error:', err);
    }
  };

  const exportToPDF = async () => {
    const hasPermission = await requestWritePermission();
    if (!hasPermission) return;

    try {
      const summaryHtml = summaryCards.map(c => `<p><b>${c.title}:</b> ${c.value}</p>`).join('');
      const html = `
        <html><head><style>
          body { font-family: Arial; padding: 24px; }
          h1 { color: #3a6ea8; }
          p { margin: 8px 0; }
        </style></head>
        <body>
          <h1>Stock Analytics Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
          ${summaryHtml}
          <p>Charts are available visually in-app and not rendered in PDF.</p>
        </body></html>
      `;

      const filePath = Platform.OS === 'android' ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath;
      const pdf = await RNHTMLtoPDF.convert({
        html,
        fileName: 'stock_analytics_report',
        directory: filePath,
      });

      await Share.open({ url: `file://${pdf.filePath}`, type: 'application/pdf' });
    } catch {
      Alert.alert('PDF Error', 'Failed to export PDF.');
    }
  };

  const printReport = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert('Not Supported', 'POS Printing is Android-only.');
      return;
    }

    try {
      const reportText = `Stock Analytics Report\n\n\n\n${summaryCards
        .map(c => `${c.title}: ${c.value}\n\n`)
        .join('\n\n\n\n')}\n\n\n\n\n\Generated: ${new Date().toLocaleDateString()}\n\n\n\n`;

      PrintModule?.printText(reportText) ??
        Alert.alert('Print Error', 'Printer module not found.');
    } catch (err) {
      Alert.alert('Print Error', err.message || 'Unknown error');
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <AppBar title="Stock Analytics" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>

            {summaryCards.map((item, idx) => (
              <Card key={idx} style={[styles.card, { backgroundColor: item.bgColor }]}>
                <Card.Content>
                  <Title style={styles.cardTitle}>{item.title}</Title>
                  <Text style={styles.cardValue}>{item.value}</Text>
                </Card.Content>
              </Card>
            ))}

            <Text style={styles.sectionTitle}>Stock Trend</Text>
            <LineChart data={data.stockTrend} width={screenWidth - 40} height={220} chartConfig={chartConfig} bezier style={styles.chart} />

            <Text style={styles.sectionTitle}>Monthly Dispatch</Text>
            <BarChart data={data.monthlyDispatch} width={screenWidth - 40} height={220} chartConfig={chartConfig} style={styles.chart} />

            <Text style={styles.sectionTitle}>Category Distribution</Text>
            <PieChart data={data.categoryDistribution} width={screenWidth - 40} height={220} accessor="quantity" backgroundColor="transparent" paddingLeft="15" absolute chartConfig={chartConfig} style={styles.chart} />

            <Text style={styles.sectionTitle}>Fulfillment Accuracy</Text>
            <LineChart data={data.fulfillmentTrend} width={screenWidth - 40} height={220} chartConfig={chartConfig} style={styles.chart} />

            <Text style={styles.sectionTitle}>Reorder Patterns</Text>
            <BarChart data={data.reorderPatterns} width={screenWidth - 40} height={220} chartConfig={chartConfig} style={styles.chart} />

            <Text style={styles.sectionTitle}>Avg Lead Time Trend</Text>
            <LineChart data={data.leadTimeTrend} width={screenWidth - 40} height={220} chartConfig={chartConfig} bezier style={styles.chart} />

            <Text style={styles.sectionTitle}>Returns vs Damaged Stock</Text>
            <BarChart data={data.returnsVsDamage} width={screenWidth - 40} height={220} chartConfig={chartConfig} style={styles.chart} />
          </ViewShot>
        </ScrollView>

        <Portal>
          <FAB.Group
            open={fabOpen}
            icon={fabOpen ? 'close' : 'plus'}
            actions={[
              { icon: 'file-pdf-box', label: 'Export PDF', onPress: exportToPDF },
              { icon: 'share-variant', label: 'Share Report', onPress: handleShare },
              { icon: 'printer', label: 'Print Report', onPress: printReport },
            ]}
            onStateChange={({ open }) => setFabOpen(open)}
            fabStyle={{ backgroundColor: '#3a6ea8' }}
            style={styles.fabGroup}
          />
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 12, color: '#1C1C1E' },
  card: { borderRadius: 16, marginBottom: 12, elevation: 2 },
  cardTitle: { fontSize: 16, color: '#1C1C1E' },
  cardValue: { fontSize: 20, fontWeight: 'bold', marginTop: 4, color: '#000' },
  chart: { borderRadius: 16, marginBottom: 24 },
  fabGroup: { position: 'absolute', bottom: 20, right: 16 },
});

export default StockAnalyticsPage;
