import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import COLORS from '../../const/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FONTS from '../../const/fonts';
import CustomChart from '../components/CustomChart';
import formatPrice from '../../helper/formatPrice';
import Loader from '../components/Loader';
import fetchCoin from '../../helper/fetchCoin';

const CoinList = ({coin, navigation}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('DetailsScreen', coin)}
      style={style.coinList}>
      <View
        style={{
          height: 50,
          width: 50,
          backgroundColor: COLORS.background,
          borderRadius: 25,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image style={{height: 30, width: 30}} source={{uri: coin?.image}} />
      </View>
      <View style={{flex: 1, justifyContent: 'center', marginLeft: 10}}>
        <Text style={{color: COLORS.white, fontFamily: FONTS.bold}}>
          {coin?.name}
        </Text>
        <Text
          style={{
            color: COLORS.white,
            fontFamily: FONTS.regular,
            textTransform: 'uppercase',
            fontSize: 12,
          }}>
          {coin?.symbol}
        </Text>
      </View>
      <View style={{alignItems: 'flex-end'}}>
        <Text style={{color: COLORS.white, fontFamily: FONTS.bold}}>
          {formatPrice(coin?.current_price)}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon
            name={
              coin?.price_change_percentage_24h < 0 ? 'menu-down' : 'menu-up'
            }
            color={
              coin?.price_change_percentage_24h < 0 ? COLORS.red : COLORS.green
            }
            size={25}
          />
          <Text
            style={{
              color:
                coin?.price_change_percentage_24h < 0
                  ? COLORS.red
                  : COLORS.green,
              fontFamily: FONTS.regular,
              fontSize: 12,
            }}>
            {coin?.price_change_percentage_24h.toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FavCoinChip = ({coin, navigation}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('DetailsScreen', coin)}
      style={style.favCoinChip}>
      <Image style={{height: 20, width: 20}} source={{uri: coin?.image}} />
      <View>
        <Text
          style={{
            color: COLORS.white,
            marginLeft: 5,
            fontFamily: FONTS.regular,
          }}>
          {coin?.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const TopCoinCard = ({coin, navigation}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('DetailsScreen', coin)}
      style={{
        height: 220,
        width: 160,
        backgroundColor: COLORS.backgroundLight,
        marginRight: 20,
        borderRadius: 20,
        elevation: 2,
        padding: 15,
        paddingHorizontal: 10,
      }}>
      <View style={{flexDirection: 'row'}}>
        <Image style={{height: 40, width: 40}} source={{uri: coin?.image}} />
        <View style={{marginLeft: 10, flex: 1}}>
          <Text
            style={{
              textTransform: 'uppercase',
              color: COLORS.white,
              fontFamily: FONTS.bold,
            }}>
            {coin?.symbol}
          </Text>
          <Text
            maxLength={1}
            style={{
              flex: 1,
              color: COLORS.white,
              fontFamily: FONTS.regular,
              fontSize: 10,
            }}>
            {coin?.name}
          </Text>
        </View>
        <Icon
          name={coin?.price_change_percentage_24h < 0 ? 'menu-down' : 'menu-up'}
          color={
            coin?.price_change_percentage_24h < 0 ? COLORS.red : COLORS.green
          }
          size={30}
        />
      </View>
      <CustomChart
        style={{marginTop: 10, width: '100%', height: 100}}
        dataList={coin?.sparkline_in_7d?.price}
      />
      <Text
        maxLength={1}
        style={{
          color:
            coin?.price_change_percentage_24h < 0 ? COLORS.red : COLORS.green,
          marginTop: 10,
          fontFamily: FONTS.bold,
          flex: 1,
          textAlign: 'center',
          fontSize: 16,
        }}>
        {formatPrice(coin?.current_price)}
      </Text>
    </TouchableOpacity>
  );
};

const HomeScreen = ({navigation}) => {
  const [favouriteCoins, setFavouriteCoins] = React.useState([]);
  const [trendingCoins, setTrendingCoins] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const getCoins = async () => {
    try {
      const data = await fetchCoin();
      setTrendingCoins(data);
      setFavouriteCoins(data.filter((items, index) => index < 5 && items));
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getCoins();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
      }}>
      <View style={style.header}>
        <Text
          style={{color: COLORS.white, fontSize: 23, fontFamily: FONTS.bold}}>
          Crypto Price
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={style.title}>Favourite Coins</Text>
        {loading ? (
          <Loader style={{height: 50}} />
        ) : (
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{marginTop: 20, paddingLeft: 20}}
            data={favouriteCoins}
            renderItem={({item}) => (
              <FavCoinChip coin={item} navigation={navigation} />
            )}
          />
        )}

        {/* Top card section */}
        <Text style={style.title}>Top Coins</Text>
        {loading ? (
          <Loader style={{height: 100}} />
        ) : (
          <FlatList
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{marginTop: 20, paddingLeft: 20}}
            horizontal
            renderItem={({item}) => (
              <TopCoinCard coin={item} navigation={navigation} />
            )}
            data={favouriteCoins}
          />
        )}
        <Text style={style.title}>Trending Coins</Text>
        {loading ? (
          <Loader style={{height: 200}} />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingVertical: 20, paddingHorizontal: 20}}
            renderItem={({item}) => (
              <CoinList coin={item} navigation={navigation} />
            )}
            data={trendingCoins}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  title: {
    color: COLORS.white,
    fontSize: 18,
    marginTop: 20,
    marginHorizontal: 20,
    fontFamily: FONTS.bold,
  },
  header: {
    height: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  favCoinChip: {
    minWidth: 100,
    height: 35,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  coinList: {
    height: 70,
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    padding: 10,
  },
});
export default HomeScreen;
