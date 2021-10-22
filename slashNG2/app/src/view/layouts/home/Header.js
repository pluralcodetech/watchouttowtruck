import React from 'react';
import {View} from 'react-native';
import {Text, Header, Item, Icon, Input} from 'native-base';
import {PRIMARY_COLOR, SECONDARY_COLOR, LIGHT} from '../../../styles/colors';

const HomeHeader = () => {
  return (
    <Header
      style={{backgroundColor: PRIMARY_COLOR, paddingTop: 40, height: 200}}
      noShadow>
      <View style={{flex: 1}}>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 25, color: LIGHT, fontWeight: 'bold'}}>
            Open Marketplace In FCT Abuja
          </Text>
          <Text style={{fontSize: 15, marginTop: 14, color: LIGHT}}>
            Buy from Over 2000 verified sellers in FCT
          </Text>
        </View>

        <View
          style={{
            marginTop: 20,
            marginHorizontal: 5,
            paddingLeft: 10,
            flexDirection: 'row',
            backgroundColor: LIGHT,
          }}>
          <Input placeholder="Search for ads" />
          <View
            style={{
              width: 50,
              height: 50,
              backgroundColor: SECONDARY_COLOR,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="ios-search" style={{color: LIGHT}} />
          </View>
        </View>
      </View>
    </Header>
  );
};

export default HomeHeader;
