import React from 'react';
import {Text, SafeAreaView, View, Image, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../const/colors';
import FONTS from '../../const/fonts';
import formatPrice from '../../helper/formatPrice';
import CustomChart from '../components/CustomChart';

const List = ({title, item}) => {
  return (
    <View
      style={{
        height: 50,
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: COLORS.backgroundLight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Text
        style={{
          color: COLORS.white,
          fontFamily: FONTS.bold,
          fontSize: 12,
          textTransform: 'uppercase',
        }}>
        {title}
      </Text>
      <Text
        style={{color: COLORS.white, fontFamily: FONTS.regular, fontSize: 12}}>
        {item}
      </Text>
    </View>
  );
};

const DetailsScreen = ({navigation, route}) => {
  const coin = route.params;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.background}}>
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          height: 50,
        }}>
        <Icon
          name="arrow-left"
          color={COLORS.white}
          size={25}
          onPress={navigation.goBack}
        />
        <View
          style={{flexDirection: 'row', paddingLeft: 10, alignItems: 'center'}}>
          <Image style={{height: 25, width: 25}} source={{uri: coin?.image}} />
          <Text
            style={{
              color: COLORS.white,
              fontSize: 23,
              fontFamily: FONTS.bold,
              marginLeft: 10,
            }}>
            {coin?.name}
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            color: COLORS.white,
            margin: 20,
            fontSize: 20,
            fontFamily: FONTS.bold,
          }}>
          ${coin?.current_price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
        </Text>
        <View style={{flex: 1, alignItems: 'center'}}>
          <CustomChart
            label
            style={{marginTop: 10, width: '100%', height: 300}}
            dataList={coin?.sparkline_in_7d?.price}
          />
        </View>

        <Text
          style={{
            color: COLORS.white,
            paddingHorizontal: 20,
            fontSize: 18,
            fontFamily: FONTS.bold,
            paddingVertical: 20,
          }}>
          Coin Details
        </Text>
        <View style={{marginBottom: 50}}>
          <List title="market cap rank" item={coin?.market_cap_rank} />
          <List title="market cap" item={formatPrice(coin?.market_cap)} />
          <List title="total volume" item={formatPrice(coin?.total_volume)} />
          <List title="24 high " item={formatPrice(coin?.high_24h)} />
          <List title="24 low " item={formatPrice(coin?.low_24h)} />
          <List
            title="available supply "
            item={formatPrice(coin?.max_supply)}
          />
          <List title="total supply " item={formatPrice(coin?.total_supply)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({});
export default DetailsScreen;
