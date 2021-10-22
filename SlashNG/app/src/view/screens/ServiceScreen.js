import React from 'react';
import {
  ScrollView,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  Button,
  Text,
  Header,
  Icon,
  Title,
  Left,
  Body,
  Right,
  List,
  ListItem,
} from 'native-base';
import axios from 'axios';
import qs from 'query-string';
import {useSelector} from 'react-redux';
import {PRIMARY_COLOR} from '../../styles/colors';
import {VTU_API} from '../../const/api';
import Electricity from '../components/service-components/Electricity';
import Airtime from '../components/service-components/Airtime';
import Data from '../components/service-components/Data';
import Cable from '../components/service-components/Cable';
const screenWidth = Math.round(Dimensions.get('window').width);

const Service = ({navigation, route}) => {
  const {name: selectedServiceName, id: selectedServiceIndex} = route.params;
  const serviceList = ['Buy Airtime', 'Data Topup', 'Cable Tv', 'Electricity'];
  const {data} = useSelector(state => state.userData);

  const [state, setState] = React.useState({
    selectedServiceIndex,
    user: data.id,
    token: data.token,
    data: [],
    errorMessage: '',
    loaderIndicator: true,
    loderBox: true,
  });
  React.useEffect(() => {
    getTopUpHistory(state);
  }, []);

  //get transaction history each service
  const getTopUpHistory = async state => {
    let type = 'airtime';
    switch (state.selectedServiceIndex) {
      case 0:
        type = 'airtime';
        break;
      case 1:
        type = 'data';
        break;
      case 2:
        type = 'cable';
        break;
      case 3:
        type = 'electricity';
        break;
      default:
        type = 'airtime';
    }

    try {
      const res = await axios({
        url: VTU_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'transaction',
          ...state,
          type,
        }),
      });
      const resData = res.data;

      if (resData.status == '200') {
        setState({...state, data: resData.topup, loderBox: false});
      } else {
        setState({
          ...state,
          data: [],
          loaderIndicator: false,
          errorMessage: 'No transaction found',
        });
      }
    } catch (error) {
      //rerun function after 5s
      setTimeout(() => getTopUpHistory(state), 5000);
    }
  };

  //switch component base on the selected service
  const switchComponent = () => {
    switch (state.selectedServiceIndex) {
      case 0:
        return <Airtime navigation={navigation} />;
      case 1:
        return <Data navigation={navigation} />;
      case 2:
        return <Cable navigation={navigation} />;
      case 3:
        return <Electricity navigation={navigation} />;
    }
  };

  const renderTransactionHistory = () => {
    return (
      <View style={style.historyContainer}>
        <Text style={style.historyName}>{selectedServiceName} History</Text>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={state.data}
          renderItem={({item}) => {
            return (
              <List style={{marginHorizontal: 0}}>
                <ListItem
                  button
                  onPress={() =>
                    navigation.navigate('TransactionDetailsScreen', {
                      id: item.id,
                    })
                  }>
                  <Body style={{marginLeft: -10}}>
                    <View
                      style={{
                        alignItems: 'flex-start',
                      }}>
                      <Text style={{fontSize: 9, color: '#666'}}>
                        Date:{item.date}
                      </Text>
                      <Text style={{fontSize: 9, color: '#666'}}>
                        Amount:{item.amount}₦
                      </Text>
                      <Text style={{fontSize: 9, color: '#666'}}>
                        Des:{item.description}
                      </Text>
                    </View>
                  </Body>
                  <Right>
                    <View>
                      <Text style={{fontSize: 10, color: '#666'}}>
                        Status:{item.status}
                      </Text>
                      <View
                        style={{
                          backgroundColor: 'black',
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
                          View
                        </Text>
                      </View>
                    </View>
                  </Right>
                </ListItem>
              </List>
            );
          }}
        />
      </View>
    );
  };
  return (
    <SafeAreaView>
      <Header>
        <Left>
          <Button transparent onPress={navigation.goBack}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>{selectedServiceName}</Title>
        </Body>
        <Right></Right>
      </Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginBottom: 80}}>
          {switchComponent()}
          {renderTransactionHistory()}
          {/* showloader */}
          {state.loderBox ? (
            <View
              style={{
                backgroundColor: 'white',
                marginHorizontal: 20,
                alignItems: 'center',
              }}>
              {state.loaderIndicator ? (
                <ActivityIndicator size="small" />
              ) : null}
              <Text style={{marginBottom: 20}}>{state.errorMessage}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  tableTitle: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerView: {
    width: screenWidth / 4,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  btnSelected: {
    backgroundColor: PRIMARY_COLOR,
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 5,
    borderColor: PRIMARY_COLOR,
  },
  btn: {
    borderColor: PRIMARY_COLOR,
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 5,
  },

  name: {
    fontSize: 13,
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
  },
  nameSelected: {
    color: 'white',
  },
  historyContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 20,
  },

  historyName: {
    marginHorizontal: 20,
    fontWeight: 'bold',
  },
});

export default Service;
