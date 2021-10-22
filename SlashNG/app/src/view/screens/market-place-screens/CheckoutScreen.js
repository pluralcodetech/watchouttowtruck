import React from 'react';
import {SafeAreaView, View, StyleSheet, ScrollView, Alert} from 'react-native';
import axios from 'axios';
import qs from 'query-string';
import {
  Root,
  Button,
  Text,
  Header,
  Left,
  Right,
  Icon,
  Body,
  Title,
  Item,
  Input,
  Picker,
  Toast,
} from 'native-base';
import ScreenLoader from '../../components/Loaders/ScreenLoader';
import PreLoader from '../../components/modals/PreLoader';

import {FormatNumber} from '../../../logics';
import {clearCart, getCartTotalAmount} from '../../../logics/cart';
import {useSelector} from 'react-redux';
import {SHOP_MART_API} from '../../../const/api';

const CheckoutScreen = ({navigation}) => {
  const {data} = useSelector((state) => state.userData);
  const {products} = useSelector((state) => state.userCart);

  //filter the products list
  const shopping_cart = products.map((item) => ({
    code: item.id,
    quantity: item.quantity,
  }));

  const [state, setState] = React.useState({
    cmd: 'create-order',
    showPreloader: false,
    loading: true,
    totalAmount: 0,
    orderFee: 0,
    deliveryState: [],
    stateId: '',
    order_id: '',
    shopping_cart: JSON.stringify(shopping_cart),
    mop: '',
    receiver_fname: '',
    receiver_lname: '',
    receiver_email: '',
    receiver_phone: '',
    dropoff_state: '',
    dropoff_address: '',
    dropoff_area: '',
    user: data.id,
    token: data.token,
  });

  const addContact = ({
    receiver_fname,
    receiver_lname,
    receiver_email,
    receiver_phone,
    dropoff_state,
    dropoff_address,
    dropoff_area,
    stateId,
  }) => {
    const newState = {
      ...state,
      receiver_fname,
      receiver_lname,
      receiver_email,
      receiver_phone,
      dropoff_state,
      dropoff_address,
      dropoff_area,
      stateId,
      showPreloader: true,
    };
    setState(newState);

    getDeliveryFee(newState, true);
  };

  React.useEffect(() => {
    getCartTotalAmount().then((amt) => {
      const newState = {...state, totalAmount: amt};
      setState(newState);
      getDeliveryFee(newState);
    });
  }, []);

  const getDeliveryFee = async (state, update = false) => {
    //send request to server
    try {
      const res = await axios({
        url: SHOP_MART_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'get-delivery-fee',
          type: 'order-history',
          order_total: state.totalAmount,
          user: data.id,
          token: data.token,
        }),
      });

      let resData = res.data;

      if (resData.status == 200) {
        //set order fee and close loading screen

        setState({...state, orderFee: resData.fee, showPreloader: false});

        //get delivery the function is called the first tym
        if (!update) {
          //get  user state once is successful
          fetchDeliveryState({
            ...state,
            orderFee: resData.fee,
            showPreloader: false,
          });
        }
      } else {
        //rerun funtion
        setTimeout(() => getDeliveryFee(state), 5000);
      }
    } catch (error) {
      setTimeout(() => getDeliveryFee(state), 10000);
    }
  };

  const fetchDeliveryState = async (state) => {
    //send request to server
    try {
      const res = await axios({
        url: SHOP_MART_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'fetch',
          type: 'delivery_states',
        }),
      });

      let resData = res.data;

      if (resData.status == 200) {
        //set state
        setState({
          ...state,
          loading: false,
          deliveryState: resData.states,
        });
      } else {
        //rerun funtion 5sec
        setTimeout(() => fetchDeliveryState(state), 5000);
      }
    } catch (error) {
      setTimeout(() => fetchDeliveryState(state), 10000);
    }
  };

  const filterCities = () => {
    return state.deliveryState
      .filter((data) => data.state_id == state.stateId)[0]
      ?.cities.map((city, index) => (
        <Picker.Item label={city} value={city} key={index} />
      ));
  };

  // check out
  const checkOut = async () => {
    const orderId = Math.round(data.id + '' + new Date().getMilliseconds());
    //validate the user input
    if (state.receiver_fname.trim() == '') {
      Toast.show({
        text: 'Please input first name',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.receiver_lname.trim() == '') {
      Toast.show({
        text: 'Please input last name',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.receiver_email.trim() == '') {
      Toast.show({
        text: 'Please input email',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.receiver_phone.trim() == '') {
      Toast.show({
        text: 'Please input phone no',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.dropoff_state.trim() == '') {
      Toast.show({
        text: 'Please input dropoff state',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.dropoff_address.trim() == '') {
      Toast.show({
        text: 'Please input dropoff address',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.dropoff_area.trim() == '') {
      Toast.show({
        text: 'Please input dropoff area',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.mop.trim() == '') {
      Toast.show({
        text: 'Please choose payment method',
        type: 'danger',
        duration: 4000,
      });
    } else {
      const contact = {
        contact_fname: state.receiver_fname,
        contact_lname: state.receiver_lname,
        delivery_address: state.dropoff_address,
        delivery_city: state.dropoff_area,
        delivery_city: state.dropoff_state,
      };

      setState({...state, showPreloader: true});
      try {
        let res = await axios({
          url: SHOP_MART_API,
          method: 'POST',
          data: qs.stringify({...state, order_id: orderId}),
        });

        const resData = res.data;
        console.log(resData);
        if (resData.status == '200') {
          setState({...state, showPreloader: false});

          if (state.mop == 'pay On delivery') {
            //send user to success page
            navigation.navigate('SuccessScreen', orderId);
            //clear cart and display success message
            clearCart();
          } else {
            //send to order details page
            navigation.navigate('CheckOutOrderDetailsScreen', {
              subTotal: state.totalAmount,
              deliveryFee: state.orderFee,
              total: state.totalAmount + state.orderFee,
              contact,
              id: orderId,
              mop: state.mop,
              products,
            });
          }
        } else {
          setState({...state, showPreloader: false});
          //show error message
          Alert.alert('Error', resData.message);
        }
      } catch (error) {
        console.error(error);
        setState({...state, showPreloader: false});
        //show error message
        Alert.alert('Error', 'Something went wrong please try again');
      }
    }
  };

  return (
    <Root>
      <PreLoader visible={state.showPreloader} />
      <ScreenLoader loading={state.loading} />

      <SafeAreaView>
        <Header noShadow>
          <Left>
            <Button transparent onPress={navigation.goBack}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Checkout</Title>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              paddingTop: 20,
              marginHorizontal: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={{marginTop: 20, fontSize: 20, fontWeight: 'bold'}}>
              Delivery Contact
            </Text>
            <Button
              small
              onPress={() =>
                navigation.navigate('AddressBookScreen', {addContact})
              }>
              <Text style={{fontSize: 12}}>Address Book</Text>
            </Button>
          </View>
          <View style={style.container}>
            <View>
              <Text style={style.inputLabel}>Firstname</Text>
              <Item regular style={style.input}>
                <Input
                  value={state.receiver_fname}
                  autoCapitalize="none"
                  onChangeText={(value) =>
                    setState({...state, receiver_fname: value})
                  }
                />
              </Item>
            </View>
            <View>
              <Text style={style.inputLabel}>Lastname</Text>
              <Item regular style={style.input}>
                <Input
                  value={state.receiver_lname}
                  autoCapitalize="none"
                  onChangeText={(value) =>
                    setState({...state, receiver_lname: value})
                  }
                />
              </Item>
            </View>
            <View>
              <Text style={style.inputLabel}>Email</Text>
              <Item regular style={style.input}>
                <Input
                  value={state.receiver_email}
                  autoCapitalize="none"
                  onChangeText={(value) =>
                    setState({...state, receiver_email: value})
                  }
                />
              </Item>
            </View>
            <View>
              <Text style={style.inputLabel}>Phone Number</Text>
              <Item regular style={style.input}>
                <Input
                  value={state.receiver_phone}
                  autoCapitalize="none"
                  onChangeText={(value) =>
                    setState({...state, receiver_phone: value})
                  }
                />
              </Item>
            </View>
            <View>
              <Text style={style.inputLabel}>State</Text>
              <Item regular style={style.input}>
                <Picker
                  selectedValue={state.stateId}
                  onValueChange={(value) => {
                    //get the state name
                    const stateName = state.deliveryState.filter(
                      (data) => data.state_id == value,
                    )[0]?.name;

                    setState({
                      ...state,
                      stateId: value,
                      dropoff_state: stateName,
                    });
                  }}>
                  <Picker.Item label="Choose State" value="" />
                  {state.deliveryState.map((data) => (
                    <Picker.Item
                      label={data.name}
                      value={data.state_id}
                      key={data.state_id}
                    />
                  ))}
                </Picker>
              </Item>
            </View>
            <View>
              <Text style={style.inputLabel}>Area</Text>
              <Item regular style={style.input}>
                <Picker
                  selectedValue={state.dropoff_area}
                  onValueChange={(value) => {
                    getDeliveryFee({...state, dropoff_area: value}, true);
                    setState({
                      ...state,
                      dropoff_area: value,
                      showPreloader: true,
                    });
                  }}>
                  <Picker.Item label="Choose Area" value="" />
                  {filterCities()}
                </Picker>
              </Item>
            </View>
            <View>
              <Text style={style.inputLabel}>Street</Text>
              <Item regular style={style.input}>
                <Input
                  value={state.dropoff_address}
                  autoCapitalize="none"
                  onChangeText={(value) =>
                    setState({...state, dropoff_address: value})
                  }
                />
              </Item>
            </View>
            <View>
              <Text style={style.inputLabel}>Payment Method</Text>
              <Item regular style={style.input}>
                <Picker
                  note
                  mode="dropdown"
                  style={{color: 'black'}}
                  selectedValue={state.mop}
                  onValueChange={(value) => setState({...state, mop: value})}>
                  <Picker.Item label="Choose Payment Method" value="" />
                  <Picker.Item label="E-Walltet" value="ewallet" />
                  <Picker.Item
                    label="Pay On Delivery"
                    value="pay On delivery"
                  />
                  <Picker.Item label="Bank Transfer" value="bank transfer" />
                </Picker>
              </Item>
            </View>
            <View
              style={{
                borderTopColor: 'grey',
                borderTopWidth: 0.5,
                marginTop: 20,
                paddingTop: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={{color: 'grey', fontSize: 16}}>Subtotal</Text>
                <Text
                  style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>
                  NGN{FormatNumber(state.totalAmount)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={{color: 'grey', fontSize: 16}}>Delivery Fee</Text>
                <Text
                  style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>
                  NGN{FormatNumber(state.orderFee)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text style={{color: 'grey', fontSize: 16}}>Total</Text>
                <Text
                  style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>
                  NGN{FormatNumber(state.totalAmount + state.orderFee)}
                </Text>
              </View>
              <Button
                block
                style={{marginTop: 20, marginBottom: 30}}
                onPress={checkOut}>
                <Text>Checkout</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Root>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    paddingBottom: 20,
    marginBottom: 100,
  },
  input: {marginTop: 2, height: 45},
  inputLabel: {
    marginTop: 15,
    marginLeft: 2,
    color: 'grey',
  },
});
export default CheckoutScreen;
