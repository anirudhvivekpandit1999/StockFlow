import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView, NativeViewGestureHandler, ScrollView } from 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';  
import ReceivedOrders from './screens/RecievedOrders';
import DispatchedOrders from './screens/DispatchedOrders';
import AllActivity from './screens/AllActivity';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUp';
import GlobalContextProvider from './src/services/GlobalContext';

import Dashboard from './screens/Dashboard';
import InventoryManagement from './screens/InventoryManagement';
import { FastField } from 'formik';
import ProductDetails from './screens/ProductDetails';
import  QRScanner  from './screens/QRScanner';
import reportsScreen from './screens/reports';
import ClientAndSupplierManagementScreen from './screens/ClientAndSupplierManagementScreen';
import ClientAndSupplierDetails from './screens/ClientAndSupplierDetails';
import PurchaseOrderForm from './src/components/forms/PurchaseOrderForm';
import SalesOrderForm from './src/components/forms/SalesOrderForm';
import NewInboundForm from './src/components/forms/NewInboundForm';
import NewDispatchScreen from './src/components/forms/NewOutBoundForm';
import InternalTransferScreen from './src/components/forms/NewTransferForm';
import ReturnFormScreen from './src/components/forms/ReturnsForm';
import StockAnalyticsPage from './screens/StocksAnalyticPage';
import InventoryPage from './screens/InventoryPage';



const Stack = createStackNavigator();
export default function App() {
  return (
    <GlobalContextProvider>
      <GestureHandlerRootView>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
          >
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
            name = 'dashboard'
            component={Dashboard}
            options={{headerShown : false}}/>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Inventory'
              component={InventoryManagement}
              options={{headerShown:false}}/>
              <Stack.Screen
                name='ProductDetails'
                
                component={ProductDetails}
                options={{headerShown : false}}/>
                 <Stack.Screen
                  name='QRScanner'
                  component={QRScanner}
                  options={{headerShown:false}}/> 
            <Stack.Screen
              name="RecievedOrder"
              component={ReceivedOrders}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DispatchedOrders"
              component={DispatchedOrders}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AllActivity"
              component={AllActivity}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="reports"
              component={reportsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ClientAndSupplierManagementScreen"
              component={ClientAndSupplierManagementScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ClientAndSupplierDetails"
              component={ClientAndSupplierDetails}
              options={{ headerShown: false }}
              />
              <Stack.Screen
              name="PurchaseOrderForm"
              component={PurchaseOrderForm}
              options={{ headerShown: false }}
              />
              <Stack.Screen
              name = 'SalesOrderForm'
              component={SalesOrderForm}
              options={{ headerShown: false }}/>
              <Stack.Screen 
                name='InboundModel'
                component={NewInboundForm}
                options={{headerShown : false}}/>
                <Stack.Screen 
                name='OutboundModel'
                component={NewDispatchScreen}
                options={{headerShown : false}}/>
                <Stack.Screen 
                name='TransferModel'
                component={InternalTransferScreen}
                options={{headerShown : false}}/>
                <Stack.Screen 
                name='ReturnsModel'
                component={ReturnFormScreen}
                options={{headerShown : false}}/>
                <Stack.Screen 
                name='StockAnalyticsPage'
                component={StockAnalyticsPage}
                options={{headerShown : false}}/>
                <Stack.Screen 
                name='InventoryPage'
                component={InventoryPage}
                options={{headerShown : false}}/>
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </GlobalContextProvider>
  );
}
