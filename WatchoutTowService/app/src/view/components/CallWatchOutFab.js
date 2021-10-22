import React from 'react';
import {Alert, Linking, StyleSheet, TouchableOpacity} from 'react-native';
import {View, Icon, Text} from 'native-base';
import COLORS from '../../styles/colors';
import FONTS from '../../conts/fonts';
import {useSelector} from 'react-redux';

const call = phone => {
  Alert.alert('Alert', 'Make Call?', [
    {
      text: 'No',
    },
    {
      text: 'Yes',
      onPress: () => {
        Linking.openURL(`tel:${phone}`);
      },
    },
  ]);
};

const CallWatchOutFab = () => {
  const {data} = useSelector(state => state.userData);

  return (
    <View style={style.fabContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => call(data?.watchout_phone)}>
        <View style={style.iconContainer}>
          <Icon name="call" style={{color: COLORS.white, fontSize: 20}} />
        </View>
      </TouchableOpacity>
      <Text style={style.fabText}>CALL WATCHOUT</Text>
    </View>
  );
};

const style = StyleSheet.create({
  iconContainer: {
    height: 45,
    width: 45,
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    marginBottom: 5,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    zIndex: 100,
    alignItems: 'center',
  },
  fabText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
});

export default CallWatchOutFab;
