import React from 'react';
import {Text, View, StyleSheet, Modal} from 'react-native';
import {PRIMARY_COLOR} from '../../../styles/colors';
import {Button, Icon} from 'native-base';
const CartModal = ({visible = false, showModal, data}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={{fontSize: 20, marginLeft: 15}}>Added to Cart</Text>
            <Button transparent onPress={() => showModal(false)}>
              <Icon type="MaterialIcons" name="close" style={{color: '#000'}} />
            </Button>
          </View>
          <View style={{margin: 15}}>
            <Text style={{fontSize: 18, color: 'grey'}}>{data?.name}</Text>

            <Button
              small
              block
              bordered
              style={{marginTop: 20}}
              onPress={() => showModal(false)}>
              <Text style={{color: PRIMARY_COLOR}}>CONTINUE SHOPPING</Text>
            </Button>

            <Button small block style={{marginTop: 10}}>
              <Text style={{color: '#fff'}}>VIEW CART</Text>
            </Button>
          </View>
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
    // fontWeight: 'bold',
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

export default CartModal;
