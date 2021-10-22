import React from 'react';
import 'react-native-gesture-handler';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {View, TouchableOpacity, BackHandler} from 'react-native';
import {Text, Icon} from 'native-base';
import HomeScreen from '../screens/HomeScreen';
import ServiceScreen from '../screens/ServiceScreen';
import SellScreen from '../screens/SellScreen';
import MyAccount from '../screens/account-screens/MainScreen';
import PickUpScreen from '../screens/PickUpScreen';
import ShopMartScreen from '../screens/shop-mart-screens/MainScreen';
import SubCategoriesScreen from '../screens/shop-mart-screens/SubCategoriesScreen';
import ShopMartProductsScreen from '../screens/shop-mart-screens/ProductsScreen';
import AuthScreen from '../screens/auth/MainScreen';
import {useSelector, useDispatch} from 'react-redux';
import {updateCurrentTab} from '../../redux/actions/index';

import {PRIMARY_COLOR, SECONDARY_COLOR} from '../../styles/colors';

const Tab = createMaterialTopTabNavigator();

const BottomNav = () => {
  const {loggedIn} = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  return (
    <Tab.Navigator
      timingConfig={{duration: 150}}
      swipeEnabled={false}
      tabBarPosition="bottom"
      tabBar={(props) => <MyTabBar {...props} dispatch={dispatch} />}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarLabel: 'Marketplace'}}
      />
      <Tab.Screen
        name="Service"
        component={ServiceScreen}
        options={{tabBarLabel: 'Airtime & Bill'}}
      />
      <Tab.Screen name="Sell" component={SellScreen} options={{}} />
      <Tab.Screen
        name="PickUp"
        component={ShopMartScreen}
        options={{tabBarLabel: 'Pickup Delivery'}}
      />
      <Tab.Screen
        name="Profile"
        component={loggedIn ? MyAccount : AuthScreen}
        options={{tabBarLabel: 'My Account'}}
      />
      <Tab.Screen name="ShopMart" component={ShopMartScreen} />
      <Tab.Screen
        name="ShopMartSubCategories"
        component={SubCategoriesScreen}
      />
      {/* <Tab.Screen
        name="ShopMartPoductsScreen"
        component={ShopMartProductsScreen}
      /> */}
    </Tab.Navigator>
  );
};

function MyTabBar({state, descriptors, navigation, position, dispatch}) {
  const {currentTab} = useSelector((state) => state.currentTab);
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
          case 'PickUp':
            iconName = 'motorcycle';
        }

        const onPress = () => {
          dispatch(updateCurrentTab({currentTab: route.name}));

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
            //dispatch the current route name to store once will click on the tab button
          }
        };

        if (
          route.name != 'ShopMartPoductsScreen' &&
          route.name != 'ShopMartSubCategories' &&
          route.name != 'ShopMart'
        ) {
          //return the sell custom icon
          if (route.name == 'Sell') {
            return (
              <TouchableOpacity
                accessibilityRole="button"
                onPress={onPress}
                activeOpacity={0.8}>
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
                    Sell
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
