import React from 'react';
import {SafeAreaView, FlatList, View, TouchableOpacity} from 'react-native';
import {Root} from 'native-base';
import axios from 'axios';
import qs from 'query-string';
import {SHOP_MART_API} from '../../../const/api';
import Header from '../../components/shop-mart-components/Header';
import CategoriesCard from '../../components/shop-mart-components/CategoriesCard';

//get the shop mart categories....
const getCategories = async (setCategories) => {
  try {
    let res = await axios({
      url: SHOP_MART_API,
      method: 'POST',
      data: qs.stringify({
        cmd: 'fetch',
        type: 'categories',
      }),
    });

    let resData = res.data;
    if (resData.status == '200') {
      //return the categories card
      resData.categories;
      let categories = [];
      await resData.categories.forEach(async (item) => {
        let subCategories = [];

        //push the data with parent of 0 for categories
        if (item.parent == 0) {
          //get the sub categories
          await resData.categories.forEach((items) => {
            if (items.parent == item.id) {
              subCategories.push(items);
            }
          });
          categories.push({
            category: item,
            subCategories,
          });
        }
      });

      setCategories(categories);
    }
  } catch (error) {
    //run the function again after some secs
    setTimeout(() => getCategories(setCategories), 5000);
  }
};

const MainScreen = ({navigation}) => {
  const [categories, setCategories] = React.useState([{}, {}, {}, {}, {}, {}]);
  React.useEffect(() => {
    getCategories(setCategories);
  }, [0]);
  return (
    <Root>
      <SafeAreaView>
        <Header />
        <FlatList
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={categories}
          ListFooterComponentStyle={{height: 170}}
          ListFooterComponent={<View style={{height: 90}}></View>}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                item?.category
                  ? navigation.navigate('ShopMartSubCategories', {
                      categoryName: item.category.name,
                      categoryId: item.category.id,
                      data: item.subCategories,
                    })
                  : null
              }
              activeOpacity={0.5}>
              <CategoriesCard data={item} />
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </Root>
  );
};

export default MainScreen;
