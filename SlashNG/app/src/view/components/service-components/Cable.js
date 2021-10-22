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

const Cable = ({navigation}) => {
  const {data} = useSelector(state => state.userData);
  const [state, setState] = React.useState({
    showPreloader: false,
    network: '',
    products: null,
    values: [],
    plan: '',
    amount: '',
    smart_card_no: '',
    user: data.id,
    token: data.token,
    message: 'Loading...',
  });
  React.useEffect(() => {
    getCableProducts();
  }, [0]);

  React.useEffect(() => {
    filterProducts(state.network);
  }, [state.network]);

  React.useEffect(() => {
    setProductAmount();
  }, [state.plan]);

  const renderPlans = () => {
    const values = state.values.map((value, id) => {
      return (
        <Picker.Item
          key={id}
          label={value.plan + ' (' + value.price + 'NGN)'}
          value={value.plan}
        />
      );
    });

    return (
      <Picker
        mode="dropdown"
        style={{width: undefined}}
        placeholder="Select Network"
        placeholderStyle={{color: '#bfc6ea'}}
        onValueChange={value => {
          setState({...state, plan: value});
        }}
        selectedValue={state.plan}>
        <Picker.Item label="Choose Plan" value="" />
        {values}
      </Picker>
    );
  };

  //set product amount to input
  const setProductAmount = async () => {
    if (state.plan != null) {
      const amount = await state.products.filter(
        product => product.plan == state.plan,
      );
      setState({...state, amount: amount[0].price});
    }
  };

  //filter to get the corresponding products
  const filterProducts = async name => {
    const values = await state.products.filter(
      product =>
        product.operator.toLowerCase() == name.toString().toLowerCase(),
    );
    setState({...state, values});
  };

  const getCableProducts = async () => {
    try {
      const res = await axios({
        url: VTU_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'variation',
          type: 'cable',
          ...state,
        }),
      });

      const resData = res.data;

      if (resData.status == '200') {
        setState({...state, products: resData.products});
      } else {
        setTimeout(getCableProducts, 5000);
      }
    } catch (error) {
      setTimeout(getCableProducts, 5000);
    }
  };
  //verify smart card
  const verifySmartCard = async () => {
    if (state.network.trim() === '') {
      Alert.alert('Error', 'Please choose network');
    } else if (state.smart_card_no.trim() === '') {
      Alert.alert('Error', 'Please input smart card number');
    } else if (state.plan.trim() === '') {
      Alert.alert('Error', 'Please choose plan');
    } else if (state.amount.trim() === '') {
      Alert.alert('Error', 'Please input amount');
    } else {
      let network = null;
      //get network
      if (state.network == 'DSTV') {
        network = '01';
      } else if (state.network == 'GOTV') {
        network = '02';
      } else if (state.network == 'STARTIME') {
        network = '03';
      }

      //verify the smart card number
      //show preloader
      setState({
        ...state,
        message: 'Verifing your smart card...',
        showPreloader: true,
      });

      try {
        const res = await axios({
          url: VTU_API,
          method: 'POST',
          data: qs.stringify({
            cmd: 'validate',
            type: 'smart_card',
            ...state,
            network,
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
                  {plan: state.plan},
                  {cardholder: resData.holder},
                  {amount: state.amount},
                ];
                navigation.navigate('TransactionConfirmationScreen', {
                  data: serviceData,
                  method: buyCable,
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

  const buyCable = async navigation => {
    //show preloader
    setState({...state, showPreloader: true, message: 'Loading...'});
    try {
      const res = await axios({
        url: VTU_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'buy',
          type: 'cable',
          ...state,
          smart_card: state.smart_card_no,
        }),
      });
      const resData = res.data;

      if (resData.status == '200') {
        Alert.alert('Success', 'Transaction was successful', [
          {tetx: 'Ok', onPress: () => navigation.goBack()},
        ]);
        setState({
          ...state,
          showPreloader: false,
          amount: '',
          smart_card_no: '',
          plan: '',
        });

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

  return (
    <Root>
      <PreLoader visible={state.showPreloader} message={state.message} />
      <View style={style.container}>
        <Text style={style.title}>Cable Subscription</Text>
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
                onValueChange={value => {
                  setState({...state, network: value, amount: ''});
                }}
                selectedValue={state.network}>
                <Picker.Item label="Choose Operator" value="" />
                <Picker.Item label="DSTV" value="DSTV" />
                <Picker.Item label="GOTV" value="GOTV" />
                <Picker.Item label="STARTIMES" value="STARTIME" />
              </Picker>
            </Item>
          </View>

          <View>
            <Text style={style.inputLabel}>Smart Card No</Text>
            <Item regular style={style.input}>
              <Input
                value={state.smart_card_no}
                keyboardType="numeric"
                onChangeText={value =>
                  setState({...state, smart_card_no: value})
                }
              />
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
        </View>
        <Button onPress={verifySmartCard} block style={{marginTop: 20}}>
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

export default Cable;
