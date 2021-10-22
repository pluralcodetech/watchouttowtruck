import React from 'react';
import {Container} from 'native-base';
import {dispatchUserDataToStore} from '../../logics/auth/auth';

const closeSplashScreen = async (navigation) => {
  //run the authUser fuction after timeout
  setTimeout(async () => {
    //dispatch user data to store to get access to our data
    await dispatchUserDataToStore();
    navigation.navigate('HomeScreen');
  }, 1000);
};

const SplashScreen = ({navigation, route}) => {
  React.useEffect(() => {
    closeSplashScreen(navigation, route);
  });

  return <></>;
};

export default SplashScreen;
