import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {View, Text} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();

const Screen1 = () => {
  return (
    <View>
      <Text>Screen1</Text>
    </View>
  );
};

const Screen2 = () => {
  return (
    <View>
      <Text>Screen2</Text>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          header: ({screen}) => (
            <View
              style={{
                height: 50,
                backgroundColor: 'red',
                width: '100%',
              }}>
              <Text>Screen Header</Text>
            </View>
          ),
        }}>
        <Drawer.Screen name="Screen1" component={Screen1} />
        <Drawer.Screen name="Screen2" component={Screen2} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
