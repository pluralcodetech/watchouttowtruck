import React from 'react';
import {
  BackHandler,
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import {Root, Text, Button, Input, Item, Toast} from 'native-base';
import axios from 'axios';
import qs from 'query-string';
import {useSelector} from 'react-redux';
import {SHOP_MART_API} from '../../../const/api';
import Header from '../../components/shop-mart-components/Header';
import {SECONDARY_COLOR} from '../../../styles/colors';
import ScreenLoader from '../../components/Loaders/ScreenLoader';
import {ScrollView} from 'react-native-gesture-handler';
import CartModal from '../../components/modals/CartModal';
import Preloader from '../../components/modals/PreLoader';

const addProductToCart = async (
  {data},
  id,
  quantity,
  setLoading,
  setShowCartModal,
) => {
  //check if quantity is more than zero
  if (quantity < 1) {
    Toast.show({
      text: 'Quantity must be up to 1',
      duration: 3000,
      type: 'danger',
    });
  } else {
    try {
      setLoading(true);
      let res = await axios({
        url: SHOP_MART_API,
        method: 'POST',
        data: qs.stringify({
          user: data.id,
          token: data.token,
          cmd: 'save-item',
          pid: id,
        }),
      });

      const resData = res.data;
      if (resData.status == '200') {
        //show cart modal
        setShowCartModal(true);
      } else {
        //set error message
        Alert.alert('Error', 'Something went wrong.');
      }
      //set loading to false
      setLoading(false);
    } catch (error) {
      setLoading(false);
      //show error alert
      Alert.alert('Error', 'Something went wrong.');
    }
  }
};

//get product by id
const getProductDetails = async (
  id,
  updateProductsDetails,
  setScreenLoading,
  updateErrorMessage,
) => {
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
      updateProductsDetails(resData.products);
    } else {
      //set error message
      updateErrorMessage('Product Found.');
    }
    //set loading to false
    setScreenLoading(false);
  } catch (error) {
    console.log(error);
    //run the function again after some sec
    setTimeout(
      () =>
        getProductDetails(
          id,
          updateProductsDetails,
          setLoading,
          updateErrorMessage,
        ),
      5000,
    );
  }
};

const ProductDetailsScreen = ({navigation, route}) => {
  const userData = useSelector((state) => state.userData);
  const [loading, setLoading] = React.useState(false);
  const [screenLoading, setScreenLoading] = React.useState(true);
  const [product, updateProductsDetails] = React.useState([]);
  const [errorMessage, updateErrorMessage] = React.useState('');
  const [quantity, updateQuantity] = React.useState('1');
  const [showModalCart, setShowCartModal] = React.useState(false);

  const clearProductDetails = React.useCallback(() => {
    updateProductsDetails([]);
    BackHandler.removeEventListener('hardwareBackPress', clearProductDetails);
  }, [route.params]);

  React.useEffect(() => {
    const {pId} = route.params;
    BackHandler.addEventListener('hardwareBackPress', clearProductDetails);
    //get the product details fromserver
    getProductDetails(
      pId,
      updateProductsDetails,
      setScreenLoading,
      updateErrorMessage,
    );
  }, [route.params]);

  return (
    <Root>
      <ScreenLoader loading={screenLoading} />
      <CartModal
        visible={showModalCart}
        showModal={setShowCartModal}
        data={product[0]}
      />
      <Preloader visible={loading} />

      <SafeAreaView>
        <Header searchInput={false} title="Details" />
        <ScrollView showsVerticalScrollIndicator={false}>
          {product.length > 0 ? (
            <View>
              <Image
                style={style.image}
                source={{uri: product[0].img}}
                resizeMode="contain"
              />
              <View style={style.detailsConatiner}>
                <Text style={style.productName}>{product[0].name}</Text>
                <View style={{marginTop: 10}}>
                  <Text style={{fontSize: 14}}>Rating:</Text>
                </View>
                <Text style={style.productPrice}>₦{product[0].price}</Text>
                <View style={style.qtyContainer}>
                  <Text style={{fontSize: 14}}>QTY:</Text>
                  <Item regular style={{width: 35, height: 35, marginLeft: 10}}>
                    <Input
                      regular
                      defaultValue={quantity}
                      keyboardType="numeric"
                      maxLength={5}
                      onChangeText={(val) => {
                        updateQuantity(val);
                      }}
                    />
                  </Item>
                </View>
                <Button
                  block
                  style={{marginTop: 15}}
                  onPress={() =>
                    addProductToCart(
                      userData,
                      product[0].id,
                      quantity,
                      setLoading,
                      setShowCartModal,
                    )
                  }>
                  <Text>BUY NOW</Text>
                </Button>
                <Text style={{marginTop: 20, fontSize: 20}}>
                  PRODUCT DETAILS
                </Text>
                <Text style={style.productDes}>{product[0].description}</Text>
              </View>
            </View>
          ) : (
            <View style={{height: '100%'}}></View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Root>
  );
};

const style = StyleSheet.create({
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
