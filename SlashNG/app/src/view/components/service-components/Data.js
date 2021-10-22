import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button, Text, Item, Input, Picker, Root} from 'native-base';
import axios from 'axios';
import qs from 'query-string';
import {PRIMARY_COLOR} from '../../../styles/colors';
import {useSelector} from 'react-redux';
import {VTU_API} from '../../../const/api';
import PreLoader from '../modals/PreLoader';
import {updateUserBalance} from '../../../logics/auth/Auth/auth';

const Data = ({navigation}) => {
  const {data} = useSelector((state) => state.userData);
  const [state, setState] = React.useState({
    showPreloader: false,
    network: '',
    products: null,
    values: [],
    product_id: '',
    amount: '',
    phone: '',
    user: data.id,
    token: data.token,
  });
  React.useEffect(() => {
    getDataProducts();
  }, [0]);

  React.useEffect(() => {
    filterProducts(state.network);
  }, [state.network]);

  React.useEffect(() => {
    setProductAmount();
  }, [state.product_id]);

  const renderPlans = () => {
    const values = state.values.map((value, id) => (
      <Picker.Item
        key={id}
        label={state.network + ' ' + value.plan + ' (' + value.price + 'NGN)'}
        value={value.product_id}
      />
    ));

    return (
      <Picker
        mode="dropdown"
        style={{width: undefined}}
        placeholder="Select Network"
        placeholderStyle={{color: '#bfc6ea'}}
        onValueChange={(value) => {
          setState({...state, product_id: value});
        }}
        selectedValue={state.product_id}>
        <Picker.Item label="Choose Plan" value="" />
        {values}
      </Picker>
    );
  };

  //set product amount to input
  const setProductAmount = async () => {
    if (state.product_id != null) {
      const amount = await state.products.filter(
        (product) => product.product_id == state.product_id,
      );
      setState({...state, amount: amount[0].price});
    }
  };

  //filter to get the corresponding products
  const filterProducts = async (name) => {
    const values = await state.products.filter(
      (product) => product.network == name.toString().toLowerCase(),
    );
    setState({...state, values});
  };

  const getDataProducts = async () => {
    try {
      const res = await axios({
        url: VTU_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'variation',
          type: 'data',
        }),
      });
      const resData = res.data;
      if (resData.status == '200') {
        setState({...state, products: resData.products});
      } else {
        setTimeout(getDataProducts, 5000);
      }
    } catch (error) {
      setTimeout(getDataProducts, 5000);
    }
  };

  //validate user dat

  const validateData = async () => {
    //validate input
    if (state.network.trim() === '') {
      Alert.alert('Error', 'Please choose network');
    } else if (state.product_id.trim() === '') {
      Alert.alert('Error', 'Please choose plan');
    } else if (state.amount.trim() === '') {
      Alert.alert('Error', 'Please input amount');
    } else if (state.phone.trim() === '') {
      Alert.alert('Error', 'Please input phone number');
    } else {
      const serviceData = [
        {network: state.network},
        {amount: state.amount},
        {plan: state.product_id},
        {phone: state.phone},
      ];
      //send the user to the confirmation page
      navigation.navigate('TransactionConfirmationScreen', {
        data: serviceData,
        method: buyData,
      });
    }
  };

  const buyData = async (navigation) => {
    //show preloader
    setState({...state, showPreloader: true});
    try {
      const res = await axios({
        url: VTU_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'buy',
          type: 'data',
          ...state,
        }),
      });
      const resData = res.data;
      if (resData.status == '200') {
        Alert.alert('Success', 'Transaction was successful', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);

        //close loader and also clear input
        setState({
          ...state,
          showPreloader: false,
          phone: '',
          product_id: '',
          network: '',
        });

        //update user balance
        updateUserBalance();
      } else {
        setState({...state, showPreloader: false});
        //display an error message
        Alert.alert('Error', resData.message, [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      setState({...state, showPreloader: false});
      //display an error message
      Alert.alert('Error', 'Something went wrong.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  };

  return (
    <Root>
      <PreLoader visible={state.showPreloader} />
      <View style={style.container}>
        <Text style={style.title}>Data Topup</Text>
        <View>
          <View>
            <Text style={style.inputLabel}>Wallet Balance</Text>
            <Item disabled regular style={style.input}>
              <Input
                disabled
                placeholder="Wallet Balance"
                defaultValue={'₦' + data.balance.toString()}
              />
            </Item>
          </View>
          <View>
            <Text style={style.inputLabel}>Network</Text>
            <Item regular picker style={style.input}>
              <Picker
                mode="dropdown"
                style={{width: undefined}}
                placeholder="Select Network"
                placeholderStyle={{color: '#bfc6ea'}}
                onValueChange={(value) => {
                  setState({...state, network: value, amount: ''});
                }}
                selectedValue={state.network}>
                <Picker.Item label="Choose Network" value="" />
                <Picker.Item label="MTN" value="MTN" />
                <Picker.Item label="GLOBACOM" value="GLOBACOM" />
                <Picker.Item label="9MOBILE" value="9MOBILE" />
                <Picker.Item label="AIRTEL" value="AIRTEL" />
                <Picker.Item label="SMILE" value="SMILE" />
              </Picker>
            </Item>
          </View>
          <View>
            <Text style={style.inputLabel}>Plans</Text>
            <Item regular picker style={style.input}>
              {renderPlans()}
            </Item>
          </View>
          <View>
            <Text style={style.inputLabel}>Amount</Text>
            <Item regular style={style.input}>
              <Input
                disabled
                placeholder=""
                keyboardType="numeric"
                value={state.amount}
              />
            </Item>
          </View>
          <View>
            <Text style={style.inputLabel}>Phone Number</Text>
            <Item regular style={style.input}>
              <Input
                value={state.phone}
                placeholder=""
                keyboardType="numeric"
                onChangeText={(value) => setState({...state, phone: value})}
              />
            </Item>
          </View>
        </View>
        <Button onPress={validateData} block style={{marginTop: 20}}>
          <Text>Procced</Text>
        </Button>
      </View>
    </Root>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    marginTop: 40,
    paddingBottom: 50,
  },
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

export default Data;
