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
                              sideBarData.map((side,index) => (
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
            backgroundColor: '#fff',
            paddingTop: 50,
            paddingHorizontal: 20,
            elevation: 8,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowOffset: { width: 2, height: 0 },
            shadowRadius: 8,
      },
      title: {
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 30,
      },
      item: {
            paddingVertical: 15,
      },
      itemText: {
            fontSize: 18,
      },
      closeButton: {
            marginTop: 40,
            paddingVertical: 10,
            alignItems: 'center',
            backgroundColor: '#eee',
            borderRadius: 5,
      },
      closeText: {
            color: '#333',
            fontWeight: 'bold',
      },
      background: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.2)',
      },
});

export default SideBar;