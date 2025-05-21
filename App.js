import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView, NativeViewGestureHandler, ScrollView } from 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import {HomeScreen} from './screens/HomeScreen';  

const Stack = createStackNavigator();
export default function App() {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
            
          />
          
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
