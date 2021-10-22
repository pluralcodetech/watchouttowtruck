import React, {useState} from 'react';
import {dispatchUserDataToStore} from '../../logics/auth/Auth/auth';
import {getCart} from '../../logics/cart';
import {View, Image, StyleSheet, Animated, Modal} from 'react-native';
import {Easing} from 'react-native-reanimated';
import {Text} from 'native-base';
import {PRIMARY_COLOR, SECONDARY_COLOR} from '../../styles/colors';
let animated = false;
const SplashScreen = ({navigation, route}) => {
  // let animated = React.useRef(false).current;
  const rotateValue = React.useRef(new Animated.Value(0)).current;
  let scaleInValue = React.useRef(new Animated.Value(0)).current;
  const textOpacity = React.useRef(new Animated.Value(0)).current;
  const [state, setState] = useState({
    rotate: '0deg',
    scale: 0,
    opacity: 0,
    showModal: true,
  });
  const animateLogo = React.useCallback(() => {
    // Second interpolate beginning and end values (in this case 0 and 1)
    const rotate = rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    Animated.parallel([
      Animated.timing(scaleInValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true, // To make use of native driver for performance
      }),
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true, // To make use of native driver for performance
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.linear,
        useNativeDriver: true, // To make use of native driver for performance
      }),
    ]).start();

    setState({...state, rotate: rotate});
  }, [0]);

  React.useEffect(() => {
    setTimeout(animateLogo, 500);
    closeSplashScreen(navigation, route);
  }, [0]);

  const closeSplashScreen = async () => {
    //run the fuction after timeout
    setTimeout(async () => {
      setState({...state, showModal: false});
      //dispatch user data to store to get access to our data
      await dispatchUserDataToStore();
      //get user cart items
      getCart();
    }, 3000);
  };

  return (
    <Modal transparent visible={state.showModal}>
      <View style={style.container}>
        <Animated.Image
          style={{
            height: 250,
            width: 250,
            marginTop: '40%',
            transform: [{rotate: state.rotate}, {scale: scaleInValue}],
          }}
          source={require('../../assets/logo-icon.png')}
        />
        <Animated.View style={[style.textContainer, {opacity: textOpacity}]}>
          <Text
            style={{
              fontSize: 40,
              fontWeight: 'bold',
              color: SECONDARY_COLOR,
              marginRight: 5,
            }}>
            SLASH
          </Text>
          <Text style={{fontSize: 40, fontWeight: 'bold', color: '#000'}}>
            MART
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: 100000,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
    flex: 1,
  },
  textContainer: {
    marginTop: -40,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default SplashScreen;
