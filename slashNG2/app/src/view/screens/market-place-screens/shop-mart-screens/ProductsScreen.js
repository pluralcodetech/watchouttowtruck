import React from 'react';
import {BackHandler, SafeAreaView, FlatList, View} from 'react-native';
import {Root, Text} from 'native-base';
import axios from 'axios';
import qs from 'query-string';
import {SHOP_MART_API} from '../../../const/api';
import Header from '../../components/shop-mart-components/Header';
import ProductCard from '../../components/shop-mart-components/ProductCard';
import ScreenLoader from '../../components/Loaders/ScreenLoader';
import BottomLoader from '../../components/Loaders/BottomLoader';

//get product by category id
const getProducts = async (state, setState, reFetch) => {
  const page = state.page;
  //return if there is no product to fetch
  if (state.productsFinised) return;

  try {
    if (reFetch && state.products.length / (page - 1) > 9) {
      //show loader indicator only if last fetch is upto 1 page
      setState({...state, bottomLoader: true});
    }
    let res = await axios({
      url: SHOP_MART_API,
      method: 'POST',
      data: qs.stringify({
        page: page,
        cmd: 'fetch',
        type: 'products',
        category: state.categoryId,
      }),
    });

    const resData = res.data;
    if (resData.status == '200') {
      //clear error message if any and set products
      if (reFetch) {
        //reFetch is true so add products to existing products
        setState({
          ...state,
          products: [...state.products, ...resData.products],
          errorMessage: '',
          bottomLoader: false,
          page: page + 1,
        });
      } else {
        setState({
          ...state,
          products: resData.products,
          errorMessage: '',
          loading: false,
          page: page + 1,
        });
      }
    } else {
      //if reFetch is true hide bottom loader and set productFinished to true
      if (reFetch) {
        setState({
          ...state,
          errorMessage: '',
          bottomLoader: false,
          productsFinised: true,
        });
      } else {
        //set error message
        setState({...state, errorMessage: 'No Product Found.', loading: false});
      }
    }
  } catch (error) {
    //run the function again after some sec
    setTimeout(() => getProducts(state, setState, reFetch), 5000);
  }
};

const ProductsScreen = ({route}) => {
  const [state, setState] = React.useState({
    categoryId: '',
    page: 1,
    productsFinised: false,
    bottomLoader: false,
    products: [],
    loading: true,
    errorMessage: '',
  });

  const clearProduct = React.useCallback(() => {
    //only refresh when the array of products is empty
    if (state.products.length > 0) {
      setState({...state, products: []});
      BackHandler.removeEventListener('hardwareBackPress', clearProduct);
    }
  }, [route.params]);

  React.useEffect(() => {
    const {categoryId} = route.params;
    setState({...state, errorMessage: '', categoryId});
    BackHandler.addEventListener('hardwareBackPress', clearProduct);

    //get the products from server
    getProducts(
      {...state, errorMessage: '', categoryId, page: 1},
      setState,
      false,
    );
  }, [route.params]);

  return (
    <Root>
      <ScreenLoader loading={state.loading} />
      <SafeAreaView>
        <Header />
        <FlatList
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            getProducts(state, setState, true);
          }}
          onEndReachedThreshold={0.1}
          numColumns={2}
          data={state.products}
          ListFooterComponentStyle={{height: 170}}
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
          renderItem={({item}) => <ProductCard data={item} />}
        />
      </SafeAreaView>
    </Root>
  );
};

export default ProductsScreen;
