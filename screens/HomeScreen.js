// ✅ Updated HomeScreen with METAS principles and added "Returns" option.

import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Animated, Easing, Platform, Dimensions } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppBar from '../src/components/layout/AppBar';
import BottomNavigation from '../src/components/layout/BottomNavigation';
import SideBar from '../src/components/common/SideBar';
import { GlobalContext } from '../src/services/GlobalContext';
import apiServices from '../src/services/apiServices';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { userId, warehouseId } = useContext(GlobalContext);

  const [showSidebar, setShowSidebar] = useState(false);
  const [stockFlowData, setStockFlowData] = useState({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const cardsStagger = useRef([...Array(6)].map(() => new Animated.Value(0))).current; // 4 for new Returns card

  useEffect(() => {
    initializeAnimations();
    fetchStockFlowData();
  }, []);

  const initializeAnimations = () => {
    const animations = [
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ];

    const cardAnimations = cardsStagger.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 700,
        delay: 400 + index * 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );

    Animated.parallel([...animations, ...cardAnimations]).start();
  };

  const fetchStockFlowData = async () => {
    try {
      const result = await apiServices.getStockFlowData({ userId, warehouseId });
      if (result?.[0]?.Data) {
        const parsedData = JSON.parse(result[0].Data);
        setStockFlowData(parsedData);
      }
    } catch (error) {
      console.error('Error fetching stock flow data:', error);
    }
  };

  const renderActionCards = () => {
    const actions = [
      
      {
        title: 'Stock Analytics',
        buttonTitle: 'Open Analytics',
        icon: 'chart-box-outline',
        color: '#007AFF',
        bgColor: '#EAF3FF',
        onPress: () => navigation.navigate('StockAnalyticsPage'),
      },
      {
        title: 'Inventory',
        buttonTitle: 'View Inventory',
        icon: 'warehouse',
        color: '#32ADE6',
        bgColor: '#E6F7FB',
        onPress: () => navigation.navigate('InventoryPage'),
      },
      {
        title: 'Goods Receiving',
        buttonTitle: 'New Inbound',
        icon: 'arrow-down-circle-outline',
        color: '#34C759',
        bgColor: '#E8F5E8',
        onPress: () => navigation.navigate('InboundModel'),
        recentValue: stockFlowData.RecentSupplier,
        recentLabel: 'Recent Supplier',
      },
      {
        title: 'Goods Dispatch',
        buttonTitle: 'New Outbound',
        icon: 'arrow-up-circle-outline',
        color: '#FF3B30',
        bgColor: '#FFE8E8',
        onPress: () => navigation.navigate('OutboundModel'),
        recentValue: stockFlowData.RecentDispatcher,
        recentLabel: 'Recent Client',
      },
      {
        title: 'Stock Movement',
        buttonTitle: 'Transfer',
        icon: 'swap-horizontal-circle-outline',
        color: '#FF9500',
        bgColor: '#FFF4E8',
        onPress: () => navigation.navigate('TransferModel'),
        recentValue: stockFlowData.RecentTransfer,
        recentLabel: 'Recent Transfer',
      },
      {
        title: 'Returns',
        buttonTitle: 'New Return',
        icon: 'arrow-u-left-top',
        color: '#5856D6',
        bgColor: '#ECEBFF',
        onPress: () => navigation.navigate('ReturnsModel'),
        recentValue: stockFlowData.RecentReturn,
        recentLabel: 'Recent Return',
      }
    ];

    return actions.map((action, index) => (
      <Animated.View
        key={index}
        style={{
          opacity: cardsStagger[index],
          transform: [{ translateY: cardsStagger[index].interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
          marginBottom: 16,
        }}
      >
        <View style={[styles.actionCard, { backgroundColor: action.bgColor }]}>
          <View style={styles.actionHeader}>
            <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
              <Icon name={action.icon} size={24} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              {action.recentValue && (
                <Text style={styles.actionSubtitle}>{action.recentLabel}: {action.recentValue}</Text>
              )}
            </View>
          </View>
          <Button
            mode="contained"
            onPress={action.onPress}
            style={[styles.actionButton, { backgroundColor: action.color }]}
            labelStyle={styles.actionButtonLabel}
          >
            {action.buttonTitle}
          </Button>
        </View>
      </Animated.View>
    ));
  };

  return (
    <View style={styles.container}>
      <AppBar title="Stock Flow" onMenuPress={() => setShowSidebar(true)} />
      {showSidebar && <SideBar onClose={() => setShowSidebar(false)} />}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {renderActionCards()}
      </ScrollView>
      <BottomNavigation onOpen={() => console.log('Drawer opened!')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  actionCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  actionButton: {
    borderRadius: 14,
    paddingVertical: 6,
  },
  actionButtonLabel: {
    fontSize: 16,
    color: '#fff',
  },
});

export default HomeScreen;
