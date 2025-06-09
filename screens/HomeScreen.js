import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Animated, Easing, Platform, Dimensions } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppBar from '../src/components/layout/AppBar';
import ActionCard from '../src/components/stock/ActionCard';
import ActivityItem from '../src/components/stock/ActivityItem';
import BottomNavigation from '../src/components/layout/BottomNavigation';
import SideBar from '../src/components/common/SideBar';
import NewInboundForm from '../src/components/forms/NewInboundForm';
import NewOutboundForm from '../src/components/forms/NewOutBoundForm';
import NewTransferForm from '../src/components/forms/NewTransferForm';
import { callStoredProcedure } from '../src/services/procedureService';
import apiServices from '../src/services/apiServices';
import { GlobalContext } from '../src/services/GlobalContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { userId, warehouseId } = useContext(GlobalContext);
  
  // State management
  const [showSidebar, setShowSidebar] = useState(false);
  const [inboundModal, setInboundModal] = useState(false);
  const [outboundModal, setOutboundModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const [stockFlowData, setStockFlowData] = useState({});
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const cardsStagger = useRef([...Array(3)].map(() => new Animated.Value(0))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    initializeAnimations();
  }, []);

  useEffect(() => {
    fetchStockFlowData();
  }, [showSidebar, inboundModal, outboundModal, transferModal]);

  const initializeAnimations = () => {
    // Subtle entrance animations inspired by iOS
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
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 600,
        delay: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ];

    // Staggered card animations
    const cardAnimations = cardsStagger.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 700,
        delay: 400 + (index * 150),
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );

    // Subtle pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ])
    );

    Animated.parallel([...animations, ...cardAnimations]).start();
    pulseAnimation.start();
  };

  const fetchStockFlowData = async () => {
    try {
      const result = await apiServices.getStockFlowData({ 
        UserId: userId, 
        WarehouseId: warehouseId 
      });
      
      if (result && result[0] && result[0].Data) {
        const parsedData = JSON.parse(result[0].Data);
        setStockFlowData(parsedData);
      }
    } catch (error) {
      console.error('Error fetching stock flow data:', error);
    }
  };

  // Event handlers
  const toggleSideBar = () => setShowSidebar(true);
  const closeSidebar = () => setShowSidebar(false);
  const handleDrawerOpen = () => console.log('Drawer opened!');

  // Modal handlers
  const openInboundModal = () => setInboundModal(true);
  const closeInboundModal = () => setInboundModal(false);
  const openOutboundModal = () => setOutboundModal(true);
  const closeOutboundModal = () => setOutboundModal(false);
  const openTransferModal = () => setTransferModal(true);
  const closeTransferModal = () => setTransferModal(false);


  const renderStatsCard = () => (
    <Animated.View style={[
      styles.statsCard,
      {
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim }
        ]
      }
    ]}>
      <View style={styles.statsContent}>
        <Text style={styles.statsTitle}>Today's Activity</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stockFlowData.Recieved || 0}</Text>
            <Text style={styles.statLabel}>Received</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stockFlowData.Dispatched || 0}</Text>
            <Text style={styles.statLabel}>Dispatched</Text>
          </View>
        </View>
      </View>
      <View style={styles.statsIndicator} />
    </Animated.View>
  );

  const renderActionCards = () => {
    const actions = [
      {
        title: "Goods Receiving",
        buttonTitle: "New Inbound",
        icon: "arrow-down-circle-outline",
        color: "#34C759",
        bgColor: "#E8F5E8",
        onPress: openInboundModal,
        recentValue: stockFlowData.RecentSupplier,
        recentTime: stockFlowData.RecentSupplyTime,
        recentLabel: "Recent Supplier"
      },
      {
        title: "Goods Dispatch",
        buttonTitle: "New Outbound",
        icon: "arrow-up-circle-outline",
        color: "#FF3B30",
        bgColor: "#FFE8E8",
        onPress: openOutboundModal,
        recentValue: stockFlowData.RecentDispatcher,
        recentTime: stockFlowData.RecentDispatchTime,
        recentLabel: "Recent Client"
      },
      {
        title: "Stock Movement",
        buttonTitle: "Transfer",
        icon: "swap-horizontal-circle-outline",
        color: "#FF9500",
        bgColor: "#FFF4E8",
        onPress: openTransferModal,
        recentValue: stockFlowData.RecentTransfer,
        recentTime: stockFlowData.RecentTransferTime,
        recentLabel: "Recent Transfer"
      }
    ];

    return actions.map((action, index) => (
      <Animated.View
        key={index}
        style={[
          styles.actionCardContainer,
          {
            opacity: cardsStagger[index],
            transform: [{
              translateY: cardsStagger[index].interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0]
              })
            }]
          }
        ]}
      >
        <View style={[styles.actionCard, { backgroundColor: action.bgColor }]}>
          <View style={styles.actionHeader}>
            <View style={[styles.actionIconContainer, { backgroundColor: action.color }]}>
              <Icon name={action.icon} size={24} color="#FFFFFF" />
            </View>
            <View style={styles.actionTitleContainer}>
              <Text style={styles.actionTitle}>{action.title}</Text>
              {action.recentValue && (
                <Text style={styles.actionSubtitle}>
                  {action.recentLabel}: {action.recentValue}
                </Text>
              )}
            </View>
          </View>
          
          <Button
            mode="contained"
            onPress={action.onPress}
            style={[styles.actionButton, { backgroundColor: action.color }]}
            labelStyle={styles.actionButtonLabel}
            elevation={0}
          >
            {action.buttonTitle}
          </Button>
        </View>
      </Animated.View>
    ));
  };

  const renderRecentActivity = () => {
    if (!stockFlowData.Top2Activities) return null;

    const activities = stockFlowData.Top2Activities.map((activity, index) => {
      let config = {};
      
      switch (activity.StockStatus) {
        case 'Recieved':
          config = {
            type: 'inbound',
            prefix: 'Received',
            icon: 'arrow-down-circle',
            color: '#34C759',
            bgColor: '#E8F5E8'
          };
          break;
        case 'Dispatched':
          config = {
            type: 'dispatched',
            prefix: 'Dispatched',
            icon: 'arrow-up-circle',
            color: '#FF3B30',
            bgColor: '#FFE8E8'
          };
          break;
        case 'Transferred':
          config = {
            type: 'transferred',
            prefix: 'Transferred',
            icon: 'swap-horizontal-circle',
            color: '#FF9500',
            bgColor: '#FFF4E8'
          };
          break;
        default:
          return null;
      }

      return (
        <View key={`${config.type}-${index}`} style={styles.activityItem}>
          <View style={[styles.activityIcon, { backgroundColor: config.bgColor }]}>
            <Icon name={config.icon} size={20} color={config.color} />
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>
              {config.prefix}: {activity.Name}
            </Text>
            <Text style={styles.activityDetails}>
              {activity.Count} • {activity.Location}
            </Text>
          </View>
          <Text style={styles.activityTime}>{activity.TimeAgo}</Text>
        </View>
      );
    });

    return (
      <Animated.View style={[
        styles.activitySection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {activities}
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Subtle gradient background */}
      <View style={styles.backgroundGradient} />
      
      <AppBar
        title={"Stock Flow"}
        onMenuPress={toggleSideBar}
        onBackPress={() => navigation.goBack()}
        style={styles.appBar}
      />
      
      {showSidebar && <SideBar onClose={closeSidebar} />}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {renderStatsCard()}
        {renderActionCards()}
        {renderRecentActivity()}
        
        <Animated.View style={[
          styles.viewAllContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('AllActivity')}
            style={styles.viewAllButton}
            labelStyle={styles.viewAllButtonLabel}
            elevation={0}
          >
            View All Activity
          </Button>
        </Animated.View>
      </ScrollView>
      
      <BottomNavigation onOpen={handleDrawerOpen} />
      
      {/* Modals */}
      {inboundModal && <NewInboundForm onDismiss={closeInboundModal} />}
      {outboundModal && <NewOutboundForm onDismiss={closeOutboundModal} />}
      {transferModal && <NewTransferForm onDismiss={closeTransferModal} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F2F2F7',
  },
  appBar: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  headerTitlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  // iconContainer: {
  //   width: 32,
  //   height: 32,
  //   borderRadius: 16,
  //   backgroundColor: '#E3F2FD',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginRight: 12,
  // },
  
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  statsContent: {
    padding: 24,
  },
  statsTitle: {
    fontSize: 22,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#1D1D1F',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: Platform.OS === 'ios' ? '700' : 'bold',
    color: '#007AFF',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 16,
  },
  statsIndicator: {
    height: 4,
    backgroundColor: '#007AFF',
  },
  actionCardContainer: {
    marginBottom: 16,
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
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  actionTitleContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#1D1D1F',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  actionButton: {
    borderRadius: 14,
    paddingVertical: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonLabel: {
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  activitySection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#1D1D1F',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  activityList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  activityDetails: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  activityTime: {
    fontSize: 12,
    color: '#C7C7CC',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  viewAllContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  viewAllButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#007AFF',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  viewAllButtonLabel: {
    fontSize: 16,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#007AFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
});

export default HomeScreen;