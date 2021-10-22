import React from 'react';
import {Modal, Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import {PRIMARY_COLOR} from '../../../styles/colors';

const PreLoader = ({visible, message = 'Loading...'}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}>
        <View
          style={{
            height: 100,
            backgroundColor: '#fff',
            width: '80%',
            alignItems: 'center',
            borderRadius: 5,
            flexDirection: 'row',
          }}>
          <ActivityIndicator
            size="large"
            color={PRIMARY_COLOR}
            style={{marginLeft: 20, marginRight: 15}}
          />
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default PreLoader;
