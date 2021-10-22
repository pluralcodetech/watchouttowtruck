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
  Picker,
} from 'native-base';
import {API, SHOP_MART_API} from '../../const/api';
import PreLoader from '../components/modals/PreLoader';
import axios from 'axios';
import qs from 'query-string';
import {useSelector} from 'react-redux';
import {updateUserData} from '../../logics/auth/Auth/auth';

const UpdateProfileScreen = ({navigation}) => {
  React.useEffect(() => {
    fetchState();
  }, []);
  const {data} = useSelector((state) => state.userData);

  const [state, setState] = React.useState({
    cmd: 'update',
    utype: 'profile',
    token: data.token,
    user: data.id,
    uemail: data.email,
    uphone: data.phone,
    uaddress: data.address,
    ucountry: data.country,
    ustate: data.state,
    stateName: '',
    ucity: data.city,
    showPreloader: false,
    states: [],
    stateId: '',
  });

  const getStateName = (id) => {
    return state.states.filter((data) => data.state_id == id)[0]?.name;
  };

  const updateProfile = async () => {
    const stateName = getStateName(data.state);
    //validate user data
    if (state.uemail.trim() == '') {
      Toast.show({
        text: 'Please input email',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.uphone.trim() == '') {
      Toast.show({
        text: 'Please input phone number',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.ucountry.trim() == '' || state.ucountry.trim() == 'n/a') {
      Toast.show({
        text: 'Please select country',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.ustate.trim() == '') {
      Toast.show({
        text: 'Please select state',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.ucity.trim() == '') {
      Toast.show({
        text: 'Please select city',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.uaddress.trim() == '') {
      Toast.show({
        text: 'Please input address',
        type: 'danger',
        duration: 4000,
      });
    } else {
      //register the user
      setState({...state, showPreloader: true});
      console.log({...state, ustate: stateName});
      //send request to server
      try {
        let res = await axios({
          url: API + '/account/',
          method: 'POST',
          data: qs.stringify({...state, ustate: stateName}),
        });

        let resData = res.data;

        if (resData.status == 200) {
          //close modal
          setState({...state, showPreloader: false});
          //dispatch and save the new data
          let userData = {
            loggedIn: true,
            data: {
              ...data,
              email: state.uemail,
              phone: state.uphone,
              country: state.ucountry,
              state: state.ustate,
              city: state.ucity,
              address: state.uaddress,
            },
          };

          // dispatch to store and save data to users phone
          await updateUserData(userData);

          //show the user success message
          Alert.alert('Success', 'Update succesful');
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

  const filterCities = () => {
    return state.states
      .filter((data) => data.state_id == state.ustate)[0]
      ?.cities.map((city, index) => {
        return <Picker.Item label={city} value={city} key={index} />;
      });
  };

  const fetchState = async () => {
    //send request to server
    try {
      const res = await axios({
        url: SHOP_MART_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'fetch',
          type: 'delivery_states',
        }),
      });

      let resData = res.data;

      if (resData.status == 200) {
        //set state
        setState({
          ...state,
          loading: false,
          states: resData.states,
        });
      } else {
        //rerun funtion 5sec
        setTimeout(() => fetchState(), 5000);
      }
    } catch (error) {
      setTimeout(() => fetchState(), 10000);
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
            <Title>Profile</Title>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingBottom: 80}}>
            <View style={style.container}>
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 22}}>
                Update Profile
              </Text>
              <View>
                <Text style={style.inputLabel}>Email</Text>
                <Item regular style={style.input}>
                  <Input
                    disabled
                    defaultValue={data.email}
                    onChangeText={(value) =>
                      setState({...state, uemail: value})
                    }
                  />
                </Item>
              </View>
              <View>
                <Text style={style.inputLabel}>First Name</Text>
                <Item regular style={style.input}>
                  <Input disabled defaultValue={data.first_name} />
                </Item>
              </View>

              <View>
                <Text style={style.inputLabel}>Last Name</Text>
                <Item regular style={style.input}>
                  <Input disabled defaultValue={data.last_name} />
                </Item>
              </View>

              <View>
                <Text style={style.inputLabel}>Phone Number</Text>
                <Item regular style={style.input}>
                  <Input
                    defaultValue={data.phone}
                    keyboardType="numeric"
                    placeholder=""
                    onChangeText={(value) =>
                      setState({...state, uphone: value})
                    }
                  />
                </Item>
              </View>
              <View>
                <Text style={style.inputLabel}>Country</Text>
                <Item regular style={style.input}>
                  <Picker
                    note
                    mode="dropdown"
                    style={{color: 'black'}}
                    selectedValue={state.ucountry}
                    onValueChange={(value) =>
                      setState({...state, ucountry: value})
                    }>
                    <Picker.Item label="Nigeria" value="Nigeria" />
                  </Picker>
                </Item>
              </View>
              <View>
                <Text style={style.inputLabel}>State</Text>
                <Item regular style={style.input}>
                  <Picker
                    note
                    mode="dropdown"
                    style={{color: 'black'}}
                    selectedValue={state.ustate}
                    onValueChange={(value) => {
                      setState({...state, ustate: value});
                    }}>
                    <Picker.Item label="Choose State" value="" />
                    {state.states.map((data) => (
                      <Picker.Item
                        label={data.name}
                        value={data.state_id}
                        key={data.state_id}
                      />
                    ))}
                  </Picker>
                </Item>
              </View>
              <View>
                <Text style={style.inputLabel}>City</Text>
                <Item regular style={style.input}>
                  <Picker
                    selectedValue={state.ucity}
                    onValueChange={(value) => {
                      setState({
                        ...state,
                        ucity: value,
                      });
                    }}>
                    <Picker.Item label="Choose Area" value="" />
                    {filterCities()}
                  </Picker>
                </Item>
              </View>
              <View>
                <Text style={style.inputLabel}>Address</Text>
                <Item regular style={style.input}>
                  <Input
                    defaultValue={data.address}
                    placeholder=""
                    onChangeText={(value) =>
                      setState({...state, uaddress: value})
                    }
                  />
                </Item>
              </View>

              <Button block style={{marginTop: 20}} onPress={updateProfile}>
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

export default UpdateProfileScreen;
