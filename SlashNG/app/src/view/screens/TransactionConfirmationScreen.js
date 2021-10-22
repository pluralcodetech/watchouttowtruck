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
  Text,
  Root,
  List,
  ListItem,
  View,
} from 'native-base';
import {VTU_API} from '../../const/api';
import PreLoader from '../components/modals/PreLoader';
import axios from 'axios';
import qs from 'query-string';
import {useSelector} from 'react-redux';
import {PRIMARY_COLOR} from '../../styles/colors';
const TransactionConfirmationScreen = ({navigation, route}) => {
  const {data} = useSelector((state) => state.userData);

  const [state, setState] = React.useState({
    tid: route.params.id,
    user: data.id,
    token: data.token,
    showPreloader: false,
    data: null,
  });

  React.useEffect(() => {
    getTransactionDetails();
  }, [0]);
  const getTransactionDetails = async () => {
    //send request to server
    try {
      const res = await axios({
        url: VTU_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'transaction',
          ...state,
        }),
      });

      let resData = res.data;
      console.log(resData);

      if (resData.status == 200) {
        setState({...state, data: resData.topup[0]});
        //close modal
        // setState({...state, showPreloader: false});
      } else {
        //rerun the function
      }
    } catch (error) {
      setTimeout(getTransactionDetails, 5000);
    }
  };
  return (
    <Root>
      <PreLoader visible={state.showPreloader} />
      <SafeAreaView>
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>CONFIRM DETAILS</Title>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingBottom: 80, marginTop: 10}}>
            <View>
              <Text
                style={{
                  marginLeft: 15,
                  fontWeight: 'bold',
                  fontSize: 25,
                  marginTop: 10,
                  marginBottom: 20,
                }}>
                Confirm Transaction
              </Text>
              <List>
                {route.params.data.map((e) => (
                  <ListItem key={Object.values(e)[0]}>
                    <View style={style.list}>
                      <View>
                        <Text style={style.title}>
                          {Object.keys(e)[0].toString().toUpperCase()}
                        </Text>
                      </View>
                      <View style={{width: '60%'}}>
                        <Text>
                          {Object.values(e)[0].toString().toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </ListItem>
                ))}
              </List>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Button
                  onPress={() => navigation.goBack()}
                  block
                  style={{width: '40%'}}
                  bordered>
                  <Text>BACK</Text>
                </Button>
                <Button
                  onPress={() => route.params.method(navigation)}
                  block
                  style={{width: '40%'}}>
                  <Text>PROCCED</Text>
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
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

export default TransactionConfirmationScreen;
