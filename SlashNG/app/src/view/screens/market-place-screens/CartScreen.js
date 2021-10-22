import React from 'react';
import {View, SafeAreaView, StyleSheet, Alert} from 'react-native';
import {Button, Root, Text, Item, Input, Toast} from 'native-base';
import axios from 'axios';
import qs from 'query-string';
import Header from '../../components/market-place-screens/Header';
import ScreenLoader from '../../components/Loaders/ScreenLoader';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import CartCard from '../../components/market-place-screens/CartCard';
import {SHOP_MART_API} from '../../../const/api';
import {useSelector} from 'react-redux';
import {clearCart, getCartTotalAmount} from '../../../logics/cart';
import PreLoader from '../../components/modals/PreLoader';
import MessageModal from '../../components/modals/MessageModal';
import {PRIMARY_COLOR} from '../../../styles/colors';
import {FormatNumber} from '../../../logics';

const CartScreen = ({navigation, route}) => {
  const {products} = useSelector((state) => state.userCart);
  React.useEffect(() => {
    getCartTotalAmount().then((amt) =>
      setTimeout(() => {
        setState({
          ...state,
          products,
          loading: false,
          showPreloader: false,
          totalAmount: amt,
        });
      }, 1000),
    );
    //load the products after some seconds
  }, [route.params, products]);

  const [state, setState] = React.useState({
    loading: true,
    products: [],
    showPreloader: false,
    totalAmount: 0,
  });

  const [messageModal, showMessageModal] = React.useState(false);

  return (
    <Root>
      <MessageModal
        showModal={showMessageModal}
        visible={messageModal}
        title="ADDRESS DETAILS"
        component={
          <View>
            <View>
              <Text style={style.inputLabel}>Drop State</Text>
              <Item regular style={style.input}>
                <Input
                  onChangeText={(value) =>
                    setState({...state, dropoff_state: value})
                  }
                />
              </Item>
            </View>
            <View>
              <Text style={style.inputLabel}>Drop Address</Text>
              <Item regular style={style.input}>
                <Input
                  onChangeText={(value) => {
                    setState({...state, dropoff_address: value});
                  }}
                />
              </Item>
            </View>
            <View>
              <Text style={style.inputLabel}>Drop Area</Text>
              <Item regular style={style.input}>
                <Input
                  onChangeText={(value) =>
                    setState({...state, dropoff_area: value})
                  }
                />
              </Item>
            </View>
            <Button
              block
              style={{marginTop: 20}}
              onPress={() => {
                checkOut();
              }}>
              <Text>CONTINUE</Text>
            </Button>
          </View>
        }
      />
      <PreLoader visible={state.showPreloader} />
      <ScreenLoader loading={state.loading} />
      <SafeAreaView>
        <Header title="My Cart" />
        <View
          style={{
            marginHorizontal: 15,
            marginBottom: 5,
            height: 30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{fontSize: 20}}>MY CART</Text>
          <TouchableOpacity
            onPress={() => {
              //show preloader
              setState({...state, showPreloader: true});
              //clear the products
              clearCart();
            }}>
            <Text style={{fontSize: 15, color: '#999'}}>Clear All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListFooterComponentStyle={{height: 350}}
          ListFooterComponent={() => {
            //hide buttons when page is loading or there is no product
            if (!state.loading && state.products.length > 0) {
              return (
                <View style={{margin: 15, marginBottom: 50}}>
                  <View
                    style={{
                      marginBottom: 15,
                      alignItems: 'flex-end',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{fontSize: 18, color: '#000'}}>Total</Text>

                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'grey',
                        color: PRIMARY_COLOR,
                      }}>
                      NGN{FormatNumber(state.totalAmount)}
                    </Text>
                  </View>
                  <Button
                    bordered
                    block
                    onPress={() => navigation.navigate({name: 'Home'})}>
                    <Text>CONTINUE SHOPPING</Text>
                  </Button>
                  <Button
                    block
                    style={{marginTop: 10}}
                    onPress={() =>
                      navigation.navigate('ShopMartCheckoutScreen')
                    }>
                    <Text>CHECKOUT</Text>
                  </Button>
                </View>
              );
            } else if (!state.loading && state.products.length == 0) {
              return (
                <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
                  <Text>You have no item in your cart</Text>
                </View>
              );
            } else {
              return null;
            }
          }}
          data={state.products}
          renderItem={({item}) => <CartCard data={item} />}
        />
      </SafeAreaView>
    </Root>
  );
};

const style = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {marginTop: 2, height: 45},
  inputLabel: {
    marginTop: 15,
    marginLeft: 2,
    color: 'grey',
  },
});

export default CartScreen;
