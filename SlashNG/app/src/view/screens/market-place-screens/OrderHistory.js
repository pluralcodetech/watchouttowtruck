import React from 'react';
import {SafeAreaView, StyleSheet, FlatList} from 'react-native';

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
import axios from 'axios';
import qs from 'query-string';
import {useSelector} from 'react-redux';
import {PRIMARY_COLOR} from '../../../styles/colors';
import {FormatNumber} from '../../../logics';
import ScreenLoader from '../../components/Loaders/ScreenLoader';
import {SHOP_MART_API} from '../../../const/api';

const OrderHistoryScreen = ({navigation, route}) => {
  const {data} = useSelector((state) => state.userData);
  const [state, setState] = React.useState({
    user: data.id,
    token: data.token,
    loading: true,
    orders: [],
  });

  React.useEffect(() => {
    getOrderHistory();
  }, []);
  const getOrderHistory = async () => {
    //send request to server
    try {
      const res = await axios({
        url: SHOP_MART_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'fetch',
          type: 'order-history',
          ...state,
        }),
      });

      let resData = res.data;

      if (resData.status == 200) {
        //set orders and close loading screen
        setState({...state, orders: resData.orders, loading: false});
      } else {
        setState({...state, loading: false});
      }
    } catch (error) {
      setTimeout(getOrderHistory, 5000);
    }
  };

  const OrderList = ({order}) => {
    return (
      <List style={{marginHorizontal: 20}}>
        <ListItem
          button
          onPress={() =>
            navigation.navigate('OrderDetailsScreen', {
              id: order.reference,
            })
          }>
          <Body style={{marginLeft: -10}}>
            <View
              style={{
                alignItems: 'flex-start',
              }}>
              <Text style={{fontSize: 12, color: '#666'}}>
                Id:{order.reference}
              </Text>
              <Text style={{fontSize: 12, color: '#666'}}>
                Amount:NGN{FormatNumber(order.total_amt)}
              </Text>
              <Text style={{fontSize: 12, color: '#666'}}>
                Date:{order.date}
              </Text>
            </View>
          </Body>
          <Right>
            <View>
              <Text style={{fontSize: 11, color: '#666', fontWeight: 'bold'}}>
                Status:{order.status}
              </Text>
              <View
                style={{
                  backgroundColor: PRIMARY_COLOR,
                  marginTop: 5,
                  borderRadius: 2,
                  alignItems: 'center',
                  paddingVertical: 4,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}>
                  Details
                </Text>
              </View>
            </View>
          </Right>
        </ListItem>
      </List>
    );
  };

  return (
    <Root>
      <ScreenLoader loading={state.loading} />
      <SafeAreaView>
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Order History</Title>
          </Body>
          <Right></Right>
        </Header>
        {!state.loading && state.orders.length == 0 && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Text>No History Found</Text>
          </View>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
          data={state.orders}
          renderItem={({item}) => <OrderList order={item} />}
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

export default OrderHistoryScreen;
