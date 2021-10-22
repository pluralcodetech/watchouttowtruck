import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native';

import {
  Header,
  Left,
  Icon,
  Button,
  Body,
  Title,
  Right,
  Text,
  Root,
  View,
} from 'native-base';
import axios from 'axios';
import qs from 'query-string';
import {useSelector} from 'react-redux';
import {PRIMARY_COLOR} from '../../../styles/colors';
import {FormatNumber} from '../../../logics';
import ScreenLoader from '../../components/Loaders/ScreenLoader';
import {SHOP_MART_API} from '../../../const/api';

const OrderDetailsScreen = ({navigation, route}) => {
  const {data} = useSelector((state) => state.userData);
  const [imageLoading, setImageLoading] = React.useState(true);

  const [state, setState] = React.useState({
    user: data.id,
    token: data.token,
    refid: route.params.id,
    loading: true,
    orderDatails: null,
  });

  React.useEffect(() => {
    getOrderDetails();
  }, []);
  const getOrderDetails = async () => {
    //send request to server
    try {
      const res = await axios({
        url: SHOP_MART_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'fetch',
          type: 'order-detail',
          ...state,
        }),
      });

      let resData = res.data;

      if (resData.status == 200) {
        setState({...state, orderDatails: resData, loading: false});
      } else {
        //rerun the function
      }
    } catch (error) {
      setTimeout(getOrderDetails, 5000);
    }
  };

  //component to display the product details
  const ProductDatails = ({product}) => {
    console.log(product);
    return (
      <View
        style={{
          height: 100,
          flexDirection: 'row',
          marginTop: 20,
          borderBottomColor: 'grey',
          borderBottomWidth: 0.5,
          paddingBottom: 10,
        }}>
        <ImageBackground
          resizeMode="center"
          source={require('../../../assets/loading.gif')}
          style={{height: 100, width: 100}}>
          <Image
            onLoad={() => setImageLoading(false)}
            style={{
              width: '100%',
              height: '100%',
              zIndex: !imageLoading ? 1 : -1,
            }}
            source={{uri: product.img}}
          />
        </ImageBackground>

        <View style={{flex: 1, marginLeft: 10}}>
          <Text
            numberOfLines={2}
            style={{color: 'grey', fontWeight: 'bold', fontSize: 15}}>
            {product.name}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontWeight: 'bold', fontSize: 14}}>QTY:</Text>
            <Text style={{fontWeight: 'bold', fontSize: 14}}>
              {product.quantity}
            </Text>
          </View>
          <Text
            style={{
              bottom: 0,
              position: 'absolute',
              fontWeight: 'bold',
              fontSize: 14,
            }}>
            Total: ₦{FormatNumber(product.price)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Root>
      <ScreenLoader loading={state.loading} />
      <SafeAreaView style={{flex: 1}}>
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Order Datails</Title>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 50}}>
          {!state.loading && (
            <View style={{marginHorizontal: 20, marginTop: 20}}>
              <View
                style={{
                  marginBottom: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                  Order Id:{route.params.id}
                </Text>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    backgroundColor: PRIMARY_COLOR,
                  }}>
                  <Text
                    style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>
                    {state.orderDatails.details.status}
                  </Text>
                </View>
              </View>
              <View style={style.detailsContainer}>
                <View style={style.detailsHeader}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                    }}>
                    Delivery Contact
                  </Text>
                </View>
                <View style={style.detailsBody}>
                  <Text style={{fontWeight: 'bold'}}>
                    {state.orderDatails.details.contact_fname +
                      ' ' +
                      state.orderDatails.details.contact_lname}
                  </Text>
                  <Text>{state.orderDatails.details.delivery_address}</Text>
                  <Text>
                    {state.orderDatails.details.delivery_address +
                      ' ' +
                      state.orderDatails.details.delivery_city}
                  </Text>
                </View>
              </View>
              <View style={[style.detailsContainer, {marginTop: 20}]}>
                <View style={style.detailsHeader}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                    }}>
                    Order Summary
                  </Text>
                </View>
                <View style={style.detailsBody}>
                  {state.orderDatails.products.map((product) => (
                    <ProductDatails product={product} />
                  ))}

                  <View
                    style={{
                      height: 0.1,
                      backgroundColor: 'grey',
                      marginVertical: 20,
                    }}
                  />
                  <View style={{marginBottom: 20}}>
                    <View style={style.priceContainer}>
                      <Text>Subtotal</Text>
                      <Text style={{fontWeight: 'bold'}}>
                        ₦{FormatNumber(state.orderDatails.details.subtotal)}
                      </Text>
                    </View>
                    <View style={style.priceContainer}>
                      <Text>Delivery Fee</Text>
                      <Text style={{fontWeight: 'bold'}}>
                        ₦{FormatNumber(state.orderDatails.details.delivery_fee)}
                      </Text>
                    </View>
                    <View style={style.priceContainer}>
                      <Text>Total</Text>
                      <Text style={{fontWeight: 'bold', color: PRIMARY_COLOR}}>
                        ₦{FormatNumber(state.orderDatails.details.total_amt)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Root>
  );
};

const style = StyleSheet.create({
  detailsContainer: {
    borderColor: 'grey',
    borderWidth: 0.3,
    minHeight: 150,
    backgroundColor: '#fff',
  },
  detailsHeader: {
    height: 50,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  detailsBody: {
    padding: 20,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default OrderDetailsScreen;
