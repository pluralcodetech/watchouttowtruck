import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
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
import {LIGHT, SECONDARY_COLOR} from '../../../styles/colors';

const ShopMartHeader = ({
  searchInput = true,
  title = '',
  type = 'shop-mart',
}) => {
  const navigation = useNavigation();
  return (
    <View>
      {/* Header */}
      <Header noShadow>
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
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ShopMartCartScreen')}>
            <View
              style={{
                alignItems: 'center',
                marginHorizontal: 5,
              }}>
              <Badge style={style.badge}>
                <Text style={{fontSize: 10, fontWeight: 'bold'}}>10</Text>
              </Badge>
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
          <TouchableOpacity activeOpacity={0.7}>
            <View style={{alignItems: 'center', marginHorizontal: 5}}>
              <Icon
                type="MaterialIcons"
                name="favorite"
                style={{color: 'white'}}
              />
              <Text style={{fontSize: 7, fontWeight: 'bold', color: 'white'}}>
                SAVED ITEMS
              </Text>
            </View>
          </TouchableOpacity>
        </Right>
      </Header>

      {/* Header Input */}

      {searchInput ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('SearchScreen', {type})}>
          <View style={style.inputContainer}>
            <Input
              placeholder="Search on slash"
              style={{height: 45}}
              editable={false}
            />
            <View style={style.inputButton}>
              <Icon name="ios-search" style={{color: LIGHT}} />
            </View>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const style = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -8,
    left: 10,
    zIndex: 1,
    justifyContent: 'center',
    backgroundColor: SECONDARY_COLOR,
    height: 20,
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
