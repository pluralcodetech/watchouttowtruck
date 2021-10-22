import React from 'react';
import {View, Image, Dimensions, StyleSheet} from 'react-native';
import {Text, Button, Icon} from 'native-base';
import {LIGHT, PRIMARY_COLOR, SECONDARY_COLOR} from '../../../styles/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
const windowWidth = Dimensions.get('window').width;

const ProductCard = ({data}) => {
  const navigation = useNavigation();
  return (
    <View style={style.cardContainer}>
      <Image
        source={{uri: data.img}}
        resizeMode="contain"
        style={style.productImage}
      />
      <View style={style.footer}>
        <Text style={style.nameOfProduct} numberOfLines={3}>
          {data.name}
        </Text>
        <View style={style.priceAndIconContainer}>
          <Text style={{fontWeight: 'bold', color: SECONDARY_COLOR}}>
            ₦{data.price}
          </Text>
          <Icon
            type="MaterialIcons"
            name="favorite"
            style={{fontSize: 15, color: SECONDARY_COLOR}}
          />
        </View>

        {/* Product button */}
        <TouchableOpacity
          style={{width: windowWidth / 2 - 40}}
          onPress={() =>
            navigation.navigate('ShopMartProductDetailsScreen', {
              pId: data.id,
              productName: data.name,
            })
          }>
          <Button bordered block success small>
            <Text style={{color: '#000', fontSize: 12}}>Buy Now</Text>
          </Button>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
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
    position: 'absolute',
    top: 0,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
});

export default ProductCard;
