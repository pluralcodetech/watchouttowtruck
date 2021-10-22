import React from 'react';
import {SafeAreaView, ScrollView, View, StyleSheet, Image} from 'react-native';
import {Container, Button, Text, Header, Item, Icon, Input} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import {authUser} from '../../../logics/auth/auth';
import {PRIMARY_COLOR, SECONDARY_COLOR, LIGHT} from '../../../styles/colors';
import MyAccountView from '../../components/accounts-components/MyAccount';
import SellPortalView from '../../components/accounts-components/SellerPortal';
import styles from '../../../styles';
import {userDataAction} from '../../../redux/actions';
import {useFocusEffect} from '@react-navigation/native';

const MyAccount = ({navigation, route}) => {
  const {loggedIn, data} = useSelector((state) => state.userData);
  navigation.addListener('focus', async () => {});
  const [view, changeView] = React.useState('my-account');
  React.useEffect(() => {
    // authUser(navigation, route);
  });
  useFocusEffect(() => {
    authUser(navigation, route);
  });
  const dispatch = useDispatch();

  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.header}>
          <View style={style.image}>
            <Image
              style={{height: 70, width: 70}}
              source={require('../../../assets/user.png')}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={style.text}>
              {loggedIn ? data.first_name + '  ' + data.last_name : null}
            </Text>
            <Text style={style.text}>{loggedIn ? data.phone : ''}</Text>
          </View>
        </View>
        <View style={style.headerButtonContainer}>
          <View style={{flex: 1, marginHorizontal: 10}}>
            <Button
              block
              small
              light={view == 'my-account' ? false : true}
              onPress={() => changeView('my-account')}>
              <Text>My Account</Text>
            </Button>
          </View>
          <View style={{flex: 1, marginHorizontal: 10}}>
            <Button
              small
              block
              light={view == 'seller-portal' ? false : true}
              onPress={() => changeView('seller-portal')}>
              <Text>Seller Portal</Text>
            </Button>
          </View>
        </View>
        <View>
          {view == 'my-account' ? (
            <MyAccountView navigation={navigation} />
          ) : (
            <SellPortalView />
          )}
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
