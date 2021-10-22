import React from 'react';
import {Text, View, StyleSheet, ActivityIndicator, Modal} from 'react-native';
import {PRIMARY_COLOR} from '../../../styles/colors';

const ScreenLoader = ({loading}) => {
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    height: '100%',
    width: '100%',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  text: {
    marginTop: 5,
    fontSize: 15,
    // fontWeight: 'bold',
    color: '#fff',
  },
});

export default ScreenLoader;
