import React from 'react';
import 'react-native-gesture-handler';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {View, TouchableOpacity, Linking} from 'react-native';
import {Text, Icon} from 'native-base';
import HomeScreen from '../screens/HomeScreen';
import MyAccount from '../screens/MyAccount';
import SubCategoriesScreen from '../screens/market-place-screens/SubCategoriesScreen';
import AuthScreen from '../screens/auth/MainScreen';
import {useSelector} from 'react-redux';

import {SECONDARY_COLOR} from '../../styles/colors';
import HelpScreen from '../screens/HelpScreen';
import ServiceListsScreen from '../screens/ServiceListsScreen';

const Tab = createMaterialTopTabNavigator();
const phoneNumber = 'tel:07041978629';

const BottomNav = () => {
  const {loggedIn} = useSelector((state) => state.userData);

  return (
    <Tab.Navigator
      timingConfig={{duration: 150}}
      swipeEnabled={false}
      tabBarPosition="bottom"
      tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarLabel: 'Home'}}
      />
      <Tab.Screen name="SubCategories" component={SubCategoriesScreen} />
      <Tab.Screen
        name="Service"
        component={loggedIn ? ServiceListsScreen : AuthScreen}
        options={{tabBarLabel: 'Airtime & Bill'}}
      />
      <Tab.Screen name="Call" component={() => <View />} />
      <Tab.Screen
        name="Help"
        component={HelpScreen}
        options={{tabBarLabel: 'Help'}}
      />
      <Tab.Screen
        name="Profile"
        component={loggedIn ? MyAccount : AuthScreen}
        options={{tabBarLabel: 'My Account'}}
      />
    </Tab.Navigator>
  );
};

function MyTabBar({state, descriptors, navigation, position}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        height: 55,
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        let iconName;
        let color;
        isFocused ? (color = SECONDARY_COLOR) : (color = 'black');
        //check for  the route and set the icon
        switch (route.name) {
          case 'Home':
            iconName = 'store';
            break;
          case 'Service':
            iconName = 'lightbulb-outline';
            break;
          case 'Profile':
            iconName = 'account-circle';
            break;
          case 'Help':
            iconName = 'live-help';
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            if (route.name != 'Call') {
              navigation.navigate(route.name);
            } else {
              // call the company number
              Linking.openURL(phoneNumber);
            }
          }
        };

        if (route.name != 'PoductsScreen' && route.name != 'SubCategories') {
          //return the sell custom icon
          if (route.name == 'Call') {
            return (
              <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                <View
                  style={{
                    height: 60,
                    width: 60,
                    backgroundColor: SECONDARY_COLOR,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    bottom: 20,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: 20,
                    }}>
                    Call
                  </Text>
                </View>
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={onPress}
                style={{flex: 1}}>
                <View style={{alignItems: 'center'}}>
                  <Icon
                    name={iconName}
                    type="MaterialIcons"
                    style={{fontSize: 24, color}}
                  />
                  <Text style={{fontSize: 10, color}}>{label}</Text>
                </View>
              </TouchableOpacity>
            );
          }
        }
      })}
    </View>
  );
}

export default BottomNav;
