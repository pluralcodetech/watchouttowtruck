import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import {
  Container,
  Text,
  Input,
  Item,
  Label,
  Button,
  Toast,
  Root,
} from 'native-base';
import styles from '../../../styles';
import PreLoader from '../../components/modals/PreLoader';
import {useSelector, useDispatch} from 'react-redux';
import {userDataAction} from '../../../redux/actions';

const MainScreen = ({navigation}) => {
  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();
  React.useEffect(() => {});
  return (
    <Root>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginTop: 200}}></View>
          <View style={{flex: 1, padding: 20}}>
            <Button
              block
              style={style.button}
              onPress={() => navigation.navigate('SignInScreen')}>
              <Text>SIGNIN</Text>
            </Button>
            <Button
              block
              danger
              style={style.button}
              onPress={() => navigation.navigate('SignUpScreen')}>
              <Text>SIGNUP</Text>
            </Button>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Root>
  );
};

const style = StyleSheet.create({button: {marginBottom: 10}});
export default MainScreen;
