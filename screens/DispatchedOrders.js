import React, { useState } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AppBar from "../src/components/layout/AppBar";
import SideBar from "../src/components/common/SideBar";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import { Text } from "react-native-paper";

const DispatchedOrders = () => {
    const [sideBar , showSidebar] = useState(false);
    function toggleSideBar () {
        showSidebar(true);
    }
    function onClose (){
        showSidebar (false);
    }
    return <View>
        <AppBar
            title = "Stock Flow"
            onMenuPress={()=>toggleSideBar()}/>
            {sideBar && <SideBar 
            onClose={onClose}/>}
        <ScrollView>
            <Text>
                This is Dispatched Orders Page
            </Text>
        </ScrollView>
         <BottomNavigation 
            onOpen={toggleSideBar}/>
    </View>
}

export default DispatchedOrders;