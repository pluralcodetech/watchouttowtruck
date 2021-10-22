import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import {View, Text, Icon} from 'native-base';
import {TouchableOpacity, StyleSheet} from 'react-native';
import COLORS from '../../styles/colors';
import FONTS from '../../conts/fonts';
import CaseDetailsScreen from '../screens/CaseDetailsScreen';
import CaseRecordsScreen from '../screens/CaseRecordsScreen';
import VerifyPatientScreen from '../screens/VerifyPatientScreen';
import {createOrderAction} from '../../redux/actions';
import {useDispatch} from 'react-redux';
import CallWatchOutFab from '../components/CallWatchOutFab';

const Tab = createBottomTabNavigator();

function MyTabBar({state, descriptors, navigation}) {
  const dispatch = useDispatch();
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={{flexDirection: 'row', height: 65}}>
      <CallWatchOutFab />
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const Tab = () => {
          const tabColor =
            label == 'HomeScreen' ? COLORS.secondary : COLORS.primary;
          //Only show tabs for two screens
          if (label == 'HomeScreen') {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => dispatch(createOrderAction(true))}
                style={[
                  styles.tabContainer,
                  {
                    backgroundColor: tabColor,
                  },
                ]}>
                <Icon
                  name="tow-truck"
                  type="MaterialCommunityIcons"
                  style={{color: COLORS.white, fontSize: 25}}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.white,
                    fontFamily: FONTS.bold,
                  }}>
                  ORDER TOW SERVICE
                </Text>
              </TouchableOpacity>
            );
          } else if (label == 'CaseRecordsScreen') {
            return (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPress}
                style={[styles.tabContainer, {backgroundColor: tabColor}]}>
                <Icon
                  name="history"
                  type="MaterialIcons"
                  style={{color: COLORS.white, fontSize: 25}}
                />
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.white,
                    fontFamily: FONTS.bold,
                  }}>
                  ORDER HISTORY
                </Text>
              </TouchableOpacity>
            );
          } else {
            return null;
          }
        };

        return <Tab key={index} />;
      })}
    </View>
  );
}

function BottomTabNavigator() {
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="CaseDetailsScreen" component={CaseDetailsScreen} />
      <Tab.Screen name="CaseRecordsScreen" component={CaseRecordsScreen} />
      <Tab.Screen name="VerifyPatientScreen" component={VerifyPatientScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomTabNavigator;
