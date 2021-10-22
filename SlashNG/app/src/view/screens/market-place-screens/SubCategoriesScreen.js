import React from 'react';
import {SafeAreaView, FlatList} from 'react-native';
import {
  Header,
  Title,
  Button,
  Left,
  Body,
  Icon,
  Right,
  ListItem,
  Text,
  List,
  View,
} from 'native-base';

const SubCategoriesScreen = ({navigation, route}) => {
  const [renderPage, setRenderPage] = React.useState(false);

  React.useEffect(() => {
    //set the virable to true if there is data avalible in params
    if (route.params) {
      setRenderPage(true);
    }
  });

  //render empty page the renderPage is false
  if (!renderPage) return <></>;
  const subcatergories = route.params.data;
  const {categoryName} = route.params;

  return (
    <SafeAreaView>
      <Header noShadow>
        <Left>
          <Button transparent onPress={navigation.goBack}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>{categoryName.toUpperCase()}</Title>
        </Body>
        <Right></Right>
      </Header>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={subcatergories}
        ListFooterComponent={<View style={{height: 90}}></View>}
        renderItem={({item}) => {
          return (
            <ListItem
              button
              onPress={() => {
                navigation.navigate('shopMartProductsScreen', {
                  categoryName: item.name,
                  categoryId: item.id,
                });
              }}>
              <View>
                <Text style={{fontWeight: '600'}}>{item.name}</Text>
                <Text style={{marginTop: 2, fontSize: 14, color: 'grey'}}>
                  Items({item.no_of_items})
                </Text>
              </View>
            </ListItem>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default SubCategoriesScreen;
