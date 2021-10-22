import React from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Modal,
} from 'react-native';
import {Text, Button, Icon, Picker} from 'native-base';
import {LIGHT, PRIMARY_COLOR, SECONDARY_COLOR} from '../../../styles/colors';
import {useNavigation} from '@react-navigation/native';
import {addToCart, updateProductQuantity} from '../../../logics/cart';
import CartModal from '../modals/CartModal';
import PreLoader from '../modals/PreLoader';
import {FormatNumber} from '../../../logics';
import {saveOrRemoveProducts} from '../../../logics/products';
import {useSelector} from 'react-redux';
const windowWidth = Dimensions.get('window').width;

const ProductCard = ({product}) => {
  const {data} = useSelector((state) => state.userData);
  const navigation = useNavigation();
  const [showModalCart, setShowCartModal] = React.useState(false);

  const [state, setState] = React.useState({
    product,
    showPreloader: false,
  });

  const [imageLoading, setImageLoading] = React.useState(true);

  const [
    showProductQuantityModal,
    setShowProductQuantityModal,
  ] = React.useState(false);

  const quantity = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  const ProductQuantityModal = () => {
    const [selectedQuantity, setSelectedQuantity] = React.useState('1');
    return (
      <Modal visible={showProductQuantityModal} transparent>
        <View style={style.modalContainer}>
          <View style={style.modalBody}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>Quantity</Text>
            <View>
              <Picker
                note
                mode="dropdown"
                style={{
                  width: '100%',
                  marginVertical: 10,
                  padding: 0,
                }}
                selectedValue={selectedQuantity}
                onValueChange={(value) => setSelectedQuantity(value)}>
                {quantity.map((num) => (
                  <Picker.Item label={num} value={num} key={num} />
                ))}
              </Picker>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Button
                block
                style={{flex: 1, marginRight: 5}}
                bordered
                onPress={() => setShowProductQuantityModal(false)}>
                <Text>CANCEL</Text>
              </Button>
              <Button
                block
                style={{flex: 1, marginLeft: 5}}
                onPress={() => {
                  //close modal
                  setShowProductQuantityModal(false);
                  // show loader
                  setState({...state, showPreloader: true});

                  updateProductQuantity({
                    ...product,
                    price: parseInt(product.price * selectedQuantity),
                    quantity: parseInt(selectedQuantity),
                    mainPrice: product.price,
                  });
                  setTimeout(() => {
                    //hide loader
                    setState({...state, showPreloader: false});

                    //show cart modal
                    setShowCartModal(true);
                  }, 1000);
                }}>
                <Text>ADD TO CART</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('ShopMartProductDetailsScreen', {
          pId: state.product.id,
          productName: state.product.name,
        })
      }>
      <ProductQuantityModal />
      <PreLoader visible={state.showPreloader} />
      <CartModal
        visible={showModalCart}
        showModal={setShowCartModal}
        data={state.product}
      />
      <View style={style.cardContainer}>
        {state.product.is_discount == 1 && (
          <View style={style.promoView}>
            <Text style={{color: '#fff', fontSize: 10, fontWeight: 'bold'}}>
              {state.product.promo_name}
            </Text>
          </View>
        )}
        <ImageBackground
          resizeMode="center"
          source={require('../../../assets/loading.gif')}
          style={style.productImage}>
          <Image
            onLoad={() => setImageLoading(false)}
            source={{uri: state.product.img}}
            resizeMode="contain"
            style={{
              height: '100%',
              width: '100%',
              zIndex: !imageLoading ? 1 : -1,
            }}
          />
        </ImageBackground>

        <View style={style.footer}>
          <View style={{width: '100%'}}>
            <Text style={style.nameOfProduct} numberOfLines={3}>
              {state?.product?.name}
            </Text>
          </View>

          <View style={style.priceAndIconContainer}>
            <Text style={{fontWeight: 'bold', color: SECONDARY_COLOR}}>
              ₦{FormatNumber(state?.product?.price)}
            </Text>
            <TouchableOpacity
              onPress={() =>
                saveOrRemoveProducts({
                  id: data.id,
                  token: data.token,
                  productId: state.product.id,
                  state,
                  setState,
                })
              }>
              <Icon
                type="MaterialIcons"
                name={
                  state.product.is_saved == '0' ? 'favorite-border' : 'favorite'
                }
                style={{fontSize: 18, color: SECONDARY_COLOR}}
              />
            </TouchableOpacity>
          </View>

          {state.product.is_discount == 1 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                paddingHorizontal: 10,
                width: '100%',
                marginBottom: 5,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  textDecorationLine: 'line-through',
                  color: 'grey',
                }}>
                ₦
                {/* {state?.product?.cancel_price &&
                  FormatNumber(state?.product?.cancel_price)} */}
              </Text>
              <View
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#ff2',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 5,
                }}>
                <Text style={{fontSize: 12, color: PRIMARY_COLOR}}>
                  {state.product.discount_percent != null &&
                    state.product.discount_percent}
                </Text>
              </View>
            </View>
          )}
          {/* Product button */}
          <View style={{width: windowWidth / 2 - 40}}>
            <Button bordered block success small>
              <Text
                style={{color: '#000', fontSize: 12}}
                onPress={() => {
                  setShowProductQuantityModal(true);
                }}>
                Buy Now
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  promoView: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: PRIMARY_COLOR,
    zIndex: 10,
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContainer: {
    width: windowWidth / 2 - 20,
    backgroundColor: LIGHT,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 10,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth / 2 - 20,
    position: 'absolute',
    bottom: 20,
  },

  nameOfProduct: {
    fontSize: 12,
    fontWeight: '100',
    marginVertical: 6,
    marginHorizontal: 10,
  },
  priceAndIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  productImage: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  modalContainer: {
    position: 'absolute',
    flex: 1,
    height: '100%',
    width: '100%',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  modalBody: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 5,
    padding: 15,
  },
});

export default ProductCard;
