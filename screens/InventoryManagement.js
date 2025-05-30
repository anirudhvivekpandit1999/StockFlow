import React, { useContext } from "react";
import {  StyleSheet, useWindowDimensions, View } from "react-native";
import { FlatList, ScrollView, Text } from "react-native-gesture-handler";
import AppBar from "../src/components/layout/AppBar";
import { GlobalContext } from "../src/services/GlobalContext";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import SideBar from "../src/components/common/SideBar";
import { Divider, FAB, useTheme } from "react-native-paper";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const InventoryManagement = () => {
    const {showSidebar , setShowSidebar} = useContext(GlobalContext);
    const {width} = useWindowDimensions();
    const navigation = useNavigation();
    const theme = useTheme();
    function toggleSideBar() {
    setShowSidebar(true)
  } function closeSidebar() {
    setShowSidebar(false)
  }
  const inventoryListData = [
    {
        Name : 'Laptop',
        Count : 1, 
        ProductSerialNumber : 'potpal',
        Location : 'Powai'
    },
    {
        Name : 'Keyboard',
        Count : 12, 
        ProductSerialNumber : 'draobyek',
        Location : 'Vashere'
    },
    {
        Name:'Mouse',
        Count:123,
        ProductSerialNumber : 'esoum',
        Location : 'Saki Naka'
    }
  ]
    return <View style={styles.container}>
         <AppBar
        title="Stock Flow"
        onMenuPress={() => toggleSideBar(showSidebar)}
      />
      <ScrollView
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
                <FlatList
    data={inventoryListData}
    keyExtractor={item => item.ProductSerialNumber}
    renderItem={({ item }) => (
        <TouchableOpacity 
        style={[styles.card , {borderBlockColor : theme.colors.background}]}
        onPress={()=>navigation.navigate('ProductDetails',{name : item.Name})} >
      
        <Text style = {[styles.content,{width:width -32 , padding:5 ,paddingBottom:10 ,position:"static"}]}>{item.Name}</Text>
        <Text style = {{fontWeight : "600" ,  fontStyle : "italic"}}>Location : {item.Location}</Text>
        <Divider/>
        <View style={{justifyContent: "space-around" , display : "flex" ,flexDirection :"row"}}>
        <Text style={{ fontWeight : "600"  , fontStyle : "italic"}}>Count: {item.Count}</Text>
        <Text style={{ fontWeight : "600" , fontStyle:"italic"  }  }>Serial: {item.ProductSerialNumber}</Text>

        </View>
        
     
      </TouchableOpacity>
    )}
    scrollEnabled={false} 
    
  />
            </ScrollView>
            <FAB
  icon={({ size }) => (
    <Image
      source={require('../src/assets/QR_Code.png')}
      style={{width: size  , height :size , padding: 0 , margin:0
      }}
      resizeMode="cover"
    />)}
  style={styles.fab}
  color="#fff"
  onPress={() => {
    navigation.navigate('QRScanner')
  }}
  
/>
            <BottomNavigation
        onOpen={toggleSideBar} />
      {showSidebar && <SideBar
        onClose={closeSidebar} />}
    </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    
    fontWeight:"800",
    
    alignSelf : "flex-start"
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
  fab: {
    padding:0,
    margin:0,

  position:'absolute',
  right: 20,
  bottom: 80, 
  backgroundColor: '#8854d0', 
  elevation: 6,
  zIndex: 10,
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
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    margin:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 8,
    
    elevation: 2,
    
  },
  cardPurple: {

    borderRadius: 20,
    // padding: 10,
    marginVertical: 5,
    // shadowColor: '#8854d0',
    // shadowOffset: { width: 20, height: 4 },
    // shadowOpacity: 1,
    // shadowRadius: 12,
    elevation: 0,
    alignItems: 'center',
    color: "#000"
  },
  cardTitlePurple: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(136,84,208,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});

export default InventoryManagement;