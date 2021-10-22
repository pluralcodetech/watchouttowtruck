import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import {Button, Text, ListItem, Left, Icon, Body} from 'native-base';
import {useSelector} from 'react-redux';
import {PRIMARY_COLOR, LIGHT} from '../../styles/colors';
import {logoutUser} from '../../logics/auth/Auth/auth';
import MessageModal from '../components/modals/MessageModal';

const MyAccount = ({navigation}) => {
  const {loggedIn, data} = useSelector((state) => state.userData);
  const [messageModal, showMessageModal] = React.useState(false);

  return (
    <SafeAreaView>
      {/* message modal */}
      <MessageModal
        showModal={showMessageModal}
        visible={messageModal}
        title="Bank Details"
        component={
          <View style={{width: '100%'}}>
            <Text style={{fontWeight: 'bold'}}>
              TRANFER TO THE ACCOUNT BELOW
            </Text>
            <View style={{flexDirection: 'row', marginTop: 5}}>
              <Text style={{fontWeight: 'bold'}}>Bank Name:</Text>
              <Text style={{width: '70%'}}>{data.funding_bank_name}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
              }}>
              <Text style={{fontWeight: 'bold'}}>Account Name:</Text>
              <Text style={{width: '70%'}}>{data.funding_acct_name}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
              }}>
              <Text style={{fontWeight: 'bold'}}>Account Number:</Text>
              <Text style={{width: '70%'}}>{data.funding_acct_no}</Text>
            </View>
            <Button
              block
              style={{marginTop: 15}}
              onPress={() => showMessageModal(false)}>
              <Text>OK</Text>
            </Button>
          </View>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.header}>
          <View style={style.image}>
            <Image
              style={{height: 70, width: 70}}
              source={require('../../assets/user.png')}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={style.text}>
              {loggedIn && data.first_name + '  ' + data.last_name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                E-WALLET:
              </Text>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>
                {loggedIn && data.balance}NGN
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                USER ID:
              </Text>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 14}}>
                {loggedIn && data.id}
              </Text>
            </View>
          </View>
        </View>
        <View style={style.headerButtonContainer}>
          <View style={{flex: 1, marginHorizontal: 10}}>
            <Button
              block
              small
              onPress={() => navigation.navigate('ShopMartCartScreen')}>
              <Text>MyCart</Text>
            </Button>
          </View>
          <View style={{flex: 1, marginHorizontal: 10}}>
            <Button light small block onPress={() => showMessageModal(true)}>
              <Text>Fund Account</Text>
            </Button>
          </View>
        </View>
        <View style={{marginTop: 20, marginRight: 20}}>
          <ListItem
            button
            onPress={() => navigation.navigate('SavedScreen')}
            icon
            style={{marginTop: 5}}>
            <Left>
              <Icon
                type="MaterialIcons"
                name="favorite"
                style={{fontSize: 20}}
              />
            </Left>
            <Body>
              <Text>Saved Items</Text>
            </Body>
          </ListItem>
          <ListItem
            button
            onPress={() => navigation.navigate('OrderHistoryScreen')}
            icon
            style={{marginTop: 5}}>
            <Left>
              <Icon type="MaterialIcons" name="event" style={{fontSize: 20}} />
            </Left>
            <Body>
              <Text>Order History</Text>
            </Body>
          </ListItem>
          <ListItem
            button
            onPress={() => navigation.navigate('Service')}
            icon
            style={{marginTop: 5}}>
            <Left>
              <Icon
                type="MaterialIcons"
                name="lightbulb-outline"
                style={{fontSize: 20}}
              />
            </Left>
            <Body>
              <Text>Airtime & Bill</Text>
            </Body>
          </ListItem>
          <ListItem
            button
            icon
            style={{marginTop: 5}}
            onPress={() => navigation.navigate('RewardScreen')}>
            <Left>
              <Icon
                type="MaterialIcons"
                name="attach-money"
                style={{fontSize: 20}}
              />
            </Left>
            <Body>
              <Text>My Reward Bonus</Text>
            </Body>
          </ListItem>

          <ListItem
            button
            onPress={() => navigation.navigate('InviteScreen')}
            icon
            style={{marginTop: 5}}>
            <Left>
              <Icon type="MaterialIcons" name="share" style={{fontSize: 20}} />
            </Left>
            <Body>
              <Text>Refer and Earn</Text>
            </Body>
          </ListItem>

          <ListItem
            button
            icon
            style={{marginTop: 5}}
            onPress={() => navigation.navigate('UpdateProfileScreen')}>
            <Left>
              <Icon type="MaterialIcons" name="person" style={{fontSize: 20}} />
            </Left>
            <Body>
              <Text>Update Profile</Text>
            </Body>
          </ListItem>

          <ListItem
            button
            icon
            style={{marginTop: 5}}
            onPress={() => navigation.navigate('UpdatePasswordScreen')}>
            <Left>
              <Icon type="MaterialIcons" name="lock" style={{fontSize: 20}} />
            </Left>
            <Body>
              <Text>Change Password</Text>
            </Body>
          </ListItem>
          <ListItem
            icon
            style={{marginTop: 5}}
            button
            onPress={() => logoutUser()}>
            <Left>
              <Icon
                type="MaterialIcons"
                name="exit-to-app"
                style={{fontSize: 20}}
              />
            </Left>
            <Body>
              <Text>Logout</Text>
            </Body>
          </ListItem>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  header: {
    height: 200,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  text: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 20,
    color: LIGHT,
  },
  image: {
    marginVertical: 10,
  },

  headerButtonContainer: {
    marginVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
export default MyAccount;
