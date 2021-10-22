import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Text, Icon, ListItem, Left, Body, Right} from 'native-base';
import {useSelector, useDispatch} from 'react-redux';
import {authUser, logoutUser} from '../../../logics/auth/auth';
import {PRIMARY_COLOR, SECONDARY_COLOR, LIGHT} from '../../../styles/colors';
import styles from '../../../styles';

const MyAccount = (navigation) => {
  return (
    <View style={{marginTop: 20, marginRight: 20}}>
      <ListItem icon style={{marginTop: 5}}>
        <Left>
          <Icon name="person" style={{fontSize: 20}} />
        </Left>
        <Body>
          <Text>Overview</Text>
        </Body>
      </ListItem>
      <ListItem icon style={{marginTop: 5}}>
        <Left>
          <Icon type="MaterialIcons" name="favorite" style={{fontSize: 20}} />
        </Left>
        <Body>
          <Text>My Favourite</Text>
        </Body>
      </ListItem>
      <ListItem icon style={{marginTop: 5}}>
        <Left>
          <Icon type="MaterialIcons" name="event" style={{fontSize: 20}} />
        </Left>
        <Body>
          <Text>Order History</Text>
        </Body>
      </ListItem>
      <ListItem icon style={{marginTop: 5}}>
        <Left>
          <Icon type="MaterialIcons" name="check" style={{fontSize: 20}} />
        </Left>
        <Body>
          <Text>Verification</Text>
        </Body>
      </ListItem>
      <ListItem
        icon
        style={{marginTop: 5}}
        button={true}
        onPress={() => console.log(22)}>
        <Left>
          <Icon type="MaterialIcons" name="lock" style={{fontSize: 20}} />
        </Left>
        <Body>
          <Text>Stettings</Text>
        </Body>
      </ListItem>

      <ListItem icon style={{marginTop: 5}} button onPress={() => logoutUser()}>
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
  );
};

export default MyAccount;
