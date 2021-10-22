import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        overlayColor: 'transparent',
      }}>
      <Drawer.Screen
        options={{
          sceneContainerStyle: {backgroundColor: 'transparent'},
        }}
        name="Home"
        component={HomeScreen}
      />
      <Drawer.Screen
        options={{
          sceneContainerStyle: {backgroundColor: 'yellow'},
        }}
        name="Profile"
        component={ProfileScreen}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
