import React from 'react';
import {
  ScrollView,
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {
  Button,
  Text,
  Header,
  Icon,
  Title,
  Left,
  Body,
  Right,
  List,
  ListItem,
  Item,
} from 'native-base';
import {useSelector} from 'react-redux';
import {PRIMARY_COLOR} from '../../styles/colors';

const screenWidth = Math.round(Dimensions.get('window').width);

const ServiceListsScreen = ({navigation, route}) => {
  const serviceList = [
    {id: 0, name: 'Airtime Topup'},
    {id: 1, name: 'Data Topup'},
    {id: 2, name: 'Cable Tv'},
    {id: 3, name: 'Electricity'},
  ];

  return (
    <SafeAreaView>
      <Header>
        <Left>
          <Button transparent onPress={navigation.goBack}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>AIRTIME & BILLS</Title>
        </Body>
        <Right></Right>
      </Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        <List>
          {serviceList.map((item, index) => (
            <ListItem
              key={index}
              button
              onPress={() => navigation.navigate('ServiceScreen', item)}>
              <Text>{item.name}</Text>
            </ListItem>
          ))}
        </List>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  tableTitle: {
    color: 'grey',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerView: {
    width: screenWidth / 4,
    marginHorizontal: 5,
    marginVertical: 10,
  },
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  btnSelected: {
    backgroundColor: PRIMARY_COLOR,
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 5,
    borderColor: PRIMARY_COLOR,
  },
  btn: {
    borderColor: PRIMARY_COLOR,
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 5,
  },

  name: {
    fontSize: 13,
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
  },
  nameSelected: {
    color: 'white',
  },
  historyContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 20,
  },

  historyName: {
    marginHorizontal: 20,
    fontWeight: 'bold',
  },
});

export default ServiceListsScreen;
