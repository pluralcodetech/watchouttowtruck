import React from 'react';
import {Text, View, StyleSheet, ActivityIndicator, Modal} from 'react-native';
import {PRIMARY_COLOR} from '../../../styles/colors';

const BottomLoader = () => {
  return (
    <View style={{width: '100%', marginBottom: 10}}>
      <ActivityIndicator size="large" color={PRIMARY_COLOR} />
    </View>
  );
};

export default BottomLoader;
