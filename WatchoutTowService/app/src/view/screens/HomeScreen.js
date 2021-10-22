import React from 'react';
import {View, Text, Button} from 'native-base';
import {SafeAreaView, ScrollView, StyleSheet, Alert, Image} from 'react-native';
import {useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import COLORS from '../../styles/colors';
import globalStyles from '../../styles/styles';
import axios from 'axios';
import qs from 'qs';
import FONTS from '../../conts/fonts';
import API from '../../conts/api';
import AppHeader from '../components/layouts/AppHeader';
import {updateUserData} from '../../logics/auth';
import PreLoader from '../components/loaders/PreLoader';
import DisplayCases from '../components/homeComponents/DisplayCases';
import {createOrderAction} from '../../redux/actions';
import {useDispatch} from 'react-redux';

const ShowCases = ({data}) => {
  const caseStatus = data.case_status?.toLowerCase();
  if (caseStatus == 'none') {
    // Oder screen

    return (
      <View style={{alignItems: 'center'}}>
        <Image source={require('../../assets/tow.png')} />
        <View style={{alignItems: 'center', width: '100%'}}>
          <Text style={styles.title}>ORDER TOW SERVICE</Text>
          <Text style={styles.messageText}>
            You can order a Tow service urgently if your vehicle breaks down and
            needs to be moved
          </Text>
        </View>
      </View>
    );
  } else if (caseStatus == 'pending') {
    return (
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../../assets/loading.gif')}
          style={{height: 160, resizeMode: 'contain'}}
        />
        <View style={{alignItems: 'center', width: '100%'}}>
          <Text style={styles.title}>SEARCHING FOR TOW NEAR YOU</Text>
          <Text style={styles.messageText}>
            Kindly wait while we connect you with a tow service near you.
          </Text>
        </View>
      </View>
    );
  } else if (caseStatus == 'active') {
    return (
      <View style={styles.caseAlertCard}>
        <Text
          style={{
            color: COLORS.green,
            fontFamily: FONTS.bold,
            fontSize: 18,
            fontWeight: 'bold',
          }}>
          {data?.tow_driver_name}
        </Text>
        <Text
          style={{
            marginTop: 5,
            fontFamily: FONTS.bold,
          }}>
          {data?.tow_driver_phone}
        </Text>

        <Text
          style={{
            marginTop: 5,
            fontFamily: FONTS.bold,
            color: COLORS.primary,
            fontSize: 14,
          }}>
          Company name:
          {data?.tow_company}
        </Text>
        <View style={styles.line} />

        <Text
          style={{
            marginTop: 15,
            fontFamily: FONTS.bold,
          }}>
          Licence Plate:
          {data?.tow_driver_plate}
        </Text>
      </View>
    );
  } else {
    return null;
  }
};

const HomeScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const getDashboardataTimeOut = React.useRef(null);
  const isFocused = useIsFocused();

  const [showPreloader, setShowPreloader] = React.useState(false);

  const {data, code, loggedIn} = useSelector(state => state.userData);
  const createOrderEvent = useSelector(state => state.createOrder);

  React.useEffect(() => {
    getDashboardata();
  }, [isFocused]);

  const [state, setState] = React.useState({
    case_id: data?.case_id,
    phone: data?.phone,
    code,
    otp: code,
    plate_number: data?.plate_number,
  });

  //call Create order method if the event is true
  React.useEffect(() => {
    if (createOrderEvent) {
      createOrder();
    }
  }, [createOrderEvent]);

  //Get data to display for user
  const getDashboardata = async () => {
    clearTimeout(getDashboardataTimeOut.current);
    //Return if the the user is not loggedin
    if (loggedIn && isFocused) {
      try {
        const res = await axios({
          url: API + '/dashboard.php',
          method: 'POST',
          data: qs.stringify(state),
        });

        const resData = res.data;

        if (resData.statuscode == '00') {
          const userData = {loggedIn: true, data: resData, code, otp: code};

          //Dispatch to store and save data to users phone
          await updateUserData(userData);
          setState({
            case_id: resData?.case_id,
            phone: resData?.phone,
            code: state.code,
            otp: state.code,
            plate_number: resData?.plate_number,
          });

          //close preloader
          setShowPreloader(false);

          //Resend request after 8sec
          getDashboardataTimeOut.current = setTimeout(getDashboardata, 8000);
        } else {
          //Resend after 8sec if there is an error
          getDashboardataTimeOut.current = setTimeout(getDashboardata, 8000);
        }
      } catch (error) {
        console.log(error);
        //Resend after 8sec if there is an error
        getDashboardataTimeOut.current = setTimeout(getDashboardata, 8000);
      }
    } else {
      console.log('Not LoggedIn');
    }
  };

  const cancelOrder = () => {
    Alert.alert('Confirm', 'Cancel order?', [
      {text: 'No'},
      {
        text: 'Yes',
        onPress: async () => {
          setShowPreloader(true);
          try {
            const res = await axios({
              url: API + '/cancel_case.php',
              method: 'POST',
              data: qs.stringify(state),
            });

            const resData = await res.data;

            console.log(resData);

            if (resData.statuscode == '00') {
              getDashboardata();
            } else {
              Alert.alert('Error!', 'Something went wrong please try again');
            }
          } catch (error) {
            //Hide preloader
            setShowPreloader(false);
            console.log(error);
            Alert.alert('Error!', 'Something went wrong please try again');
          }
        },
      },
    ]);
  };

  const createOrder = () => {
    Alert.alert('Confirm', 'Create order?', [
      {text: 'No', onPress: cancelOrderEvent},
      {
        text: 'Yes',
        onPress: async () => {
          setShowPreloader(true);
          try {
            const res = await axios({
              url: API + '/new_case.php',
              method: 'POST',
              data: qs.stringify(state),
            });

            const resData = await res.data;

            console.log(resData);
            cancelOrderEvent();
            if (resData.statuscode == '00') {
              getDashboardata();
            } else {
              setShowPreloader(false);
              Alert.alert('Error!', resData.status);
            }
          } catch (error) {
            cancelOrderEvent();
            //Hide preloader
            setShowPreloader(false);
            console.log(error);
            Alert.alert('Error!', 'Something went wrong please try again');
          }
        },
      },
    ]);
  };

  // set create order to false to reset event
  const cancelOrderEvent = () => {
    dispatch(createOrderAction(false));
  };

  return (
    <SafeAreaView style={[globalStyles.safeAreaView, {paddingHorizontal: 0}]}>
      <PreLoader visible={showPreloader} />
      <AppHeader data={data} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Case card container */}
        <View
          style={{
            marginTop: 40,
            marginBottom: 20,
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={styles.caseCard}>
            <Text
              style={{
                fontSize: 28,
                fontFamily: FONTS.bold,
                color: COLORS.primary,
              }}>
              {!data?.total_case ? '0' : data?.total_case}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.grey,
              }}>
              Total Orders
            </Text>
          </View>

          <View style={styles.caseCard}>
            <Text
              style={{
                fontSize: 28,
                fontFamily: FONTS.bold,
                color: COLORS.secondary,
              }}>
              {!data?.complete_case ? '0' : data?.complete_case}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.grey,
              }}>
              Completed Order
            </Text>
          </View>
        </View>
        {/* Show order view or searching view and active view */}
        <View style={{marginTop: 40}}>
          {/* Searching sreen */}

          <ShowCases data={data} />
          {(data?.case_status?.toLowerCase() == 'active' ||
            data.case_status?.toLowerCase() == 'pending') && (
            <Button full style={styles.cancelBtn} onPress={cancelOrder}>
              <Text>CANCEL ORDER</Text>
            </Button>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  caseCard: {
    height: 100,
    width: 150,
    backgroundColor: COLORS.white,
    elevation: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    color: COLORS.primary,
    width: '70%',
    textAlign: 'center',
  },
  messageText: {
    color: COLORS.grey,
    textAlign: 'center',
    marginTop: 20,
    width: '70%',
  },
  cancelBtn: {
    backgroundColor: COLORS.secondary,
    margin: 20,
  },
  caseAlertCard: {
    paddingTop: 40,
    paddingBottom: 50,
    elevation: 10,
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 10,
    marginVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  line: {
    height: 1,
    backgroundColor: COLORS.black,
    width: '70%',
    marginTop: 15,
  },
});

export default HomeScreen;
