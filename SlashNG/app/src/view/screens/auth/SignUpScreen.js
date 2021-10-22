import React from 'react';
import {SafeAreaView, ScrollView, View, StyleSheet, Alert} from 'react-native';
import {
  Header,
  Left,
  Icon,
  Button,
  Body,
  Title,
  Right,
  Item,
  Input,
  Text,
  Toast,
  Root,
} from 'native-base';
import {API} from '../../../const/api';
import PreLoader from '../../components/modals/PreLoader';
import axios from 'axios';
import qs from 'query-string';

const SignUpScreen = () => {
  const [state, setState] = React.useState({
    cmd: 'create',
    reg_fname: '',
    reg_lname: '',
    reg_email: '',
    reg_phone: '',
    reg_pass: '',
    confirm_pass: '',
    showPreloader: false,
  });
  //sign up user
  const signUp = async () => {
    //validate user data
    if (state.reg_email.trim() == '') {
      Toast.show({
        text: 'Please input email',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.reg_fname.trim() == '') {
      Toast.show({
        text: 'Please input first name',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.reg_lname.trim() == '') {
      Toast.show({
        text: 'Please input last name',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.reg_phone.trim() == '') {
      Toast.show({
        text: 'Please input phone number',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.reg_pass.trim() == '') {
      Toast.show({
        text: 'Please input password',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.reg_pass.trim() != state.confirm_pass.trim()) {
      Toast.show({
        text: 'Password does not match please try again.',
        type: 'danger',
        duration: 4000,
      });
    } else {
      //register the user
      setState({...state, showPreloader: true});
      //send request to server
      try {
        let res = await axios({
          url: API + '/account/',
          method: 'POST',
          data: qs.stringify(state),
        });

        let resData = res.data;
        console.log(resData);
        if (resData.status == 200) {
          //close modal
          setState({showPreloader: false});
          //show the user success message
          Alert.alert(
            'Success',
            'Registration was succesful, You can now login.',
            [
              {
                text: 'Ok',
                onPress: () => navigation.goBack(),
              },
            ],
          );
          // //navigate back
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
        <Header>
          <Left>
            <Button transparent>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>SIGNUP</Title>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingBottom: 80}}>
            <View style={style.container}>
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 22}}>
                Create An Account
              </Text>
              <View>
                <Text style={style.inputLabel}>Email</Text>
                <Item regular style={style.input}>
                  <Input
                    placeholder=""
                    onChangeText={(value) =>
                      setState({...state, reg_email: value})
                    }
                  />
                </Item>
              </View>
              <View>
                <Text style={style.inputLabel}>First Name</Text>
                <Item regular style={style.input}>
                  <Input
                    placeholder=""
                    onChangeText={(value) =>
                      setState({...state, reg_fname: value})
                    }
                  />
                </Item>
              </View>

              <View>
                <Text style={style.inputLabel}>Last Name</Text>
                <Item regular style={style.input}>
                  <Input
                    placeholder=""
                    onChangeText={(value) =>
                      setState({...state, reg_lname: value})
                    }
                  />
                </Item>
              </View>

              <View>
                <Text style={style.inputLabel}>Phone Number</Text>
                <Item regular style={style.input}>
                  <Input
                    keyboardType="numeric"
                    placeholder=""
                    onChangeText={(value) =>
                      setState({...state, reg_phone: value})
                    }
                  />
                </Item>
              </View>

              <View>
                <Text style={style.inputLabel}>Password</Text>
                <Item regular style={style.input}>
                  <Input
                    autoCapitalize="none"
                    secureTextEntry
                    placeholder=""
                    onChangeText={(value) =>
                      setState({...state, reg_pass: value})
                    }
                  />
                </Item>
              </View>

              <View>
                <Text style={style.inputLabel}>Confirm Password</Text>
                <Item regular style={style.input}>
                  <Input
                    autoCapitalize="none"
                    secureTextEntry
                    placeholder=""
                    onChangeText={(value) =>
                      setState({...state, confirm_pass: value})
                    }
                  />
                </Item>
              </View>
              <Button onPress={signUp} block style={{marginTop: 20}}>
                <Text>Register</Text>
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

export default SignUpScreen;
