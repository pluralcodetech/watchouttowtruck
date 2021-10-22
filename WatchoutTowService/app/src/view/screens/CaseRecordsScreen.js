import React from 'react';
import axios from 'axios';
import {useIsFocused} from '@react-navigation/native';
import {View, Text, Button, Input} from 'native-base';
import qs from 'qs';
import {ActivityIndicator, SafeAreaView, ScrollView} from 'react-native';
import {useSelector} from 'react-redux';
import COLORS from '../../styles/colors';
import globalStyles from '../../styles/styles';
import AppHeader from '../components/layouts/AppHeader';
import API from '../../conts/api';
import FONTS from '../../conts/fonts';
let caseRecordTimeout = null;
const CaseRecordsScreen = ({navigation}) => {
  const {data, code} = useSelector(state => state.userData);
  const [state, _] = React.useState({
    code: code,
    otp: code,
    phone: data?.phone,
    plate_number: data?.plate_number,
  });

  const [availableCase, setAvailableCase] = React.useState(null);
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) {
      getCaseRecord();
    } else {
      clearTimeout(caseRecordTimeout);
      setAvailableCase(null);
    }
  }, [isFocused]);

  //Get the case record from the server
  const getCaseRecord = async () => {
    clearTimeout(caseRecordTimeout);
    try {
      const res = await axios({
        url: API + '/old_cases.php',
        method: 'POST',
        data: qs.stringify(state),
      });

      const resData = res.data;
      console.log(resData);

      if (resData.statuscode == '00') {
        setAvailableCase(resData);
      } else {
        //Resend after 5sec if there is an error
        caseRecordTimeout = setTimeout(() => getCaseRecord(), 5000);
      }
    } catch (error) {
      console.log(error);
      //Resend after 5sec if there is an error
      caseRecordTimeout = setTimeout(() => getCaseRecord(), 5000);
    }
  };

  return (
    <SafeAreaView style={[globalStyles.safeAreaView, {paddingHorizontal: 0}]}>
      <AppHeader data={data} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginVertical: 40, marginHorizontal: 20}}>
          <View>
            {!availableCase ? (
              <View style={globalStyles.card}>
                <View style={{marginTop: 10}}>
                  <Text
                    style={{
                      marginVertical: 5,
                      fontFamily: FONTS.bold,
                    }}>
                    Geting case please wait...
                  </Text>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              </View>
            ) : (
              <View>
                {availableCase.details.map((_case, index) => (
                  <View key={index}>
                    <View style={globalStyles.card}>
                      <Text
                        style={[
                          globalStyles.cardTitle,
                          {
                            color: COLORS.green,
                            fontWeight: 'bold',
                          },
                        ]}>
                        {_case?.tow_driver_name}
                      </Text>
                      <Text
                        style={[
                          globalStyles.cardTitle,
                          {fontSize: 16, color: COLORS.black, marginTop: 5},
                        ]}>
                        {_case?.date}
                      </Text>
                      <Text
                        style={[
                          globalStyles.cardTitle,
                          {fontSize: 14, color: COLORS.primary, marginTop: 5},
                        ]}>
                        {_case?.tow_company}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CaseRecordsScreen;
