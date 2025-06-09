import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "react-native-paper";
import { callStoredProcedure } from "../../services/procedureService";
import apiServices from "../../services/apiServices";

const { width } = Dimensions.get('window');

const SideBar = ({ onClose }) => {
      const theme = useTheme();
      const navigation = useNavigation();
      const [sideBarData , setSideBarData] = useState([]);
      useEffect(()=>{
            fetchSideBarData();
      },[])
      function navigateTo(place) {
            onClose();
            navigation.navigate(place);
      }
      const fetchSideBarData = async()=>{
            var result = await apiServices.getSideBarData();
            console.log(JSON.parse(result[0].Data));
            setSideBarData(JSON.parse(result[0].Data));
      }
      // const sideBarData = [
      //       {
      //             navigate: "Home",
      //             menuText: "Home"
      //       },
      //       {
      //             navigate: "ReceivedOrder",
      //             menuText: "Received Orders"
      //       },
      //       {
      //             navigate: "DispatchedOrders",
      //             menuText: "DispatchedOrders"
      //       }
      // ]
      return (
            <View 
            style={styles.overlay}>
                  <View 
                  style={styles.sidebar}>
                        <Text 
                        style={[styles.title, {
                              color: theme.colors.primary
                        }]}>StockFlow</Text>
                        {
                              (sideBarData || []).map((side,index) => (
                                    <TouchableOpacity 
                                    style={styles.item} 
                                    onPress={() => navigateTo(side.Navigate)} 
                                    key={index}>
                                          <Text 
                                          style={styles.itemText}>{side.MenuText}</Text>
                                    </TouchableOpacity>
                              ))
                        }


                  </View>
                  <TouchableOpacity 
                  style={styles.background} 
                  onPress={onClose} />
            </View>
      );
};

const styles = StyleSheet.create({
      overlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            flexDirection: 'row',
            zIndex: 1000,
      },
      sidebar: {
            width: width * 0.7,
            height: '100%',
            backgroundColor: '#fafdff',
            paddingTop: 50,
            paddingHorizontal: 24,
            elevation: 0,
            shadowColor: '#b3c6e6',
            shadowOpacity: 0.06,
            shadowOffset: { width: 2, height: 0 },
            shadowRadius: 12,
            borderRightWidth: 1,
            borderRightColor: '#e3eaf3',
      },
      title: {
            fontSize: 20,
            fontWeight: '500',
            marginBottom: 32,
            color: '#3a6ea8',
            backgroundColor: '#fff',
            alignSelf: 'flex-start',
            paddingHorizontal: 22,
            paddingVertical: 7,
            borderRadius: 22,
            overflow: 'hidden',
            letterSpacing: 0.1,
            fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
            shadowColor: '#b3c6e6',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
      },
      item: {
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e3eaf3',
      },
      itemText: {
            fontSize: 16,
            color: '#222',
            fontWeight: '400',
            fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
      },
      closeButton: {
            marginTop: 40,
            paddingVertical: 10,
            alignItems: 'center',
            backgroundColor: '#eaf2fb',
            borderRadius: 8,
      },
      closeText: {
            color: '#3a6ea8',
            fontWeight: '500',
            fontFamily: Platform.OS === 'ios' ? 'San Francisco' : undefined,
      },
      background: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.08)',
      },
});

export default SideBar;