import React from 'react';
import {SafeAreaView, ScrollView, Image, Alert} from 'react-native';
import axios from 'axios';
import {Button, Input, Text, View} from 'native-base';
import {LOGO} from '../../../conts/assets';
import authStyles from '../../../styles/authStyles';
import globalStyles from '../../../styles/styles';
import COLORS from '../../../styles/colors';
import API from '../../../conts/api';
import PreLoader from '../../components/loaders/PreLoader';
import qs from 'qs';

const SignInScreen = ({navigation}) => {
  const [state, setState] = React.useState({
    plate_number: '',
    showPreloader: false,
  });
  //Sign in user
  const signInUser = async () => {
    //Validate user input
    if (state.plate_number == '') {
      Alert.alert('Alert', 'Please input plate number');
    } else {
      //Show preloader
      setState({...state, showPreloader: true});
      try {
        const res = await axios({
          url: API + '/otp.php',
          method: 'POST',
          data: qs.stringify({
            plate_number: state.plate_number,
          }),
        });

        const resData = res.data;
        console.log(resData);

        //Hide preloader
        setState({...state, showPreloader: false});

        if (resData.statuscode == '00') {
          //Navigate user to OTP page
          navigation.navigate('OtpScreen', {
            plate_number: state.plate_number,
            phone: resData.phone,
            code: resData.otp,
          });
        } else {
          Alert.alert('Error!', resData.status);
        }
      } catch (error) {
        console.log(error);
        //Hide preLoader
        setState({...state, showPreloader: false});
        Alert.alert('Error!', 'Something went wrong');
      }
    }
  };
  return (
    <SafeAreaView style={globalStyles.safeAreaView}>
      <PreLoader visible={state.showPreloader} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 20}}>
        {/* Logo container */}
        <View style={authStyles.logoContainer}>
          <Image source={LOGO} style={globalStyles.logo} />
        </View>

        {/* Text and input container */}
        <View
          style={{
            alignItems: 'center',
            marginBottom: 40,
          }}>
          <Text style={authStyles.title}>Tow Driver App</Text>
          <Text style={authStyles.text}>
            Enter your Watchout Registered vehicle license plate number to login
          </Text>
          {/* Input container */}
          <View style={{flexDirection: 'row', marginTop: 60, marginBottom: 20}}>
            <View style={authStyles.inputConatiner}>
              <Input
                placeholder="Vehicle Plate Number"
                onChangeText={value =>
                  setState({...state, plate_number: value})
                }
              />
            </View>
          </View>
          <Button block onPress={signInUser}>
            <Text>CONTINUE</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignInScreen;
