import React from 'react';
import {
  View,
  Image,
  Text,
  Dimensions,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {LIGHT} from '../../../styles/colors';
const windowWidth = Dimensions.get('window').width;

const CategoriesCard = ({data: {category}}) => {
  const [imageLoading, setImageLoading] = React.useState(true);

  return (
    <View style={style.categoryCard}>
      <View style={style.imageConatainer}>
        <ImageBackground
          resizeMode="center"
          source={require('../../../assets/loading.gif')}
          style={style.imageBackground}>
          <Image
            style={{height: 70, width: 70, zIndex: !imageLoading ? 1 : -1}}
            onLoad={() => setImageLoading(false)}
            source={{
              uri: category?.img,
            }}
          />
        </ImageBackground>
      </View>

      <View
        style={{
          alignItems: 'center',
          width: '100%',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 10, fontWeight: 'bold', textAlign: 'center'}}>
          {category?.name}
        </Text>
        <Text style={{fontSize: 10, fontWeight: 'bold', textAlign: 'center'}}>
          {category?.no_of_items}
        </Text>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  categoryCard: {
    width: windowWidth / 3 - 5,
    backgroundColor: LIGHT,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    marginBottom: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  imageConatainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageBackground: {
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoriesCard;
