import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import COLORS from '../../const/colors';

const Loader = ({style}) => {
  return (
    <View style={{...style, justifyContent: 'center'}}>
      <ActivityIndicator size="large" color={COLORS.orange} />
    </View>
  );
};

export default Loader;
