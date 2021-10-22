import React from 'react';
import {SafeAreaView, FlatList, View} from 'react-native';
import {Header, Title, Button, Left, Body, Icon, Right} from 'native-base';
import CategoriesCard from '../../components/shop-mart-components/CategoriesCard';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
        numColumns={2}
        data={subcatergories}
        ListFooterComponent={<View style={{height: 90}}></View>}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate('shopMartProductsScreen', {
                  categoryName: item.name,
                  categoryId: item.id,
                });
              }}>
              <CategoriesCard data={{category: item}} />
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default SubCategoriesScreen;
