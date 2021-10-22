import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button, Text, Item, Input, Picker, Root} from 'native-base';
import axios from 'axios';
import qs from 'query-string';
import {PRIMARY_COLOR} from '../../../../styles/colors';
import {useSelector} from 'react-redux';
import {VTU_API} from '../../../const/api';
import PreLoader from '../modals/PreLoader';
import {updateUserBalance} from '../../../logics/auth/Auth/auth';

const Airtime = ({navigation}) => {
  const {data} = useSelector(state => state.userData);
  const [state, setState] = React.useState({
    showPreloader: false,
    network: '',
    amount: '',
    phone: '',
    user: data.id,
    token: data.token,
  });
  React.useEffect(() => {}, [0]);

  const validateData = async () => {
    if (state.network.trim() === '') {
      Alert.alert('Error', 'Please choose network');
    } else if (state.amount.trim() === '') {
      Alert.alert('Error', 'Please input amount');
    } else if (state.amount.trim() < 50) {
      Alert.alert('Error', 'Min Amount 50NGN');
    } else if (state.phone.trim() === '') {
      Alert.alert('Error', 'Please input phone number');
    } else {
      //assign the value to the corresponding network
      let network = null;
      switch (state.network) {
        case '01':
          network = 'MTN';
          break;
        case '02':
          network = 'GLOBACOM';
          break;
        case '03':
          network = '9MOBILE';
          break;
        case '04':
          network = 'AIRTEL';
          break;
      }
      const serviceData = [
        {network},
        {amount: state.amount},
        {phone: state.phone},
      ];
      //send the user to the confirmation page
      navigation.navigate('TransactionConfirmationScreen', {
        data: serviceData,
        method: buyAirtime,
      });
    }
  };
  const buyAirtime = async navigation => {
    //show preloader
    setState({...state, showPreloader: true});
    try {
      const res = await axios({
        url: VTU_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'buy',
          type: 'airtime',
          ...state,
        }),
      });
      const resData = res.data;
      if (resData.status == '200') {
        Alert.alert('Success', 'Transaction was successful', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);

        //clear inputs
        setState({
          ...state,
          showPreloader: false,
          amount: '',
          phone: '',
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
        <Text style={style.title}>Airtime Topup</Text>
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
                onValueChange={value => setState({...state, network: value})}
                selectedValue={state.network}>
                <Picker.Item label="Choose Network" value="" />
                <Picker.Item label="MTN" value="01" />
                <Picker.Item label="GLOBACOM" value="02" />
                <Picker.Item label="9MOBILE" value="03" />
                <Picker.Item label="AIRTEL" value="04" />
              </Picker>
            </Item>
          </View>
          <View>
            <Text style={style.inputLabel}>Amount</Text>
            <Item regular style={style.input}>
              <Input
                placeholder=""
                keyboardType="numeric"
                value={state.amount}
                onChangeText={value => setState({...state, amount: value})}
              />
            </Item>
          </View>
          <View>
            <Text style={style.inputLabel}>Phone Number</Text>
            <Item regular style={style.input}>
              <Input
                placeholder=""
                keyboardType="numeric"
                value={state.phone}
                onChangeText={value => setState({...state, phone: value})}
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

export default Airtime;
