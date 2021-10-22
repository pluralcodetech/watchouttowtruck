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

export default TopCoinCard;
