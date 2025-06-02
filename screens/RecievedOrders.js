import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import AppBar from "../src/components/layout/AppBar";
import SideBar from "../src/components/common/SideBar";
import { View } from "react-native";
import BottomNavigation from "../src/components/layout/BottomNavigation";
import { Text } from "react-native-paper";

const ReceivedOrders = () => {
    const [sideBar, showSideBar] = useState(false);
    function toggleSideBar() {
        showSideBar(true);
    }
    function onClose() {
        showSideBar(false);
    }
    const handleDrawerOpen = () => {
    console.log('Drawer opened!');
  };
    return <View>
        <AppBar
            title="Stock Flow"
            onMenuPress={() => toggleSideBar()} />
        {sideBar &&
            <SideBar
                onClose={onClose} />}
        <ScrollView
            showsVerticalScrollIndicator={false}>


            <Text>
                Received Orders Screen

            </Text>

        </ScrollView>
        <BottomNavigation
            onOpen={handleDrawerOpen} />
    </View>
}

export default ReceivedOrders;