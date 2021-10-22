import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import {Text, Input, Item, Label, Button, Toast, Root} from 'native-base';
import {API} from '../../../const/api';
import PreLoader from '../../components/modals/PreLoader';
import axios from 'axios';
import qs from 'query-string';
import {updateUserData} from '../../../logics/auth/Auth/auth';
import {PRIMARY_COLOR} from '../../../styles/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';

const SignInScreen = ({navigation}) => {
  const [state, setState] = React.useState({
    email: '',
    password: '',
    cmd: 'auth',
    showPreloader: false,
  });

  const signInUser = async () => {
    //validate user
    if (state.email.trim() == '') {
      Toast.show({
        text: 'Please input email or phone',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.password.trim() == '') {
      Toast.show({
        text: 'Please input password',
        type: 'danger',
        duration: 4000,
      });
    } else {
      //show modal
      setState({...state, showPreloader: true});
      //send request to server
      try {
        let res = await axios({
          url: API + '/account/',
          method: 'POST',
          data: qs.stringify({
            cmd: state.cmd,
            user_prop: state.email,
            user_pass: state.password,
          }),
        });

        let resData = res.data;
        if (resData.status == 200) {
          //close modal
          setState({...state, showPreloader: false});
          Alert.alert('Success', 'Login was succesful');

          let userData = {loggedIn: true, data: resData.message};
          //   dispatch to store and save data to users phone
          await updateUserData(userData);
          //navigate back
          navigation.goBack();
        } else {
          //hide modal
          setState({...state, showPreloader: false});
          //show an error message
          Alert.alert('Error', resData.message);
        }
      } catch (error) {
        //hide modal
        setState({...state, showPreloader: false});
        Alert.alert('Error', 'Something went wrong.');
      }
    }
  };
  return (
    <Root>
      <PreLoader visible={state.showPreloader} />
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{padding: 20}}>
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{height: 220, width: 220}}
                source={require('../../../assets/logo-icon.png')}
              />
            </View>

            <View style={{marginTop: -20}}>
              <View style={style.inputBody}>
                <Item floatingLabel>
                  <Label>Email Or Phone</Label>
                  <Input
                    placeholder="Username"
                    onChangeText={(value) => {
                      setState({...state, email: value});
                    }}
                  />
                </Item>
              </View>
              <View style={style.inputBody}>
                <Item floatingLabel>
                  <Label>Password</Label>
                  <Input
                    placeholder="Password"
                    autoCapitalize="none"
                    onChangeText={(value) => {
                      setState({...state, password: value});
                    }}
                    secureTextEntry
                  />
                </Item>
              </View>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ResetPasswordScreen')}>
                <Text style={{color: PRIMARY_COLOR}}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 20}}>
              <Button full primary onPress={signInUser}>
                <Text>SIGNIN</Text>
              </Button>
              <View
                style={{
                  marginTop: 25,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Text style={{color: 'grey'}}>Don`t have an account?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SignUpScreen')}>
                  <Text style={{color: PRIMARY_COLOR}}> Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Root>
  );
};

const style = StyleSheet.create({
  inputBody: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default SignInScreen;
