import React from 'react';
import {SafeAreaView, ScrollView, View, StyleSheet, Image} from 'react-native';
import {Button, Text, Icon} from 'native-base';
import {useSelector} from 'react-redux';
import {PRIMARY_COLOR, LIGHT} from '../../styles/colors';

const SuccessScreen = ({navigation, route}) => {
  const {loggedIn, data} = useSelector((state) => state.userData);
  const orderId = route.params;

  return (
    <SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 20}}>
        {/* <Header noShadow>
          <Left>
            <Button transparent onPress={navigation.goBack}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Checkout</Title>
          </Body>
          <Right></Right>
        </Header> */}
        <View>
          <View style={{alignItems: 'center', marginTop: 80}}>
            <Image
              source={require('../../assets/success.png')}
              style={{height: 100, width: 100}}
            />
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{marginTop: 20, fontSize: 22, fontWeight: 'bold'}}>
              Order Id:{orderId}
            </Text>
            <Text
              style={{
                marginTop: 10,
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 18,
              }}>
              You successfully created an order you will get a call from one of
              our shop representative team soon.Thank you
            </Text>
            <Button
              iconLeft
              bordered
              style={{marginTop: 20}}
              onPress={() => navigation.navigate('Home')}>
              <Icon name="home" />
              <Text style={{color: PRIMARY_COLOR}}>Home</Text>
            </Button>
          </View>
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
export default SuccessScreen;
