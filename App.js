import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView, NativeViewGestureHandler, ScrollView } from 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {HomeScreen} from './screens/HomeScreen';  
import ReceivedOrders from './screens/RecievedOrders';
import DispatchedOrders from './screens/DispatchedOrders';
import AllActivity from './screens/AllActivity';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUp';
import GlobalContextProvider from './src/services/GlobalContext';

import Dashboard from './screens/Dashboard';

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
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </GlobalContextProvider>
  );
}
