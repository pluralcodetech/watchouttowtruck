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
import {VTU_API} from '../../const/api';
import PreLoader from '../components/modals/PreLoader';
import axios from 'axios';
import qs from 'query-string';
import {useSelector} from 'react-redux';
import {PRIMARY_COLOR} from '../../styles/colors';
import {FormatNumber} from '../../logics';
const TransactionDetailsScreen = ({navigation, route}) => {
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
            <Title>DETAILS</Title>
          </Body>
          <Right></Right>
        </Header>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingBottom: 80, marginTop: 10}}>
            {!state.data ? (
              <View
                style={{
                  marginHorizontal: 20,
                  alignItems: 'center',
                  marginTop: '50%',
                }}>
                <ActivityIndicator size="large" />
                <Text style={{marginBottom: 20}}>Loading...</Text>
              </View>
            ) : (
              <View>
                <Text
                  style={{
                    marginLeft: 15,
                    fontWeight: 'bold',
                    fontSize: 25,
                    marginTop: 10,
                    marginBottom: 20,
                  }}>
                  TopUp Confirmation
                </Text>
                <List>
                  <ListItem>
                    <View style={style.list}>
                      <View>
                        <Text style={style.title}>Transaction ID</Text>
                      </View>
                      <View style={{width: '60%'}}>
                        <Text>{state.data.reference}</Text>
                      </View>
                    </View>
                  </ListItem>
                  <ListItem>
                    <View style={style.list}>
                      <View>
                        <Text style={style.title}>Operator</Text>
                      </View>
                      <View style={{width: '60%'}}>
                        <Text>{state.data.operator}</Text>
                      </View>
                    </View>
                  </ListItem>
                  <ListItem>
                    <View style={style.list}>
                      <View>
                        <Text style={style.title}>Service</Text>
                      </View>
                      <View style={{width: '60%'}}>
                        <Text>{state.data.service}</Text>
                      </View>
                    </View>
                  </ListItem>
                  <ListItem>
                    <View style={style.list}>
                      <View>
                        <Text style={style.title}>Target</Text>
                      </View>
                      <View style={{width: '60%'}}>
                        <Text>{state.data.target}</Text>
                      </View>
                    </View>
                  </ListItem>
                  <ListItem>
                    <View style={style.list}>
                      <View>
                        <Text style={style.title}>Value</Text>
                      </View>
                      <View style={{width: '60%'}}>
                        <Text>NGN{FormatNumber(state.data.amount)}</Text>
                      </View>
                    </View>
                  </ListItem>
                  <ListItem>
                    <View style={style.list}>
                      <View>
                        <Text style={style.title}>Service Charge</Text>
                      </View>
                      <View style={{width: '60%'}}>
                        <Text></Text>
                      </View>
                    </View>
                  </ListItem>
                  <ListItem>
                    <View style={style.list}>
                      <View>
                        <Text style={style.title}>Total Amount</Text>
                      </View>
                      <View style={{width: '60%'}}>
                        <Text>NGN{FormatNumber(state.data.amount)}</Text>
                      </View>
                    </View>
                  </ListItem>

                  {state.data.token != '' && (
                    <ListItem>
                      <View style={style.list}>
                        <View>
                          <Text style={style.title}>Token</Text>
                        </View>
                        <View style={{width: '60%'}}>
                          <Text>{state.data.token}</Text>
                        </View>
                      </View>
                    </ListItem>
                  )}
                  <ListItem>
                    <View style={style.list}>
                      <View>
                        <Text style={style.title}>Status</Text>
                      </View>
                      <View style={{width: '60%'}}>
                        <Text>{state.data.status}</Text>
                      </View>
                    </View>
                  </ListItem>
                  <ListItem>
                    <View style={style.list}>
                      <View>
                        <Text style={style.title}>Date</Text>
                      </View>
                      <View style={{width: '60%'}}>
                        <Text>{state.data.date}</Text>
                      </View>
                    </View>
                  </ListItem>
                </List>
              </View>
            )}
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

export default TransactionDetailsScreen;
