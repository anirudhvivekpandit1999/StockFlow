import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, List, useTheme, Card, Title } from 'react-native-paper';
import AppBar from '../src/components/layout/AppBar';

const InventoryPage = () => {
  const theme = useTheme();

  const inventoryItems = [
    { name: 'Item A', quantity: 1000, location: 'Aisle 1', reorderLevel: 200 },
    { name: 'Item B', quantity: 450, location: 'Aisle 2', reorderLevel: 100 },
    { name: 'Item C', quantity: 200, location: 'Cold Storage', reorderLevel: 50 },
    { name: 'Item D', quantity: 0, location: 'Aisle 3', reorderLevel: 150 },
  ];

  const totalStock = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
  const outOfStockCount = inventoryItems.filter(item => item.quantity === 0).length;
  const reorderNeeded = inventoryItems.filter(item => item.quantity <= item.reorderLevel);

  return (
    <View style={styles.container}>
      <AppBar title="Inventory Overview" />
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.summaryText}>Total Items: {inventoryItems.length}</Title>
            <Text style={styles.summaryText}>Total Stock: {totalStock}</Text>
            <Text style={styles.summaryText}>Out of Stock: {outOfStockCount}</Text>
            <Text style={styles.summaryText}>Items Needing Reorder: {reorderNeeded.length}</Text>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Inventory Items</Text>
        {inventoryItems.map((item, index) => (
          <List.Item
            key={index}
            title={`${item.name} (${item.quantity})`}
            description={`Location: ${item.location} | Reorder Level: ${item.reorderLevel}`}
            left={props => <List.Icon {...props} icon="cube-outline" />}
            style={[
              styles.item,
              { backgroundColor: item.quantity === 0 ? '#FFF0F0' : '#F7F7F7' },
            ]}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  summaryCard: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#EAF3FF',
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 4,
    color: '#1C1C1E',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1C1C1E',
  },
  item: {
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default InventoryPage;
