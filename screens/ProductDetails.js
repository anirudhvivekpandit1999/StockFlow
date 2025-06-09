import React, { useEffect, useState, useCallback, useContext } from "react";
import { StyleSheet, View, Dimensions, useWindowDimensions, BackHandler } from "react-native";
import { ScrollView, Text } from "react-native-gesture-handler";
import AppBar from "../src/components/layout/AppBar";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import Svg, { Defs, G, LinearGradient, Path, Stop } from "react-native-svg";
import { useTheme } from "react-native-paper";
import apiServices from "../src/services/apiServices";
import { date, DateSchema } from "yup";
import { GlobalContext } from "../src/services/GlobalContext";

const ProductDetails = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [productdetails, setproductdetails] = useState({
    });
    const route = useRoute();
    const navigation = useNavigation();
    const { name } = route.params || {};
    const theme = useTheme();
    const { height } = useWindowDimensions();
    const { width } = Dimensions.get("window");
    const { warehouseId } = useContext(GlobalContext);
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('Inventory');
                return true; 
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [navigation])
    );

    useEffect(() => {
        fetchProductDetails();
    }, [name]);

    async function fetchProductDetails() {
        try {
            let result = await apiServices.getInventoryDetails({ ProductName: name , WarehouseId : warehouseId });
            console.log("Product Details: ", JSON.parse(result.Data));
            if (result.Status === 200) {
                setproductdetails(JSON.parse(result.Data));

            }

        } catch (error) {

            console.log("Error fetching product details : ", error);
        }
    }

    function toggleSideBar() {
        setShowSidebar(true);
    }

    function closeSidebar() {
        setShowSidebar(false);
    }

    const formatDate = (mssqlDate) => {
        const date = new Date(mssqlDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        
        return `${day}-${month}-${year}`;
    };
    const handleDrawerOpen = () => {
    console.log('Drawer opened!');
  };

    return (
        <View style={styles.container}>
            <AppBar title="Stock Flow" onMenuPress={toggleSideBar} />

            <View style={[styles.topDesignContainer, { height: height / 2.7 }]}> 
                <View style={styles.productIconContainer}>
                  <View style={styles.productNamePill}>
                    <View style={styles.productAccentDot} />
                    <Text style={styles.productName}>
                        {productdetails.ProductName}
                    </Text>
                  </View>
                </View>
                <View style={styles.topInfoRow}>
                    <View style={styles.topInfoCardSerial}>
                        <Text style={styles.topInfoLabel}>Serial Number</Text>
                        <Text style={styles.topInfoValue}>{productdetails.ProductSerialNumber}</Text>
                    </View>
                    <View style={styles.topInfoCardLocation}>
                        <Text style={styles.topInfoLabel}>Location</Text>
                        <Text style={styles.topInfoValue}>{productdetails.Location}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.divider} />
            <View style={styles.statsRow({ width })}>
                <View style={styles.statCardCount}>
                    <Text style={styles.statLabel}>Count</Text>
                    <Text style={styles.statValueAccent}>{productdetails.Count}</Text>
                </View>
                <View style={styles.statCardBy}>
                    <Text style={styles.statLabel}>Last Modified By</Text>
                    <Text style={styles.statValueAccent}>{productdetails.Username || 'no one'}</Text>
                </View>
                <View style={styles.statCardOn}>
                    <Text style={styles.statLabel}>Last Modified On</Text>
                    <Text style={styles.statValueAccent}>{formatDate(productdetails.LastModifiedOn)}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            </ScrollView>

            <BottomNavigation onOpen={handleDrawerOpen} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#f7fafd',
  },
  topDesignContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 8,
    overflow: 'visible',
    paddingTop: 32,
  },
  productIconContainer: {
    alignItems: 'center',
    marginBottom: 0,
    zIndex: 2,
  },
  productNamePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf2fb',
    borderRadius: 32,
    paddingHorizontal: 28,
    paddingVertical: 10,
    marginBottom: 12,
    shadowColor: '#b3c6e6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  productAccentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#6ea8fe',
    marginRight: 10,
  },
  productName: {
    fontSize: 26,
    fontWeight: '500',
    color: '#222',
    letterSpacing: 0.2,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  divider: {
    height: 1,
    backgroundColor: '#e3eaf3',
    marginHorizontal: 24,
    marginVertical: 18,
    borderRadius: 1,
  },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
  topInfoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
    marginBottom: 8,
    zIndex: 2,
    gap: 12,
  },
  topInfoCardSerial: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 22,
    marginHorizontal: 6,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#e3eaf3',
    elevation: 0,
  },
  topInfoCardLocation: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 22,
    marginHorizontal: 6,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 1,
    borderColor: '#e3eaf3',
    elevation: 0,
  },
  topInfoLabel: {
    color: '#7a8ca3',
    fontWeight: '400',
    fontSize: 13,
    marginBottom: 2,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  topInfoValue: {
    color: '#222',
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  statsRow: (props) => ({
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
    gap: 10,
    width: props && props.width ? props.width  : '90%',
  }),
  statCardCount: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 90,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e3eaf3',
    elevation: 0,
  },
  statCardBy: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 90,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e3eaf3',
    elevation: 0,
  },
  statCardOn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 90,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#e3eaf3',
    elevation: 0,
  },
  statLabel: {
    color: '#7a8ca3',
    fontWeight: '400',
    fontSize: 12,
    marginBottom: 2,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  statValue: {
    color: '#222',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
  },
  statValueAccent: {
    color: '#3a6ea8',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
    letterSpacing: 0.1,
    marginTop: 2,
  },
});

export default ProductDetails;