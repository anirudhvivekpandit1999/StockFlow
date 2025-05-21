import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import AppBar from '../src/components/layout/AppBar';
import ActionCard from '../src/components/stock/ActionCard';
import ActivityItem from '../src/components/stock/ActivityItem';

export const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AppBar 
        title="Stock Flow" 
        onMenuPress={() => navigation.openDrawer()}
        actions={[{ icon: 'magnify', onPress: () => navigation.navigate('Search') }]} 
      />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Today's Activity</Text>
          <Text style={styles.headerSubtitle}>12 movements • 4 pending</Text>
        </View>

        <ActionCard
          title="Goods Receiving"
          buttonTitle="New Inbound"
          buttonColor={theme.colors.inbound}
          icon="ArrowDownwardIcon"
          recentTitle="Recent Supplier"
          recentValue="Apple Inc."
          recentTime="1 hour ago"
          onPress={() => navigation.navigate('NewInbound')}
        />
        
        <ActionCard
          title="Goods Dispatch"
          buttonTitle="New Outbound"
          buttonColor={theme.colors.outbound}
          icon="arrow-upward"
          recentTitle="Recent Client"
          recentValue="TechCorp"
          recentTime="30 minutes ago"
          onPress={() => navigation.navigate('NewOutbound')}
        />
        
        <ActionCard
          title="Stock Movement"
          buttonTitle="Transfer"
          buttonColor={theme.colors.transfer}
          icon="swap-horiz"
          recentTitle="Recent Transfer"
          recentValue="Warehouse A → B"
          recentTime="3 hours ago"
          onPress={() => navigation.navigate('NewTransfer')}
        />
        
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        <ActivityItem
          type="inbound"
          title="Inbound: Apple Inc."
          details="235 MacBook Pro - Section A-15"
          time="1h ago"
          iconName="arrow-downward"
          iconColor={theme.colors.inbound}
          iconBgColor="#e8f0fe"
        />
        
        <ActivityItem
          type="outbound"
          title="Outbound: TechCorp"
          details="54 Monitors - Section C-09"
          time="30m ago"
          iconName="arrow-upward"
          iconColor={theme.colors.outbound}
          iconBgColor="#fce8e6"
        />
        
        <Button 
          mode="outlined" 
          onPress={() => navigation.navigate('AllActivity')}
          style={styles.viewAllButton}
          labelStyle={{ color: theme.colors.accent }}
        >
          View All Activity
        </Button>
      </ScrollView>
    </View>
  );
};

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
});

export default HomeScreen;