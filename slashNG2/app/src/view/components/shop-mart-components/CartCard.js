import React from 'react';
import {View, Image, Dimensions, StyleSheet, Picker} from 'react-native';
import {Text, Button, Icon, Input, Item} from 'native-base';
import {LIGHT, PRIMARY_COLOR, SECONDARY_COLOR} from '../../../styles/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const CartCard = ({data}) => {
  return (
    <View style={style.cardContainer}>
      <Image style={style.productImage} source={{uri: data.img}} />
      <View style={style.detailsContainer}>
        <Text style={style.nameOfProduct} numberOfLines={2}>
          {data.name}
        </Text>
        <Text style={style.price}>₦{data.price}</Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              <Icon
                type="MaterialIcons"
                name="delete"
                style={{fontSize: 17, color: '#4897d9'}}
              />
              <Text style={{color: '#4897d9', fontSize: 15}}>REMOVE</Text>
            </View>
          </TouchableOpacity>
          <View style={style.pickerContainer}>
            <Picker
              style={{width: 80, marginLeft: 2}}
              mode="dialog"
              selectedValue={'1'}
              onValueChange={null}>
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
            </Picker>
          </View>
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  cardContainer: {
    backgroundColor: LIGHT,
    flex: 1,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: 15,
    marginVertical: 7,
    flexDirection: 'row',
  },

  nameOfProduct: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsContainer: {
    width: '70%',
    height: '100%',
    padding: 10,
  },
  productImage: {
    height: '100%',
    width: '30%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  price: {
    fontSize: 20,
    marginTop: 5,
    fontWeight: 'bold',
    color: SECONDARY_COLOR,
  },
  pickerContainer: {
    borderColor: '#999',
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
    overflow: 'hidden',
  },
});

export default CartCard;
