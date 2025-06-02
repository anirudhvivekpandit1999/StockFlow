import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, View, Dimensions, useWindowDimensions, BackHandler } from "react-native";
import { ScrollView, Text } from "react-native-gesture-handler";
import AppBar from "../src/components/layout/AppBar";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import Svg, { Defs, G, LinearGradient, Path, Stop } from "react-native-svg";
import { useTheme } from "react-native-paper";
import apiServices from "../src/services/apiServices";
import { date, DateSchema } from "yup";

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
            let result = await apiServices.getInventoryDetails({ productName: name });
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

    return (
        <View style={styles.container}>
            <AppBar title="Stock Flow" onMenuPress={toggleSideBar} />

            <View style={[styles.topDesignContainer, { height: height / 2 }]}>
                <Svg
                    width={width}
                    height={height / 2}
                    viewBox={`0 0 ${width} ${height / 2}`}
                    style={StyleSheet.absoluteFill}
                >
                    <Defs>
                        <LinearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0%" stopColor="#8854d0" />
                            <Stop offset="100%" stopColor="#a084ee" />
                        </LinearGradient>
                    </Defs>

                    <Path
                        d={`
            M0,${height / 3}
            C${width / 4},${height / 2.5}
             ${width / 1.5},${height / 4}
             ${width},${height / 2.5}
            L${width},0
            L0,0
            Z
        `}
                        fill="url(#purpleGradient)"
                    />

                    <Path
                        d={`
            M0,${height / 2.5}
            C${width / 6},${height / 3.2}
             ${width / 1.8},${height / 3}
             ${width},${height / 4}
            L${width},0
            L0,0
            Z
        `}
                        fill="#ffffff"
                        fillOpacity="0.1"
                    />
                </Svg>

                <View style={styles.productIconContainer}>
                    <Text style={[styles.productName, { color: "white" }]}>
                        {productdetails.ProductName}
                    </Text>
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

            <View style={styles.statsRow}>
                <View style={styles.statCardCount}>
                    <Text style={styles.statLabel}>Count</Text>
                    <Text style={styles.statValue}>{productdetails.Count}</Text>
                </View>
                <View style={styles.statCardBy}>
                    <Text style={styles.statLabel}>Last Modified By</Text>
                    <Text style={styles.statValue}>{productdetails.Username || 'no one'}</Text>
                </View>
                <View style={styles.statCardOn}>
                    <Text style={styles.statLabel}>Last Modified On</Text>
                    <Text style={styles.statValue}>{formatDate(productdetails.LastModifiedOn)}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            </ScrollView>

            <BottomNavigation onOpen={closeSidebar} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    topDesignContainer: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginBottom: 8,
        overflow: 'visible',
    },
    productIconContainer: {
        position: 'absolute',
        top: 70,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 2,
    },
    productName: {
        fontSize: 40,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.25)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        marginBottom: 8,
        zIndex: 2,
    },
    content: {
        padding: 16,
        paddingBottom: 32,
    },
    topInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        marginTop: 16,
        marginBottom: 8,
        zIndex: 2,
    },
    topInfoCardSerial: {
        backgroundColor: '#f3e8ff',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginHorizontal: 6,
        alignItems: 'center',
        minWidth: 120,
        elevation: 3,
    },
    topInfoCardLocation: {
        backgroundColor: '#dcd6f7',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginHorizontal: 6,
        alignItems: 'center',
        minWidth: 120,
        elevation: 3,
    },
    topInfoLabel: {
        color: '#6c3ddb',
        fontWeight: 'bold',
        fontSize: 13,
        marginBottom: 4,
    },
    topInfoValue: {
        color: '#202124',
        fontSize: 15,
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    statCardCount: {
        backgroundColor: '#e5d1fa',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: 'center',
        minWidth: 90,
        marginHorizontal: 4,
        elevation: 3,
    },
    statCardBy: {
        backgroundColor: '#b9b4c7',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: 'center',
        minWidth: 90,
        marginHorizontal: 4,
        elevation: 3,
    },
    statCardOn: {
        backgroundColor: '#a084ee',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: 'center',
        minWidth: 90,
        marginHorizontal: 4,
        elevation: 3,
    },
    statLabel: {
        color: '#6c3ddb',
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 2,
        textAlign: 'center',
    },
    statValue: {
        color: '#202124',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default ProductDetails;