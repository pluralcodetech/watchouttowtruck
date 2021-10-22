import React from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {Root, Text, Header, Icon, Input} from 'native-base';
import axios from 'axios';
import qs from 'query-string';
import {SHOP_MART_API} from '../../const/api';
import ShopMartProductCard from '../components/market-place-screens/ProductCard';
import ScreenLoader from '../components/Loaders/ScreenLoader';
import BottomLoader from '../components/Loaders/BottomLoader';

//get product by category id
const searchProducts = async (state, setState, reFetch) => {
  const page = state.page;
  //return if there is no product to fetch
  if (state.productsFinised) return;

  try {
    //only show loading screen and clear products when were fecthing the first time
    if (!reFetch) {
      setState({
        ...state,
        screenLoader: true,
        products: [],
      });
    } else if (state.products.length / (page - 1) > 9) {
      //show loader indicator only if last fetch is upto 1 page
      setState({...state, bottomLoader: true});
    }
    let res = await axios({
      url: SHOP_MART_API,
      method: 'POST',
      data: qs.stringify({
        page: state.page,
        cmd: 'fetch',
        type: 'products',
        query: state.searchText,
      }),
    });

    const resData = res.data;

    //set loading to false
    await setState({...state, screenLoader: false});
    if (resData.status == '200') {
      //clear error message if any and update products and page
      if (reFetch) {
        setState({
          ...state,
          errorMessage: '',
          bottomLoader: false,
          products: [...state.products, ...resData.products],
          page: page + 1,
        });
      } else {
        setState({
          ...state,
          errorMessage: '',
          products: resData.products,
          page: page + 1,
        });
      }
    } else {
      if (reFetch) {
        //set product finised to true
        setState({...state, productsFinised: true, errorMessage: '', page: 1});
      } else {
        //set error message
        setState({
          ...state,
          productsFinised: true,
          errorMessage: 'No Product Found.',
          page: 1,
        });
      }
    }
  } catch (error) {
    setState({...state, screenLoader: false});
    // //display error message
    Alert.alert('Error', 'Something went wrong.');
  }
};

const SearchScreen = ({navigation, route}) => {
  const {type} = route.params;
  const [state, setState] = React.useState({
    type,
    page: 1,
    products: [],
    productsFinised: false,
    screenLoader: false,
    bottomLoader: false,
    searchText: '',
    errorMessage: '',
  });

  React.useEffect(() => {
    //set loading to false and clear the search text
    setState({...state, screenLoader: false, bottomLoader: false});
  }, [route.params]);

  return (
    <Root>
      <ScreenLoader loading={state.screenLoader} />
      <SafeAreaView>
        <Header noShadow>
          <View style={style.body}>
            <TouchableOpacity activeOpacity={0.8} onPress={navigation.goBack}>
              <View style={style.iconContainer}>
                <Icon name="arrow-back" style={{color: '#fff', fontSize: 25}} />
              </View>
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: '#fff',
                flex: 1,
              }}>
              <Input
                placeholder="Search on slash"
                value={state.searchText}
                style={{paddingLeft: 10}}
                onChangeText={(text) => setState({...state, searchText: text})}
                returnKeyType="search"
                returnKeyLabel="Search"
                onSubmitEditing={() => {
                  //pass the state and also set productsFinised to false and products to empty array
                  searchProducts(
                    {...state, productsFinised: false, products: [], page: 1},
                    setState,
                    false,
                  );
                }}
              />
            </View>
          </View>
        </Header>

        <View>
          <FlatList
            showsVerticalScrollIndicator={false}
            onEndReached={() => {
              searchProducts(state, setState, true);
            }}
            onEndReachedThreshold={0.1}
            numColumns={2}
            data={state.products}
            renderItem={({item}) =>
              state.type == 'shop-mart' ? (
                <ShopMartProductCard product={item} />
              ) : null
            }
            ListFooterComponentStyle={{height: 150}}
            ListFooterComponent={() => {
              if (state.errorMessage != '') {
                return (
                  <View style={{flex: 1, alignItems: 'center', marginTop: 10}}>
                    <Text>{state.errorMessage}</Text>
                  </View>
                );
              } else {
                return state.bottomLoader ? <BottomLoader /> : null;
              }
            }}
          />
        </View>
      </SafeAreaView>
    </Root>
  );
};

const style = StyleSheet.create({
  body: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 7,
    alignItems: 'center',
  },
  iconContainer: {width: 35, marginLeft: 10},
});

export default SearchScreen;
