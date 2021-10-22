import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {Button, Icon, Root, Text} from 'native-base';
import axios from 'axios';
import qs from 'query-string';
import {PRIMARY_COLOR} from '../../../styles/colors';
import Header from '../../components/shop-mart-components/Header';
import ScreenLoader from '../../components/Loaders/ScreenLoader';
import {FlatList} from 'react-native-gesture-handler';
import CartCard from '../../components/shop-mart-components/CartCard';
import {SHOP_MART_API} from '../../../const/api';
import {useSelector} from 'react-redux';

//get products for the cart
const getProducts = async (data, state, setState) => {
  try {
    const res = await axios({
      url: SHOP_MART_API,
      method: 'POST',
      data: qs.stringify({
        user: data.id,
        token: data.token,
        cmd: 'fetch',
        type: 'wishlist',
      }),
    });

    const resData = res.data;
    console.log(resData);
    if (resData.status == '200') {
      setState({...state, products: resData.wishlist, loading: false});
    } else {
      //display an error message
    }
  } catch (error) {
    //rerun the function after 5sec

    setTimeout(() => getProducts(data, state, setState), 5000);
  }
};

const CartScreen = ({navigation, route}) => {
  const {data} = useSelector((state) => state.userData);
  React.useEffect(() => {
    getProducts(data, state, setState);
  }, [route.params]);

  const [state, setState] = React.useState({
    loading: true,
    products: [],
  });
  return (
    <Root>
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
          <Text style={{fontSize: 15, color: '#999'}}>Clear All</Text>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          ListFooterComponentStyle={{height: 300}}
          ListFooterComponent={() =>
            //hide buttons when page is loading
            !state.loading ? (
              <View style={{margin: 15}}>
                <Button bordered block onPress={() => navigation.goBack()}>
                  <Text>CONTINUE SHOPPING</Text>
                </Button>
                <Button block style={{marginTop: 10}}>
                  <Text>CHECKOUT</Text>
                </Button>
              </View>
            ) : null
          }
          data={state.products}
          renderItem={({item}) => <CartCard data={item} />}
        />
      </SafeAreaView>
    </Root>
  );
};

const styles = StyleSheet.create({});

export default CartScreen;
