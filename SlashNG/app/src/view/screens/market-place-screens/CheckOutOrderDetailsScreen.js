import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  ImageBackground,
  Alert,
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
import {API, SHOP_MART_API} from '../../../const/api';
import MessageModal from '../../components/modals/MessageModal';
import PreLoader from '../../components/modals/PreLoader';
import {clearCart} from '../../../logics/cart';

const CheckOutOrderDetailsScreen = ({navigation, route}) => {
  const {data} = useSelector((state) => state.userData);
  const [imageLoading, setImageLoading] = React.useState(true);
  const {
    id,
    contact,
    products,
    total,
    subTotal,
    deliveryFee,
    mop,
  } = route.params;

  const [state, setState] = React.useState({
    user: data.id,
    token: data.token,
    cmd: 'pay_order',
    order_id: id,
    type: 'wallet',
    showPreloader: false,
  });

  const [messageModal, showMessageModal] = React.useState(false);

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

  const payNow = async () => {
    //check for method of payment
    if (mop == 'bank transfer') {
      showMessageModal(true);
      clearCart();
    } else {
      setState({...state, showPreloader: true});
      //pay with ewallet
      try {
        const res = await axios({
          url: SHOP_MART_API,
          method: 'POST',
          data: qs.stringify(state),
        });

        let resData = res.data;

        if (resData.status == 200) {
          clearCart();
          setState({...state, showPreloader: false});
          navigation.navigate('SuccessScreen', id);
          // Alert.alert('Success', resData.message, [
          //   {
          //     text: 'OK',
          //     onPress: () => navigation.navigate('Home'),
          //   },
          // ]);
        } else {
          setState({...state, showPreloader: false});
          //rerun the function
          Alert.alert('Error', resData.message);
        }
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'Something went wrong please try again');
      }
    }
  };

  return (
    <Root>
      {/* message modal */}
      <MessageModal
        showModal={showMessageModal}
        visible={messageModal}
        title="Bank Details"
        component={
          <View style={{width: '100%'}}>
            <Text style={{fontWeight: 'bold'}}>
              TRANFER TO THE ACCOUNT BELOW
            </Text>
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Text style={{fontWeight: 'bold'}}>Bank Name:</Text>
              <Text style={{width: '70%'}}>{data.funding_bank_name}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
              }}>
              <Text style={{fontWeight: 'bold'}}>Account Name:</Text>
              <Text style={{width: '70%'}}>{data.funding_acct_name}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
              }}>
              <Text style={{fontWeight: 'bold'}}>Account Number:</Text>
              <Text style={{width: '70%'}}>{data.funding_acct_no}</Text>
            </View>
            <Button
              block
              style={{marginTop: 15}}
              onPress={() => {
                showMessageModal(false);
                navigation.navigate('Home');
              }}>
              <Text>OK</Text>
            </Button>
          </View>
        }
      />
      <PreLoader visible={state.showPreloader} />
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
                  Order Id:{id}
                </Text>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    backgroundColor: PRIMARY_COLOR,
                  }}>
                  <Text
                    style={{color: '#fff', fontSize: 15, fontWeight: 'bold'}}>
                    Pending
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
                    {contact.contact_fname + ' ' + contact.contact_lname}
                  </Text>
                  <Text>{contact.contact_lname}</Text>
                  <Text>
                    {contact.delivery_address + ' ' + contact.delivery_city}
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
                  {products.map((product) => (
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
                        ₦{FormatNumber(subTotal)}
                      </Text>
                    </View>
                    <View style={style.priceContainer}>
                      <Text>Delivery Fee</Text>
                      <Text style={{fontWeight: 'bold'}}>
                        ₦{FormatNumber(deliveryFee)}
                      </Text>
                    </View>
                    <View style={style.priceContainer}>
                      <Text>Total</Text>
                      <Text style={{fontWeight: 'bold', color: PRIMARY_COLOR}}>
                        ₦{FormatNumber(total)}
                      </Text>
                    </View>
                  </View>
                </View>
                <Button
                  block
                  onPress={payNow}
                  style={{marginHorizontal: 20, marginBottom: 20}}>
                  <Text>Pay Now</Text>
                </Button>
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

export default CheckOutOrderDetailsScreen;
