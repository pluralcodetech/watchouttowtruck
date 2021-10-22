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

const ResetPasswordScreen = ({navigation}) => {
  const [state, setState] = React.useState({
    cmd: 'forgot-password',
    user_email: '',
    showPreloader: false,
  });
  //sign up user
  const ResetPassword = async () => {
    //validate user data
    if (state.user_email.trim() == '') {
      Toast.show({
        text: 'Please input email',
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
          Alert.alert('Success', resData.message, [
            {
              text: 'Ok',
              onPress: () => navigation.goBack(),
            },
          ]);
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
            <Title>RESET PASSWORD</Title>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingBottom: 80}}>
            <View style={style.container}>
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 22}}>
                Reset Password
              </Text>
              <View>
                <Text style={style.inputLabel}>Email</Text>
                <Item regular style={style.input}>
                  <Input
                    placeholder=""
                    onChangeText={(value) =>
                      setState({...state, user_email: value})
                    }
                  />
                </Item>
              </View>
              <Button onPress={ResetPassword} block style={{marginTop: 20}}>
                <Text>Procced</Text>
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

export default ResetPasswordScreen;
