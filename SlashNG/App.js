// import OneSignal from 'react-native-onesignal';
import React from 'react';
import {StyleProvider} from 'native-base';
import getTheme from './native-base-theme/components';
import commonColors from './native-base-theme/variables/commonColor';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import BottomNav from './app/src/view/navigation/BottomNavigation';
import SignInScreen from './app/src/view/screens/auth/SignInScreen';
import SignUpScreen from './app/src/view/screens/auth/SignUpScreen';
import SearchScreen from './app/src/view/screens/SearchScreen';
import Store from './app/src/redux/store';
import {Provider} from 'react-redux';
// import codePush from 'react-native-code-push';
import SavedScreen from './app/src/view/screens/market-place-screens/SavedScreen';
import AuthScreen from './app/src/view/screens/auth/MainScreen';
import ResetPasswordScreen from './app/src/view/screens/auth/ResetPasswordScreen';
import UpdateProfileScreen from './app/src/view/screens/UpdateProfile';
import TransactionDetailsScreen from './app/src/view/screens/TransactionDetailsScreen';
import UpdatePasswordScreen from './app/src/view/screens/UpdatePasswordScreen';
import TransactionConfirmationScreen from './app/src/view/screens/TransactionConfirmationScreen';
import CheckoutScreen from './app/src/view/screens/market-place-screens/CheckoutScreen';
import OrderHistoryScreen from './app/src/view/screens/market-place-screens/OrderHistory';
import OrderDetailsScreen from './app/src/view/screens/market-place-screens/OrderDetailsScreen';
import AddNewAddressScreen from './app/src/view/screens/AddNewAddressScreen';
import AddressBookScreen from './app/src/view/screens/AddressBookScreen';
import InviteScreen from './app/src/view/screens/InviteScreen';
import {Alert, NetInfo} from 'react-native';
import PreLoader from './app/src/view/components/modals/PreLoader';
import SuccessScreen from './app/src/view/screens/SuccessScreen';
import CheckOutOrderDetailsScreen from './app/src/view/screens/market-place-screens/CheckOutOrderDetailsScreen';
import RewardScreen from './app/src/view/screens/RewardScreen';
import ServiceScreen from './app/src/view/screens/ServiceScreen';
import ProductDetailsScreen from './app/src/view/screens/market-place-screens/ProductDetailsScreen';
import ProductsScreen from './app/src/view/screens/market-place-screens/ProductsScreen';
import CartScreen from './app/src/view/screens/market-place-screens/CartScreen';

// const connectionHandler = () => {
//   console.log('connect');
// };
// NetInfo.addEventListener('connectionChange', connectionHandler);

const Stack = createStackNavigator();
const App = () => {
  const [state, setState] = React.useState({
    showPreloader: false,
    updateMessage: '',
  });
  const [loggedIn, setLoggedIn] = React.useState(false);

  Store.subscribe(() => {
    const userLoggedIn = Store.getState().userData.loggedIn;
    setLoggedIn(userLoggedIn);
  });

  React.useEffect(() => {
    // getCodePushUpdate();
    // oneSignalSetUp();
  }, []);

  // //get on
  // const oneSignalSetUp = async () => {
  //   OneSignal.setLogLevel(6, 0);
  //   OneSignal.setAppId('a9d971a1-b514-4bf6-a431-dc4392ea4fb4');
  //   OneSignal.setLogLevel(6, 0);
  //   OneSignal.setRequiresUserPrivacyConsent(false);
  //   // OneSignal.promptForPushNotificationsWithUserResponse((response) => {
  //   //   // this.OSLog('Prompt response:', response);
  //   // });

  //   console.log(deviceState);
  // };

  //update the app
  const updateApp = () => {
    //show updating dialog
    setState({
      ...state,
      showPreloader: true,
      updateMessage: 'Downloading update...',
    });

    codePush.sync({updateDialog: false}, status => {
      switch (status) {
        case codePush.SyncStatus.INSTALLING_UPDATE:
          setState({
            ...state,
            showPreloader: true,
            updateMessage: 'Installing update...',
          });
          break;
        case codePush.SyncStatus.UPDATE_INSTALLED:
          setState({
            ...state,
            showPreloader: true,
            updateMessage: 'Restarting app please wait...',
          });
          //restart app after some secs
          setTimeout(() => codePush.restartApp(true), 4000);
          break;
        default:
          setState({
            ...state,
            showPreloader: false,
            updateMessage: '',
          });
      }
    });
  };

  const getCodePushUpdate = async () => {
    codePush.notifyAppReady();
    try {
      const update = await codePush.checkForUpdate();
      //update is availaible show alert
      if (!update) {
        console.log('The app is up to date!');
      } else if (update) {
        Alert.alert('Update', 'An update is available press ok, to install', [
          {
            text: 'Ok',
            onPress: () => updateApp(),
          },
        ]);
      }
      console.log(update);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Provider store={Store}>
      <PreLoader visible={state.showPreloader} message={state.updateMessage} />
      <StyleProvider style={getTheme(commonColors)}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{header: () => null}}>
            <Stack.Screen name="HomeScreen" component={BottomNav} />
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen
              name="ResetPasswordScreen"
              component={ResetPasswordScreen}
            />
            <Stack.Screen
              name="TransactionDetailsScreen"
              component={TransactionDetailsScreen}
            />
            <Stack.Screen
              name="TransactionConfirmationScreen"
              component={TransactionConfirmationScreen}
            />
            <Stack.Screen
              name="UpdateProfileScreen"
              component={UpdateProfileScreen}
            />
            <Stack.Screen
              name="UpdatePasswordScreen"
              component={UpdatePasswordScreen}
            />
            <Stack.Screen
              name="shopMartProductsScreen"
              component={ProductsScreen}
            />
            <Stack.Screen
              name="ShopMartProductDetailsScreen"
              component={ProductDetailsScreen}
            />
            <Stack.Screen name="SearchScreen" component={SearchScreen} />
            <Stack.Screen
              name="SavedScreen"
              component={loggedIn ? SavedScreen : AuthScreen}
            />
            <Stack.Screen name="ShopMartCartScreen" component={CartScreen} />
            <Stack.Screen
              name="ShopMartCheckoutScreen"
              component={loggedIn ? CheckoutScreen : AuthScreen}
            />
            <Stack.Screen
              name="OrderHistoryScreen"
              component={OrderHistoryScreen}
            />
            <Stack.Screen
              name="OrderDetailsScreen"
              component={OrderDetailsScreen}
            />
            <Stack.Screen
              name="CheckOutOrderDetailsScreen"
              component={CheckOutOrderDetailsScreen}
            />
            <Stack.Screen
              name="AddNewAddressScreen"
              component={AddNewAddressScreen}
            />
            <Stack.Screen
              name="AddressBookScreen"
              component={AddressBookScreen}
            />
            <Stack.Screen name="ServiceScreen" component={ServiceScreen} />
            <Stack.Screen name="InviteScreen" component={InviteScreen} />
            <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
            <Stack.Screen name="RewardScreen" component={RewardScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </StyleProvider>
    </Provider>
  );
};

export default App;
