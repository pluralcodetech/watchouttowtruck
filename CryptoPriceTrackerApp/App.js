import React from 'react';
import {StatusBar, View} from 'react-native';
import COLORS from './src/const/colors';
import SplashScreen from './src/views/screens/SplashScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/views/screens/HomeScreen';
import DetailsScreen from './src/views/screens/DetailsScreen';

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={COLORS.background} />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
