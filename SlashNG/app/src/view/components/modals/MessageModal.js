import React from 'react';
import {Text, View, StyleSheet, Modal} from 'react-native';
import {PRIMARY_COLOR} from '../../../styles/colors';
import {Button, Icon} from 'native-base';
import {useNavigation} from '@react-navigation/native';
const MessageModal = ({visible = false, showModal, component, title}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={{fontSize: 20, marginLeft: 15}}>{title}</Text>
            <Button transparent onPress={() => showModal(false)}>
              <Icon type="MaterialIcons" name="close" style={{color: '#000'}} />
            </Button>
          </View>
          <View style={{margin: 15}}>{component}</View>
        </View>
      </View>
    </Modal>
  );
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
    color: '#fff',
  },

  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  body: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 5,
    paddingBottom: 15,
  },
});

export default MessageModal;
