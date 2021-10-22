import React from 'react';
import {SafeAreaView, ScrollView, View, Alert} from 'react-native';
import {
  Container,
  Text,
  Input,
  Item,
  Label,
  Button,
  Toast,
  Root,
} from 'native-base';
import styles from '../../../styles';
import {API} from '../../../const/api';
import PreLoader from '../../components/modals/PreLoader';
import axios from 'axios';
import qs from 'query-string';
import {updateUserData} from '../../../logics/auth/auth';

const signInUser = async (data, setPreloader, navigation) => {
  //validate user
  if (data.email.trim() == '') {
    Toast.show({
      text: 'Please input email or phone',
      type: 'danger',
      duration: 4000,
    });
  } else if (data.password.trim() == '') {
    Toast.show({
      text: 'Please input password',
      type: 'danger',
      duration: 4000,
    });
  } else {
    //show modal
    setPreloader({showPreloader: true});
    //send request to server
    try {
      let res = await axios({
        url: API + '/account/',
        method: 'POST',
        data: qs.stringify({
          cmd: data.cmd,
          user_prop: data.email,
          user_pass: data.password,
        }),
      });

      let resData = res.data;
      if (resData.status == 200) {
        //close modal
        setPreloader({showPreloader: false});
        Alert.alert('Success', 'Login was succesful');
        let userData = {loggedIn: true, data: resData.message};
        //   dispatch to store and save data to users phone
        await updateUserData(userData);
        //navigate back
        navigation.goBack();
      } else {
        //hide modal
        setPreloader({showPreloader: false});
        //show an error message
        Alert.alert('Error', resData.message);
      }
    } catch (error) {
      //hide modal
      setPreloader({showPreloader: false});
      Alert.alert('Error', 'Something went wrong.');
    }
  }
};
const SignInScreen = ({navigation}) => {
  const [data, setData] = React.useState({
    email: '',
    password: '',
    cmd: 'auth',
    showPreloader: false,
  });
  const [preloader, setPreloader] = React.useState({
    showPreloader: false,
  });
  return (
    <Root>
      <PreLoader visible={preloader.showPreloader} />
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Container style={{padding: 20}}>
            <View style={{}}></View>
            <View style={{marginTop: 100}}>
              <View style={styles.input.body}>
                <Item floatingLabel>
                  <Label>Email Or Phone</Label>
                  <Input
                    placeholder="Username"
                    onChangeText={(value) => {
                      setData({...data, email: value});
                    }}
                  />
                </Item>
              </View>
              <View style={styles.input.body}>
                <Item floatingLabel>
                  <Label>Password</Label>
                  <Input
                    placeholder="Password"
                    autoCapitalize="none"
                    onChangeText={(value) => {
                      setData({...data, password: value});
                    }}
                    secureTextEntry
                  />
                </Item>
              </View>
            </View>

            <View style={{marginTop: 20}}>
              <Button
                full
                primary
                onPress={() => {
                  signInUser(data, setPreloader, navigation);
                }}>
                <Text>SIGNIN</Text>
              </Button>
            </View>
          </Container>
        </ScrollView>
      </SafeAreaView>
    </Root>
  );
};

export default SignInScreen;
