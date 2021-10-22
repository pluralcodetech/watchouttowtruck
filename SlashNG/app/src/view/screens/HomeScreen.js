import React from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Root, Text} from 'native-base';
import axios from 'axios';
import qs from 'query-string';
import {useNavigation} from '@react-navigation/native';
import {API} from '../../const/api';
import Header from '../components/market-place-screens/Header';
import CategoriesCard from '../components/market-place-screens/CategoriesCard';
import SplashScreen from './SplashScreen';
import {updateUserBalance} from '../../logics/auth/Auth/auth';
import HomeHeader from '../layouts/home/HomeHeader';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = React.useState([{}, {}, {}, {}, {}, {}]);
  const splashScreen = React.useMemo(() => <SplashScreen />, []);
  React.useEffect(() => {
    getCategories();
    updateUserBalance();
  }, []);

  //get the categories....
  const getCategories = async () => {
    try {
      let res = await axios({
        url: API,
        method: 'POST',
        data: qs.stringify({
          cmd: 'fetch',
          ftype: 'categories',
        }),
      });

      let resData = res.data;
      if (resData.status == '200') {
        //return the categories card
        resData.categories;
        let categories = [];
        await resData.categories.forEach(async item => {
          let subCategories = [];

          //push the data with parent of 0 for categories
          if (item.parent == 0) {
            //get the sub categories
            await resData.categories.forEach(items => {
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
      setTimeout(getCategories, 5000);
    }
  };

  return (
    <Root>
      <SafeAreaView style={{flex: 1}}>
        {splashScreen}
        <Header logo home={false} />
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <HomeHeader />
          <FlatList
            columnWrapperStyle={{
              flex: 1,
              justifyContent: 'space-evenly',
              alignSelf: 'flex-start',
            }}
            contentContainerStyle={{paddingLeft: 5, paddingBottom: 100}}
            ListHeaderComponent={
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                  marginVertical: 20,
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                  Browse Categories
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
            numColumns={3}
            data={categories}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() =>
                  item?.category
                    ? navigation.navigate('SubCategories', {
                        categoryName: item.category.name,
                        categoryId: item.category.id,
                        data: item.subCategories,
                      })
                    : null
                }
                activeOpacity={0.8}>
                <CategoriesCard data={item} />
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </SafeAreaView>
    </Root>
  );
};

export default HomeScreen;
