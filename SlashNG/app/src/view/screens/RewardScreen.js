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
import {API} from '../../const/api';
import axios from 'axios';
import qs from 'query-string';
import {useSelector} from 'react-redux';
import {PRIMARY_COLOR} from '../../styles/colors';
import {FlatList} from 'react-native-gesture-handler';
import PreLoader from '../components/modals/PreLoader';
import ScreenLoader from '../components/Loaders/ScreenLoader';
import MessageModal from '../components/modals/MessageModal';
import {updateUserBalance} from '../../logics/auth/Auth/auth';
const RewardScreen = ({navigation, route}) => {
  const {data} = useSelector((state) => state.userData);
  const [state, setState] = React.useState({
    user: data.id,
    token: data.token,
    loading: true,
    balance: '',
    showPreloader: false,
    transactions: [],
  });
  const [messageModal, showMessageModal] = React.useState(false);

  React.useEffect(() => {
    getRewardHistory();
  }, []);

  const getRewardHistory = async () => {
    //send request to server
    try {
      const res = await axios({
        url: API + '/account/',
        method: 'POST',
        data: qs.stringify({
          cmd: 'fetch',
          type: 'reward_transaction',
          ...state,
        }),
      });

      let resData = res.data;

      if (resData.status == 200) {
        setState({
          ...state,
          transactions: resData.transaction,
          loading: false,
        });
      } else {
        setState({...state, loading: false});
      }
    } catch (error) {
      setTimeout(getTransactionDetails, 5000);
    }
  };

  const getReward = async () => {
    const rewardBalance = data.reward_balance.replace(',', '');
    //check input
    if (state.balance.trim() == '') {
      Alert.alert('Error', 'Please input amount');
    } else if (state.balance.trim() > rewardBalance.trim()) {
      Alert.alert('Error', 'Insufficient funds');
    } else {
      showMessageModal(false);
      setState({...state, showPreloader: true});

      //send request to server
      try {
        let res = await axios({
          url: API + '/account/',
          method: 'POST',
          data: qs.stringify({
            ...state,
            cmd: 'transfer_reward',
            amount: state.balance,
          }),
        });

        let resData = res.data;

        if (resData.status == 200) {
          //close modal
          setState({...state, showPreloader: false, balance: ''});

          //show the user success message
          Alert.alert('Success', resData.message);
          //update user balance
          updateUserBalance();
        } else {
          //hide modal
          setState({...state, showPreloader: false, balance: ''});
          //show an error message
          Alert.alert('Error', resData.message);
        }
      } catch (error) {
        //hide modal
        setState({...state, showPreloader: false, balance: ''});
        Alert.alert('Error', 'Something went wrong.');
      }
    }
  };

  const TransactionList = ({item}) => {
    return (
      <List style={{marginHorizontal: 20}}>
        <ListItem button>
          <Body style={{marginLeft: -10}}>
            <View
              style={{
                alignItems: 'flex-start',
              }}>
              <Text style={{fontSize: 13, color: '#666'}}>
                AMOUNT:NGN{item.amount}
              </Text>
              <Text style={{fontSize: 13, color: '#666'}}>
                BALANCE:NGN{item.amount}
              </Text>
              <Text style={{fontSize: 13, color: '#666'}}>
                DES:NGN{item.description}
              </Text>
            </View>
          </Body>
          <Right>
            <View
              style={{
                justifyContent: 'flex-start',
                flex: 1,
              }}>
              <Text style={{fontSize: 13, color: '#666', fontWeight: 'bold'}}>
                TYPE:{item.type}
              </Text>
            </View>
          </Right>
        </ListItem>
      </List>
    );
  };

  return (
    <Root>
      {/* message modal */}
      <MessageModal
        showModal={showMessageModal}
        visible={messageModal}
        title="AMOUNT"
        component={
          <View style={{width: '100%'}}>
            <View>
              <Text style={style.inputLabel}>Amount</Text>
              <Item regular style={style.input}>
                <Input
                  value={state.amount}
                  autoCapitalize="none"
                  keyboardType="numeric"
                  onChangeText={(value) => setState({...state, balance: value})}
                />
              </Item>
            </View>
            <Button
              block
              style={{marginTop: 15}}
              onPress={() => {
                getReward();
              }}>
              <Text>TRANSFER</Text>
            </Button>
          </View>
        }
      />
      <ScreenLoader loading={state.loading} />
      <SafeAreaView>
        <PreLoader visible={state.showPreloader} />
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>REWARD</Title>
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
          <Text style={{fontWeight: 'bold', fontSize: 25, marginTop: 20}}>
            NGN{data.reward_balance}
          </Text>
          <Button
            block
            style={{marginTop: 20}}
            onPress={() => {
              //reset balance
              setState({...state, balance: ''});
              showMessageModal(true);
            }}>
            <Text>GET REWARD</Text>
          </Button>
        </View>
        {!state.loading && state.transactions.length == 0 && (
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
          data={state.transactions}
          renderItem={({item}) => <TransactionList item={item} />}
        />
      </SafeAreaView>
    </Root>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    paddingBottom: 20,
    marginBottom: 100,
  },
  input: {marginTop: 2, height: 45},
  inputLabel: {
    marginTop: 15,
    marginLeft: 2,
    color: 'grey',
  },
});
export default RewardScreen;
