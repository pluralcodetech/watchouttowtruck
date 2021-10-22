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
import ScreenLoader from '../components/Loaders/ScreenLoader';

const AddNewAddressScreen = ({navigation, route}) => {
  React.useEffect(() => {
    fetchDeliveryState();
  }, []);
  const {data} = useSelector((state) => state.userData);
  const [state, setState] = React.useState({
    cmd: 'add-contact',
    deliveryState: [],
    token: data.token,
    user: data.id,
    email: '',
    fname: '',
    lname: '',
    phone: '',
    state: '',
    city: '',
    address: '',
    state_id: '',
    showPreloader: false,
    loading: true,
  });

  const saveAddress = async () => {
    //validate user data
    if (state.fname.trim() == '') {
      Toast.show({
        text: 'Please input first name',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.lname.trim() == '') {
      Toast.show({
        text: 'Please input last name',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.email.trim() == '') {
      Toast.show({
        text: 'Please input email',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.phone.trim() == '') {
      Toast.show({
        text: 'Please input phone no',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.state_id.trim() == '') {
      Toast.show({
        text: 'Please select state',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.city.trim() == '') {
      Toast.show({
        text: 'Please select area',
        type: 'danger',
        duration: 4000,
      });
    } else if (state.address.trim() == '') {
      Toast.show({
        text: 'Please input address',
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
          setState({
            ...state,
            fname: '',
            lname: '',
            email: '',
            phone: '',
            state_id: '',
            city: '',
            address: '',
            loading: false,
            showPreloader: false,
          });

          //show the user success message
          Alert.alert('Success', 'Address saved');
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

  const fetchDeliveryState = async () => {
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
          deliveryState: resData.states,
        });
      } else {
        //rerun funtion after 5sec
        setTimeout(fetchDeliveryState, 5000);
      }
    } catch (error) {
      setTimeout(fetchDeliveryState, 10000);
    }
  };

  const filterCities = () => {
    return state.deliveryState
      .filter((data) => data.state_id == state.state_id)[0]
      ?.cities.map((city, index) => (
        <Picker.Item label={city} value={city} key={index} />
      ));
  };
  return (
    <Root>
      <ScreenLoader loading={state.loading} />
      <PreLoader visible={state.showPreloader} />
      <SafeAreaView>
        <Header>
          <Left>
            <Button transparent onPress={navigation.goBack}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Address Book</Title>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingBottom: 80}}>
            <View style={style.container}>
              <Text style={{color: 'black', fontWeight: 'bold', fontSize: 22}}>
                Address Book
              </Text>
              <View>
                <Text style={style.inputLabel}>First Name</Text>
                <Item regular style={style.input}>
                  <Input
                    value={state.fname}
                    onChangeText={(value) => setState({...state, fname: value})}
                  />
                </Item>
              </View>
              <View>
                <Text style={style.inputLabel}>Last Name</Text>
                <Item regular style={style.input}>
                  <Input
                    value={state.lname}
                    onChangeText={(value) => setState({...state, lname: value})}
                  />
                </Item>
              </View>
              <View>
                <Text style={style.inputLabel}>Email</Text>
                <Item regular style={style.input}>
                  <Input
                    value={state.email}
                    onChangeText={(value) => setState({...state, email: value})}
                  />
                </Item>
              </View>
              <View>
                <Text style={style.inputLabel}>phone</Text>
                <Item regular style={style.input}>
                  <Input
                    value={state.phone}
                    onChangeText={(value) => setState({...state, phone: value})}
                  />
                </Item>
              </View>
              <View>
                <Text style={style.inputLabel}>State</Text>
                <Item regular style={style.input}>
                  <Picker
                    selectedValue={state.state_id}
                    onValueChange={(value) => {
                      setState({
                        ...state,
                        state_id: value,
                      });
                    }}>
                    <Picker.Item label="Choose State" value="" />
                    {state.deliveryState.map((data) => (
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
                <Text style={style.inputLabel}>Area</Text>
                <Item regular style={style.input}>
                  <Picker
                    selectedValue={state.city}
                    onValueChange={(value) => {
                      setState({
                        ...state,
                        city: value,
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
                    value={state.address}
                    autoCapitalize="none"
                    onChangeText={(value) =>
                      setState({...state, address: value})
                    }
                  />
                </Item>
              </View>
              <Button block style={{marginTop: 20}} onPress={saveAddress}>
                <Text>Save Address</Text>
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

export default AddNewAddressScreen;
