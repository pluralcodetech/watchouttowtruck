import React from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {
  Header,
  Text,
  Input,
  Icon,
  Right,
  Badge,
  Body,
  Title,
  Left,
  Button,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {LIGHT, SECONDARY_COLOR} from '../../../styles/colors';

const ShopMartHeader = ({title = '', logo, home = true}) => {
  const cart = useSelector(state => state.userCart);
  const navigation = useNavigation();
  return (
    <View>
      {/* Header */}
      <Header noShadow style={logo ? {paddingLeft: 0} : null}>
        {/* show logo  if logo is true*/}
        {logo ? (
          <Left>
            <Image
              style={{height: 60, width: 150}}
              source={require('../../../assets/Slashmart-white-logo.png')}
            />
          </Left>
        ) : null}
        {/* Only show the left when there is a title */}
        {title != '' ? (
          <Left>
            <Button transparent onPress={navigation.goBack}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
        ) : null}

        <Body>
          <Title>{title}</Title>
        </Body>
        <Right>
          {home && (
            <TouchableOpacity>
              <View style={{marginHorizontal: 5, alignItems: 'center'}}>
                <Icon
                  type="MaterialIcons"
                  name="home"
                  style={{
                    color: 'white',
                  }}
                />
                <Text style={{fontSize: 7, fontWeight: 'bold', color: 'white'}}>
                  HOME
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* show saved items icon in home screen */}
          {!home && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('SavedScreen')}>
              <View
                style={{
                  alignItems: 'center',
                  marginHorizontal: 5,
                }}>
                <Icon
                  type="MaterialIcons"
                  name="favorite"
                  style={{color: 'white'}}
                />
                <Text style={{fontSize: 7, fontWeight: 'bold', color: 'white'}}>
                  SAVED ITEM
                </Text>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ShopMartCartScreen')}>
            <View
              style={{
                alignItems: 'center',
                marginHorizontal: 5,
              }}>
              {cart.totalQuantity > 0 ? (
                <View style={style.badge}>
                  <Text
                    style={{fontSize: 8, color: '#fff', fontWeight: 'bold'}}>
                    {cart.totalQuantity}
                  </Text>
                </View>
              ) : null}
              <Icon
                type="MaterialIcons"
                name="shopping-cart"
                style={{color: 'white'}}
              />
              <Text style={{fontSize: 7, fontWeight: 'bold', color: 'white'}}>
                MY CART
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Profile')}>
            <View style={{alignItems: 'center', marginHorizontal: 5}}>
              <Icon
                type="MaterialIcons"
                name="person"
                style={{color: 'white'}}
              />
              <Text style={{fontSize: 7, fontWeight: 'bold', color: 'white'}}>
                ACCOUNT
              </Text>
            </View>
          </TouchableOpacity>
        </Right>
      </Header>
    </View>
  );
};

const style = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -8,
    left: 10,
    zIndex: 10,
    justifyContent: 'center',
    backgroundColor: SECONDARY_COLOR,
    alignItems: 'center',
    padding: 5,
    borderRadius: 15,
    minWidth: 20,
  },
  inputContainer: {
    marginVertical: 15,
    marginHorizontal: 15,
    paddingLeft: 10,
    flexDirection: 'row',
    backgroundColor: LIGHT,
    alignItems: 'center',
  },
  inputButton: {
    width: 50,
    height: 45,
    backgroundColor: SECONDARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ShopMartHeader;
