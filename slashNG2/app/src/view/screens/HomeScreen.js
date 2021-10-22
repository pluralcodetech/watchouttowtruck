import React from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {Container, Text} from 'native-base';
import Header from '../layouts/home/Header';
const HomeScreen = () => {
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container>
          <Header />
          <View style={{alignItems: 'center', marginTop: 20}}>
            <Text style={{fontSize: 22, fontWeight: 'bold'}}>
              Browse Categories
            </Text>
          </View>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
