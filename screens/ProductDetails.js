import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, useWindowDimensions } from "react-native";
import { ScrollView, Text } from "react-native-gesture-handler";
import AppBar from "../src/components/layout/AppBar";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import { useRoute } from "@react-navigation/native";
import Svg, { Defs, G, LinearGradient, Path, Stop } from "react-native-svg";
import { useTheme } from "react-native-paper";

const ProductDetails = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    const [productdetails, setproductdetails] = useState({
        productname: '',
        serialnumber: '',
        location: '',
        count: 0,
        lastModifiedBy: '',
        lastModifiedOn: ''
    });
    const route = useRoute();
    const { name } = route.params || {};
    const theme = useTheme();
    const { height } = useWindowDimensions();
    const { width } = Dimensions.get("window");

    useEffect(() => {
        if (name === 'Laptop') {
            setproductdetails({
                productname: 'Laptop',
                serialnumber: 'POTPAL-001',
                location: 'Vashera',
                count: 15,
                lastModifiedBy: 'Anirudh',
                lastModifiedOn: '19-02-1999'
            });
        }
    }, [name]);

    function toggleSideBar() {
        setShowSidebar(true);
    }

    function closeSidebar() {
        setShowSidebar(false);
    }

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

    {/* Background wave */}
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

    {/* Foreground highlight wave */}
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
                    <Text style={[styles.productName, { color: "white"  }]}>
                        {productdetails.productname}
                    </Text>
                </View>

                <View style={styles.topInfoRow}>
                    <View style={styles.topInfoCardSerial}>
                        <Text style={styles.topInfoLabel}>Serial Number</Text>
                        <Text style={styles.topInfoValue}>{productdetails.serialnumber}</Text>
                    </View>
                    <View style={styles.topInfoCardLocation}>
                        <Text style={styles.topInfoLabel}>Location</Text>
                        <Text style={styles.topInfoValue}>{productdetails.location}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statCardCount}>
                    <Text style={styles.statLabel}>Count</Text>
                    <Text style={styles.statValue}>{productdetails.count}</Text>
                </View>
                <View style={styles.statCardBy}>
                    <Text style={styles.statLabel}>Last Modified By</Text>
                    <Text style={styles.statValue}>{productdetails.lastModifiedBy}</Text>
                </View>
                <View style={styles.statCardOn}>
                    <Text style={styles.statLabel}>Last Modified On</Text>
                    <Text style={styles.statValue}>{productdetails.lastModifiedOn}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Additional details can go here */}
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
