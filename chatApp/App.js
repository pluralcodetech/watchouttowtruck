import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './src/view/screens/HomeScreen';
import {StatusBar} from 'react-native';
import COLORS from './src/view/const/colors';
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
