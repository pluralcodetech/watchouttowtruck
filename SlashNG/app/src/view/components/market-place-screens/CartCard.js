import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {Text, Icon, Picker} from 'native-base';
import {LIGHT, SECONDARY_COLOR} from '../../../styles/colors';

import {removeFromCart, updateProductQuantity} from '../../../logics/cart';
import PreLoader from '../modals/PreLoader';
import {FormatNumber} from '../../../logics';

const CartCard = ({data}) => {
  const pickerNum = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const [state, setState] = React.useState({
    quantity: data.quantity.toString(),
    mainPrice: data.mainPrice,
    price: data.price,
    showPreloader: false,
  });

  const [imageLoading, setImageLoading] = React.useState(true);
  return (
    <View style={style.cardContainer}>
      <PreLoader visible={state.showPreloader} />
      <ImageBackground
        resizeMode="center"
        source={require('../../../assets/loading.gif')}
        style={style.productImage}>
        <Image
          onLoad={() => setImageLoading(false)}
          style={{
            height: '100%',
            width: '100%',
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            zIndex: !imageLoading ? 1 : -1,
          }}
          source={{uri: data.img}}
        />
      </ImageBackground>

      <View style={style.detailsContainer}>
        <Text style={style.nameOfProduct} numberOfLines={2}>
          {data.name}
        </Text>
        <Text style={style.price}>₦{FormatNumber(state.price)}</Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 5,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              //show preloader
              setState({...state, showPreloader: true});
              removeFromCart(data);
              //hide the preloader after 1sec
              setTimeout(
                () => setState({...state, showPreloader: false}),
                2000,
              );
            }}>
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
              // mode="dropdown"
              selectedValue={state.quantity.toString()}
              onValueChange={(value) => {
                const price = parseInt(parseInt(value) * state.mainPrice);
                updateProductQuantity({
                  ...data,
                  price,
                  quantity: parseInt(value),
                });
                setState({
                  ...state,
                  quantity: value,
                  price,
                  mainPrice: state.mainPrice,
                });
              }}>
              {pickerNum.map((num) => (
                <Picker.Item label={num} value={num} key={num} />
              ))}
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
    fontWeight: '500',
  },
  detailsContainer: {
    width: '70%',
    height: '100%',
    padding: 10,
  },
  productImage: {
    height: 120,
    flex: 1,
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
