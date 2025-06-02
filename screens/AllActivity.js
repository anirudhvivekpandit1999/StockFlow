import React, { useState } from "react";
import SideBar from "../src/components/common/SideBar";
import AppBar from "../src/components/layout/AppBar";
import { Text } from "react-native-paper";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import BottomNavigation from "../src/components/layout/BottomNavigation";

const AllActivity = () => {
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
                All Activity Screen

            </Text>

        </ScrollView>
        <BottomNavigation
            onOpen={handleDrawerOpen} />
    </View>
}

export default AllActivity;