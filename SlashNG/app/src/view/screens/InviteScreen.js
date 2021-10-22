import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
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
  Root,
  List,
  ListItem,
  View,
} from 'native-base';
import Clipboard from '@react-native-community/clipboard';
import {API} from '../../const/api';
import axios from 'axios';
import qs from 'query-string';
import {useSelector} from 'react-redux';
import {PRIMARY_COLOR} from '../../styles/colors';
import {FlatList} from 'react-native-gesture-handler';
const InviteScreen = ({navigation, route}) => {
  const {data} = useSelector((state) => state.userData);
  const [state, setState] = React.useState({
    user: data.id,
    token: data.token,
    loading: true,
    data: [],
  });

  React.useEffect(() => {
    getDownlines();
  }, []);

  //copy user id to clip board
  const copyIdToClipBoard = () => {
    Clipboard.setString(data.id);
    Alert.alert('Success', 'Copied to clipboard');
  };
  const getDownlines = async () => {
    //send request to server
    try {
      const res = await axios({
        url: API + '/account/',
        method: 'POST',
        data: qs.stringify({
          cmd: 'fetch',
          type: 'downline',
          ...state,
        }),
      });

      let resData = res.data;

      if (resData.status == 200) {
        setState({...state, data: resData.downlines, loading: false});
      } else {
        setState({...state, loading: false});
      }
    } catch (error) {
      setTimeout(getTransactionDetails, 5000);
    }
  };
  return (
    <Root>
      <SafeAreaView>
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>INVITE FRIENDS</Title>
          </Body>
          <Right></Right>
        </Header>
        <View
          style={{
            marginTop: 20,
            justifyContent: 'center',
            marginHorizontal: 20,
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: 'bold'}}> REFERER ID:{data.id}</Text>
          <Button block style={{marginTop: 20}} onPress={copyIdToClipBoard}>
            <Text>COPY ID</Text>
          </Button>
        </View>
        <Text
          style={{
            marginVertical: 10,
            fontSize: 22,
            fontWeight: 'bold',
            marginHorizontal: 20,
          }}>
          Downlines
        </Text>
        {state.loading && (
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        )}
        {!state.loading && state.data.length == 0 && (
          <View style={{alignItems: 'center'}}>
            <Text>No downline was found</Text>
          </View>
        )}
        <FlatList
          contentContainerStyle={{marginBottom: 20, marginHorizontal: 10}}
          data={state.data}
          renderItem={({item}) => {
            console.log(item);
            return (
              <List>
                <ListItem>
                  <View>
                    <Text style={{fontWeight: 'bold'}}>
                      NAME: {item.first_name.toUpperCase()}
                      {item.last_name.toUpperCase()}
                    </Text>
                    <Text
                      style={{marginTop: 5, fontSize: 14, fontWeight: 'bold'}}>
                      REG DATE:{item.reg_date}
                    </Text>
                  </View>
                </ListItem>
              </List>
            );
          }}
        />
      </SafeAreaView>
    </Root>
  );
};

const style = StyleSheet.create({
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    fontWeight: 'bold',
  },
});

export default InviteScreen;
