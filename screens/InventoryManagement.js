import React, { useContext, useEffect, useState, useRef } from "react";
import { Alert, StyleSheet, useWindowDimensions, View, Animated, Easing, Dimensions } from "react-native";
import { FlatList, ScrollView, Text } from "react-native-gesture-handler";
import AppBar from "../src/components/layout/AppBar";
import { GlobalContext } from "../src/services/GlobalContext";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import SideBar from "../src/components/common/SideBar";
import { Divider, FAB, useTheme } from "react-native-paper";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import apiServices from "../src/services/apiServices";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const InventoryManagement = () => {
  const { showSidebar, setShowSidebar } = useContext(GlobalContext);
  const { width } = useWindowDimensions();
  const [inventoryListData, setInventoryListData] = useState([]);
  const navigation = useNavigation();
  const theme = useTheme();
  const { warehouseId } = useContext(GlobalContext);

  // Animations
  const bgAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(bgAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: false,
    }).start();
    Animated.loop(
      Animated.timing(floatAnim, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 900,
      delay: 400,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    fetchInventoryList();
  }, []);

  async function fetchInventoryList() {
    try {
      var result = await apiServices.getInventoryList({ WarehouseId: warehouseId });
      if (result.Status === 200) {
        setInventoryListData(JSON.parse(result.Data));
      }
    } catch (error) {
      console.error("Error fetching inventory list:", error);
    }
  }
  function toggleSideBar() {
    setShowSidebar(true);
  }
  function closeSidebar() {
    setShowSidebar(false);
  }
  const handleDrawerOpen = () => {
    // ...existing code...
  };

  // Animated background colors
  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#fff', '#f8fafd'],
  });
  // Remove bgOverlay and floating shapes for minimal Apple look
  const cardOpacity = cardAnim;
  const cardTranslateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  return (
    <View style={styles.container}>
      {/* Minimal white background */}
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: bgColor, zIndex: -2 }]} />
      <AppBar
        title={
          "Stock Flow"
        }
        onMenuPress={toggleSideBar}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: cardOpacity, transform: [{ translateY: cardTranslateY }] }}>
          <FlatList
            data={inventoryListData || []}
            keyExtractor={item => item.ProductSerialNumber}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('ProductDetails', { name: item.ProductName })}
                activeOpacity={0.93}
              >
                <View style={styles.cardHeaderRow}>
                  <Image
                    source={require('../src/assets/Media.png')}
                    style={styles.cardIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.cardTitle}>{item.ProductName}</Text>
                </View>
                <Text style={styles.cardLocation}>Location: {item.Location}</Text>
                <Divider style={styles.cardDivider} />
                <View style={styles.cardDetailsRow}>
                  <Text style={styles.cardDetail}>Count: {item.Count}</Text>
                  <Text style={styles.cardDetail}>Serial: {item.ProductSerialNumber}</Text>
                </View>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        </Animated.View>
      </ScrollView>
      <FAB
        icon={({ size }) => (
          <Icon name="qrcode-scan" size={size} color="#fff" />
        )}
        style={styles.fab}
        color="#fff"
        onPress={() => navigation.navigate('QRScanner')}
      />
      <BottomNavigation onOpen={handleDrawerOpen} />
      {showSidebar && <SideBar onClose={closeSidebar} />}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerTitleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  headerTitlePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingVertical: 7,
    borderRadius: 24,
    backgroundColor: '#f6f7f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 120,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#222',
    letterSpacing: 0.1,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  fab: {
    padding: 0,
    margin: 0,
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#1976d2',
    elevation: 3,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e3ecff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#ececec',
    marginBottom: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardIcon: {
    width: 36,
    height: 36,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#f6f7f9',
    borderWidth: 1,
    borderColor: '#ececec',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: '#222',
    letterSpacing: 0.08,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  cardLocation: {
    fontWeight: '400',
    fontStyle: 'italic',
    color: '#888',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  cardDivider: {
    backgroundColor: '#e3ecff',
    marginVertical: 6,
    height: 1,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cardDetail: {
    fontWeight: '400',
    fontStyle: 'italic',
    color: '#1976d2',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
});

export default InventoryManagement;