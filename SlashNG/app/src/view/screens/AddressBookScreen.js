import React from 'react';
import {SafeAreaView, FlatList, Alert} from 'react-native';

import {
  Header,
  Left,
  Icon,
  Button,
  Body,
  Title,
  Right,
  Text,
  Root,
  List,
  ListItem,
  View,
} from 'native-base';
import axios from 'axios';
import qs from 'query-string';
import {useSelector} from 'react-redux';
import ScreenLoader from '../components/Loaders/ScreenLoader';
import {API} from '../../const/api';
import PreLoader from '../components/modals/PreLoader';
import {useIsFocused} from '@react-navigation/native';

const AddressBookScreen = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const {addContact} = route.params;
  const {data} = useSelector((state) => state.userData);
  const [state, setState] = React.useState({
    user: data.id,
    token: data.token,
    loading: true,
    contacts: [],
    showPreloader: false,
  });

  React.useEffect(() => {
    getAddress();
  }, [isFocused]);

  const getAddress = async () => {
    setState({...state, loading: true, contacts: []});
    //send request to server
    try {
      const res = await axios({
        url: API + '/account/',
        method: 'POST',
        data: qs.stringify({
          cmd: 'fetch',
          type: 'contact',
          ...state,
        }),
      });

      let resData = res.data;

      if (resData.status == 200) {
        //set orders and close loading screen
        setState({...state, contacts: resData.contacts, loading: false});
      } else {
        setState({...state, loading: false});
      }
    } catch (error) {
      setTimeout(getAddress, 5000);
    }
  };

  //delete address from contact
  const deleteAddress = async (id, index) => {
    Alert.alert(
      'Confirm',
      'Delete Address',
      [
        {
          text: 'Yes',
          onPress: async () => {
            setState({...state, showPreloader: true});
            //send request to server
            try {
              const res = await axios({
                url: API + '/account/',
                method: 'POST',
                data: qs.stringify({
                  cmd: 'delete-contact',
                  type: 'contact',
                  contact_id: id,
                  user: state.user,
                  token: state.token,
                }),
              });

              let resData = res.data;

              if (resData.status == 200) {
                //update the array
                const newContacts = state.contacts;
                newContacts.splice(index, 1);

                //set orders and close loading screen
                setState({
                  ...state,
                  showPreloader: false,
                  contacts: newContacts,
                });
              } else {
                setState({...state, showPreloader: false});
                //show error alert
                Alert.alert(
                  'Error',
                  'Something went wrong',
                  [
                    {
                      text: 'Cancel',
                    },
                    {text: 'OK'},
                  ],
                  {cancelable: false},
                );
              }
            } catch (error) {
              //show error alert
              Alert.alert(
                'Error',
                'Something went wrong',
                [
                  {
                    text: 'Cancel',
                  },
                  {text: 'OK'},
                ],
                {cancelable: false},
              );
            }
          },
        },
        {
          text: 'No',
        },
      ],
      {cancelable: false},
    );
  };
  //contact list component
  const ContactList = ({contact, index}) => {
    return (
      <List style={{marginHorizontal: 20}}>
        <ListItem
          button
          onPress={() => {
            addContact({
              receiver_fname: contact.first_name,
              receiver_lname: contact.last_name,
              receiver_email: contact.email,
              receiver_phone: contact.phone,
              dropoff_state: contact.state,
              dropoff_address: contact.address,
              dropoff_area: contact.city,
              stateId: contact.state_id,
            });
            navigation.goBack();
          }}>
          <Body style={{marginLeft: -10}}>
            <View
              style={{
                alignItems: 'flex-start',
              }}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                {contact.first_name} {contact.last_name}
              </Text>
              <Text style={{fontSize: 13, color: '#666'}}>
                {contact.address}, {contact.city} {contact.state}
              </Text>
              <Text style={{fontSize: 13, color: '#666'}}>Nigeria</Text>
            </View>
          </Body>

          <Right style={{height: 50}}>
            <Button
              transparent
              onPress={() => deleteAddress(contact.id, index)}
              style={{height: '100%'}}>
              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  height: '100%',
                  width: 50,
                }}>
                <Icon name="trash" style={{fontSize: 20, color: 'red'}} />
              </View>
            </Button>
          </Right>
        </ListItem>
      </List>
    );
  };

  return (
    <Root>
      <ScreenLoader loading={state.loading} />
      <PreLoader visible={state.showPreloader} />
      <SafeAreaView>
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Address Book</Title>
          </Body>
          <Right></Right>
        </Header>
        {!state.loading && state.contacts.length == 0 && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Text>No Address Found</Text>
          </View>
        )}

        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            marginBottom: 20,
          }}>
          <Button
            small
            block
            style={{width: 160, marginTop: 20}}
            onPress={() => navigation.navigate('AddNewAddressScreen')}>
            <Text style={{fontSize: 12, fontWeight: 'bold'}}>
              Add A New Address
            </Text>
          </Button>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 150}}
          data={state.contacts}
          renderItem={({item, index}) => (
            <ContactList contact={item} index={index} />
          )}
        />
      </SafeAreaView>
    </Root>
  );
};

export default AddressBookScreen;
