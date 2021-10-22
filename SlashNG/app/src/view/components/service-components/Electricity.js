import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button, Text, Item, Input, Picker, Root} from 'native-base';
import axios from 'axios';
import qs from 'query-string';

import {useSelector} from 'react-redux';
import {VTU_API} from '../../../const/api';
import PreLoader from '../modals/PreLoader';
import {updateUserBalance} from '../../../logics/auth/Auth/auth';

const Electricity = ({navigation}) => {
  const {data} = useSelector(state => state.userData);
  const [state, setState] = React.useState({
    showPreloader: false,
    products: [],
    amount: '',
    meter_no: '',
    network: '',
    user: data.id,
    token: data.token,
    message: 'Loading...',
  });
  React.useEffect(() => {
    getElectricityProducts();
  }, [0]);

  const getElectricityProducts = async () => {
    try {
      const res = await axios({
        url: VTU_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'variation',
          type: 'electricity',
          ...state,
        }),
      });

      const resData = res.data;

      if (resData.status == '200') {
        setState({...state, products: resData.products});
      } else {
        setTimeout(getElectricityProducts, 5000);
      }
    } catch (error) {
      setTimeout(getElectricityProducts, 5000);
    }
  };
  //verify the meter no
  const verifyMeterNumber = async () => {
    if (state.network.trim() === '') {
      Alert.alert('Error', 'Please choose network');
    } else if (state.meter_no.trim() === '') {
      Alert.alert('Error', 'Please input smart card number');
    } else if (state.amount.trim() === '') {
      Alert.alert('Error', 'Please input amount');
    } else {
      //verify the smart card number
      //show preloader
      setState({
        ...state,
        message: 'Validating your meter no...',
        showPreloader: true,
      });

      try {
        const res = await axios({
          url: VTU_API,
          method: 'POST',
          data: qs.stringify({
            cmd: 'validate',
            type: 'meter',
            ...state,
          }),
        });
        const resData = res.data;

        if (resData.status == '200') {
          Alert.alert('Validation was successful', 'HOLDER:' + resData.holder, [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Proceed',
              onPress: () => {
                //send user to confirmation page
                const serviceData = [
                  {network: state.network},
                  {cardholder: resData.holder},
                  {amount: state.amount},
                ];
                navigation.navigate('TransactionConfirmationScreen', {
                  data: serviceData,
                  method: buyElectricity,
                });
              },
            },
          ]);
          setState({...state, showPreloader: false});
        } else {
          setState({...state, showPreloader: false});
          //display an error message
          Alert.alert('Error', resData.message);
        }
      } catch (error) {
        setState({...state, showPreloader: false});
        //display an error message
        Alert.alert('Error', 'Something went wrong.');
      }
    }
  };

  const buyElectricity = async navigation => {
    //show preloader
    setState({...state, showPreloader: true, message: 'Loading...'});
    try {
      const res = await axios({
        url: VTU_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'buy',
          type: 'electricity',
          ...state,
        }),
      });
      const resData = res.data;

      if (resData.status == '200') {
        Alert.alert('Success', 'Transaction was successful', [
          {tetx: 'Ok', onPress: () => navigation.goBack()},
        ]);
        setState({...state, showPreloader: false, meter_no: '', amount: ''});
        //update user balance
        updateUserBalance();
      } else {
        setState({...state, showPreloader: false});
        //display an error message
        Alert.alert('Error', resData.message, [
          {tetx: 'Ok', onPress: () => navigation.goBack()},
        ]);
      }
    } catch (error) {
      setState({...state, showPreloader: false});
      //display an error message
      Alert.alert('Error', 'Something went wrong.', [
        {tetx: 'Ok', onPress: () => navigation.goBack()},
      ]);
    }
  };

  //render the product to input
  const renderProduct = () => {
    const values = state.products.map((value, id) => (
      <Picker.Item key={id} label={value.operator} value={value.product_id} />
    ));

    return (
      <Picker
        mode="dropdown"
        style={{width: undefined}}
        placeholder="Select Network"
        placeholderStyle={{color: '#bfc6ea'}}
        onValueChange={value => {
          setState({...state, network: value});
        }}
        selectedValue={state.network}>
        <Picker.Item label="Choose Network" value="" />
        {values}
      </Picker>
    );
  };

  return (
    <Root>
      <PreLoader visible={state.showPreloader} message={state.message} />
      <View style={style.container}>
        <Text style={style.title}>Electricity Topup</Text>
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
              {renderProduct()}
            </Item>
          </View>

          <View>
            <Text style={style.inputLabel}>Meter No</Text>
            <Item regular style={style.input}>
              <Input
                value={state.meter_no}
                keyboardType="numeric"
                onChangeText={value => setState({...state, meter_no: value})}
              />
            </Item>
          </View>
          <View>
            <Text style={style.inputLabel}>Amount</Text>
            <Item regular style={style.input}>
              <Input
                value={state.amount}
                keyboardType="numeric"
                onChangeText={value => setState({...state, amount: value})}
              />
            </Item>
          </View>
        </View>
        <Button onPress={verifyMeterNumber} block style={{marginTop: 20}}>
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

export default Electricity;
