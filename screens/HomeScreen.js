import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import AppBar from '../src/components/layout/AppBar';
import ActionCard from '../src/components/stock/ActionCard';
import ActivityItem from '../src/components/stock/ActivityItem';
import BottomNavigation from '../src/components/layout/BottomNavigation';
import SideBar from '../src/components/common/SideBar';
import NewInboundForm from '../src/components/forms/NewInboundForm';
import NewOutboundForm from '../src/components/forms/NewOutBoundForm';
import NewTransferForm from '../src/components/forms/NewTransferForm';

export const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [inboundModal , showInBoundModal] = useState (false);
  const [outbountModal , showOutBoundModal] = useState(false);
  const [transferModel , showTransferModel] = useState(false);
  function toggleSideBar() {
    setShowSidebar(true)
  } function closeSidebar() {
    setShowSidebar(false)
  }
  return (
    
    <View style={styles.container}>
      
      <AppBar
        title="Stock Flow"
        onMenuPress={() => toggleSideBar()}
      // actions={[{ icon: 'magnify', onPress: () => navigation.navigate('Search') }]} 
      />
      {showSidebar && <SideBar onClose={closeSidebar} />}
      
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
          icon="arrow-downward"
          recentTitle="Recent Supplier"
          recentValue="Apple Inc."
          recentTime="1 hour ago"
          onPress={() => showInBoundModal(true)}
          color="green"
        />

        <ActionCard
          title="Goods Dispatch"
          buttonTitle="New Outbound"
          buttonColor={theme.colors.outbound}
          icon="arrow-upward"
          recentTitle="Recent Client"
          recentValue="TechCorp"
          recentTime="30 minutes ago"
          onPress={() => showOutBoundModal(true)}
          color="red"
        />

        <ActionCard
          title="Stock Movement"
          buttonTitle="Transfer"
          buttonColor={theme.colors.transfer}
          icon="swap-horiz"
          recentTitle="Recent Transfer"
          recentValue="Warehouse A → B"
          recentTime="3 hours ago"
          onPress={() => showTransferModel(true)}
          color="orange"
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
      <BottomNavigation
        onOpen={toggleSideBar} />
        {inboundModal && <NewInboundForm 
      onDismiss={()=>showInBoundModal(false)}/>}
      {
        outbountModal && <NewOutboundForm
        onDismiss={ () => showOutBoundModal(false)}/>
      }
      {
        transferModel && <NewTransferForm
        onDismiss={()=> showTransferModel(false)}/>
      }
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