import React from 'react';
import {SafeAreaView, Image, Text, View, StatusBar} from 'react-native';
import COLORS from '../../const/colors';
import FONTS from '../../const/fonts';
const SplashScreen = ({navigation}) => {
  React.useEffect(() => {
    setTimeout(() => navigation.navigate('HomeScreen'), 3000);
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'space-between',
      }}>
      <Image
        source={require('../../assets/illus.png')}
        style={{height: 380, width: '100%', paddingBottom: 50}}
      />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 20,
        }}>
        <Text
          style={{
            fontSize: 35,
            color: COLORS.white,
            fontFamily: FONTS.bold,
          }}>
          Cypto Live
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: COLORS.white,
            textAlign: 'center',
            width: '70%',
            fontFamily: FONTS.regular,
          }}>
          Track and manage your coin easily with crypto live
        </Text>
      </View>

      <Image
        source={require('../../assets/illus2.png')}
        style={{width: '100%', height: 200, resizeMode: 'contain', bottom: -60}}
      />
    </SafeAreaView>
  );
};

export default SplashScreen;
