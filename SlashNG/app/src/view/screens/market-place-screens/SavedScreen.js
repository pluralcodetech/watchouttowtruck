import React from 'react';
import {BackHandler, SafeAreaView, FlatList, View} from 'react-native';
import {Root, Text} from 'native-base';
import axios from 'axios';
import qs from 'query-string';
import {SHOP_MART_API} from '../../../const/api';
import Header from '../../components/market-place-screens/Header';
import ProductCard from '../../components/market-place-screens/ProductCard';
import ScreenLoader from '../../components/Loaders/ScreenLoader';
import {useSelector} from 'react-redux';
import {dispatchItemsTostore} from '../../../logics/products';

const SavedScreen = ({route}) => {
  const {data} = useSelector((state) => state.userData);
  const {products} = useSelector((state) => state.savedItems);

  const [state, setState] = React.useState({
    loading: true,
    errorMessage: '',
  });

  React.useEffect(() => {
    dispatchItemsTostore({products: []});
  }, []);

  //get saved product
  const getProducts = async () => {
    try {
      let res = await axios({
        url: SHOP_MART_API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'fetch',
          type: 'wishlist',
          user: data.id,
          token: data.token,
        }),
      });

      const resData = res.data;

      if (resData.status == '200') {
        //dispacth to store
        dispatchItemsTostore({products: resData.wishlist});

        setState({
          ...state,
          products: resData.wishlist,
          errorMessage: '',
          loading: false,
        });
      } else {
        setState({
          ...state,
          errorMessage: 'No Product Found.',
          loading: false,
        });
      }
    } catch (error) {
      //run the function again after some sec
      setTimeout(() => getProducts(), 5000);
    }
  };

  const clearProduct = React.useCallback(() => {
    //only refresh when the array of products is empty
    if (products.length > 0) {
      dispatchItemsTostore({products: []});
      BackHandler.removeEventListener('hardwareBackPress', clearProduct);
    }
  }, [route.params]);

  React.useEffect(() => {
    setState({...state, errorMessage: ''});
    BackHandler.addEventListener('hardwareBackPress', clearProduct);

    //get the products from server
    getProducts();
  }, [route.params]);

  return (
    <Root>
      <ScreenLoader loading={state.loading} />
      <SafeAreaView>
        <Header title="Saved Items" />
        <FlatList
          ListFooterComponentStyle={{height: 170}}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={products}
          ListFooterComponent={() => (
            <View style={{alignItems: 'center'}}>
              {state.errorMessage != '' && <Text>No item found</Text>}
            </View>
          )}
          renderItem={({item}) => <ProductCard product={item} />}
        />
      </SafeAreaView>
    </Root>
  );
};

export default SavedScreen;
