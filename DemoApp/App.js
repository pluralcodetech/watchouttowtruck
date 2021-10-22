import React from 'react';
import {Text, View} from 'react-native';

const App = () => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
      <Text style={{fontSize: 40}}>Default Font</Text>
      <Text style={{fontSize: 40, fontFamily: 'Poppins-Regular'}}>
        Custom Font
      </Text>
      <Text style={{fontSize: 40, fontFamily: 'Poppins-Bold'}}>
        Custom Font Bold
      </Text>
    </View>
  );
};

export default App;
