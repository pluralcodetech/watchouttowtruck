import React from 'react';
import {
  BackHandler,
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Alert,
  Picker,
} from 'react-native';
import {Root, Text, Button, Item, Toast} from 'native-base';
import axios from 'axios';
import qs from 'query-string';
import {useSelector} from 'react-redux';
import {SHOP_MART_API} from '../../../const/api';
import Header from '../../components/market-place-screens/Header';
import {SECONDARY_COLOR} from '../../../styles/colors';
import ScreenLoader from '../../components/Loaders/ScreenLoader';
import {ScrollView} from 'react-native-gesture-handler';
import CartModal from '../../components/modals/CartModal';
import Preloader from '../../components/modals/PreLoader';
import {updateProductQuantity} from '../../../logics/cart';

//get product by id
const getProductDetails = async (id, state, setState) => {
  try {
    let res = await axios({
      url: SHOP_MART_API,
      method: 'POST',
      data: qs.stringify({
        cmd: 'fetch',
        type: 'products',
        pid: id,
      }),
    });

    let resData = res.data;
    if (resData.status == 200) {
      setState({...state, product: resData.products, screenLoading: false});
    } else {
      //set error message
      setState({
        ...state,
        errorMessage: 'Product Found.',
        screenLoading: false,
      });
    }
  } catch (error) {
    //run the function again after some sec
    setTimeout(() => getProductDetails(id, state, setState), 5000);
  }
};

const ProductDetailsScreen = ({navigation, route}) => {
  const pickerNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const userData = useSelector((state) => state.userData);
  const [state, setState] = React.useState({
    loading: false,
    screenLoading: true,
    product: [],
    errorMessage: '',
    quantity: '1',
  });

  const [showModalCart, setShowCartModal] = React.useState(false);

  const clearProductDetails = React.useCallback(() => {
    setState({...state, product: [], screenLoading: true, loading: false});
    BackHandler.removeEventListener('hardwareBackPress', clearProductDetails);
  }, [route.params]);

  React.useEffect(() => {
    const {pId} = route.params;
    BackHandler.addEventListener('hardwareBackPress', clearProductDetails);
    //get the product details fromserver
    getProductDetails(pId, state, setState);
  }, [state.screenLoading]);

  return (
    <Root>
      <ScreenLoader loading={state.screenLoading} />
      <CartModal
        visible={showModalCart}
        showModal={setShowCartModal}
        data={state.product[0]}
      />
      <Preloader visible={state.loading} />

      <SafeAreaView>
        <Header searchInput={false} title="Details" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {state.product.length > 0 ? (
            <View>
              <Image
                style={style.image}
                source={{uri: state.product[0].img}}
                resizeMode="contain"
              />
              <View style={style.detailsConatiner}>
                <Text style={style.productName}>{state.product[0].name}</Text>
                <View style={{marginTop: 10}}>
                  <Text style={{fontSize: 14}}>Rating:</Text>
                </View>
                <Text style={style.productPrice}>
                  ₦{state.product[0].price}
                </Text>
                <View style={style.qtyContainer}>
                  <Text style={{fontSize: 14}}>QTY:</Text>

                  <View style={style.pickerContainer}>
                    <Picker
                      style={{width: 80, marginLeft: 2}}
                      mode="dropdown"
                      selectedValue={state.quantity}
                      onValueChange={(value) => {
                        setState({...state, quantity: value});
                      }}>
                      {pickerNum.map((num) => (
                        <Picker.Item
                          label={num.toString()}
                          value={num.toString()}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
                <Button
                  block
                  style={{marginTop: 15}}
                  onPress={() => {
                    setState({...state, loading: true});
                    setTimeout(() => {
                      setShowCartModal(true);
                      updateProductQuantity({
                        ...state.product[0],
                        quantity: state.quantity,
                      });
                      setState({...state, loading: false});
                    }, 1500);
                  }}>
                  <Text>BUY NOW</Text>
                </Button>
                <Text style={{marginTop: 20, fontSize: 20}}>
                  PRODUCT DETAILS
                </Text>
                <Text style={style.productDes}>
                  {state.product[0].description}
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              {state.errorMessage != '' && <Text>Product not found</Text>}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Root>
  );
};

const style = StyleSheet.create({
  pickerContainer: {
    marginLeft: 10,
    borderColor: '#999',
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
    overflow: 'hidden',
  },
  detailsConatiner: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 100,
  },
  image: {width: '100%', height: 280, backgroundColor: '#fff'},
  productName: {marginTop: 10, fontSize: 16},
  productPrice: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 22,
    color: SECONDARY_COLOR,
  },
  qtyContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productDes: {marginTop: 10, fontSize: 15, color: 'grey'},
});

export default ProductDetailsScreen;
