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
import {API} from '../../const/api';
import PreLoader from '../components/modals/PreLoader';
import axios from 'axios';
import qs from 'query-string';
import {useSelector} from 'react-redux';

const UpdatePasswordScreen = ({navigation}) => {
  const {data} = useSelector((state) => state.userData);
  const [state, setState] = React.useState({
    cmd: 'update',
    utype: 'password',
    token: data.token,
    user: data.id,
    cpassword: '',
    upassword: '',
    confirmPassword: '',
    showPreloader: false,
  });

  const updatePassword = async () => {
    //validate user data
    if (state.cpassword.trim() == '') {
      Toast.show({
        text: 'Please input old password',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.upassword.trim() == '') {
      Toast.show({
        text: 'Please input new password',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.upassword.trim() != state.confirmPassword.trim()) {
      Toast.show({
        text: 'Password does not match',
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

        if (resData.status == 200) {
          //close modal
          setState({...state, showPreloader: false});

          //show the user success message
          Alert.alert('Success', 'Password Updated');
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
            <Button transparent onPress={navigation.goBack}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Password</Title>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingBottom: 80}}>
            <View style={style.container}>
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 22}}>
                Update Password
              </Text>
              <View>
                <Text style={style.inputLabel}>Old Password</Text>
                <Item regular style={style.input}>
                  <Input
                    autoCapitalize="none"
                    secureTextEntry
                    onChangeText={(value) =>
                      setState({...state, cpassword: value})
                    }
                  />
                </Item>
              </View>
              <View>
                <Text style={style.inputLabel}>New Password</Text>
                <Item regular style={style.input}>
                  <Input
                    autoCapitalize="none"
                    secureTextEntry
                    onChangeText={(value) =>
                      setState({...state, upassword: value})
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
                    onChangeText={(value) =>
                      setState({...state, confirmPassword: value})
                    }
                  />
                </Item>
              </View>

              <Button block style={{marginTop: 20}} onPress={updatePassword}>
                <Text>Update</Text>
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

export default UpdatePasswordScreen;
