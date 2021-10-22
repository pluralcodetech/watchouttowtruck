import React from 'react';
import {View, Image, Text, Dimensions} from 'react-native';
import {LIGHT} from '../../../styles/colors';

const CategoriesCard = ({data: {category = null}}) => {
  const windowWidth = Dimensions.get('window').width;

  return (
    <View
      style={{
        width: windowWidth / 2 - 8,
        backgroundColor: LIGHT,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 4,
      }}>
      <Image
        style={{height: 100, width: 100}}
        source={{
          uri: category == null ? null : category.img,
        }}
      />
      {/* only show product name for subcategories */}
      {category != null && category.parent != 0 ? (
        <Text style={{fontSize: 12}}>{category.name}</Text>
      ) : null}
    </View>
  );
};

export default CategoriesCard;
