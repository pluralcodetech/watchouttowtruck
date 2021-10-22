import React from 'react';
import {Animated, Dimensions, TouchableOpacity, View} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import HomeScreen from '../screens/HomeScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BookScreen from '../screens/BookScreen';
const {width} = Dimensions.get('window');
const Tab = createMaterialTopTabNavigator();
const MyTabs = ({state, descriptors, navigation, position}) => {
  console.log(position);
  const currentIndex = React.useRef(0);
  const tabWidth = width / state.routes.length;
  const inputRange = state.routes.map((_, i) => i);
  const translateX = position.interpolate({
    inputRange,
    outputRange: state.routes.map((_, i) => i * tabWidth),
  });

  const navigate = index => {
    navigation.navigate(state.routes[index].name);
  };

  return (
    <View
      style={{
        height: 65,
        backgroundColor: '#FF6060',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Animated.View
        style={{
          height: 4,
          width: 10,
          position: 'absolute',
          backgroundColor: 'white',
          top: 5,
          borderRadius: 10,
          transform: [{translateX}],
        }}
      />
      {state.routes.map((route, index) => {
        const {
          options: {tabBarIcon},
        } = descriptors[route.key];
        const isFocused = state.index === index;
        if (isFocused) {
          console.log('Focused');
          currentIndex.current = index;
        }
        return (
          <TouchableOpacity
            onPress={() => navigate(index)}
            key={index}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {tabBarIcon({size: 35})}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const BottomNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarPosition="bottom"
        tabBar={props => <MyTabs {...props} />}>
        <Tab.Screen
          options={{
            tabBarIcon: ({size}) => (
              <Icon name="home" style={{fontSize: size, color: '#FEE1E1'}} />
            ),
          }}
          name="Home"
          component={HomeScreen}
        />
        <Tab.Screen
          options={{
            tabBarIcon: ({size}) => (
              <Icon name="account" style={{fontSize: size}} />
            ),
          }}
          name="Profile"
          component={ProfileScreen}
        />

        <Tab.Screen
          options={{
            tabBarIcon: ({size}) => (
              <Icon name="book" style={{fontSize: size}} />
            ),
          }}
          name="Book"
          component={BookScreen}
        />
        <Tab.Screen
          options={{
            tabBarIcon: ({size}) => (
              <Icon name="cog" style={{fontSize: size}} />
            ),
          }}
          name="Settings"
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default BottomNavigator;
