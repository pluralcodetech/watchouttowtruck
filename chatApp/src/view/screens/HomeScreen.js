import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../const/colors';
import recentChats from '../const/recentChats';
import stories from '../const/stories';

const ChatImage = ({image}) => {
  return (
    <View style={style.chatImageContainer}>
      <Image
        style={{
          height: '95%',
          width: '95%',
          borderRadius: 50,
        }}
        source={image}
      />
    </View>
  );
};

const StoriesImage = ({user}) => {
  return (
    <View style={style.storiesConatiner}>
      <ChatImage image={user.image} />
      <Text style={[style.displayName, {marginTop: 10}]}>
        {user.displayName}
      </Text>
    </View>
  );
};

const ChatList = ({chat}) => {
  return (
    <View style={{height: 60, flexDirection: 'row', marginBottom: 20}}>
      <ChatImage image={chat.image} />
      <View style={{flex: 1, paddingLeft: 10}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={style.displayName}>{chat.displayName}</Text>
          <Text
            style={{
              color: chat.unReadMessages > 0 ? COLORS.primary : COLORS.dark,
              opacity: chat.unReadMessages > 0 ? 1 : 0.7,
              fontSize: 12,
            }}>
            {chat.time}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            numberOfLines={2}
            style={{
              color: COLORS.dark,
              fontSize: 12,
              marginTop: 2,
              width: '85%',
              opacity: 0.7,
            }}>
            {chat.message}
          </Text>
          {chat.unReadMessages > 0 && (
            <View style={style.unReadTag}>
              <Text style={{fontSize: 10, color: COLORS.white}}>
                {chat.unReadMessages}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const HomeScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={style.header}>
        <Text style={{fontSize: 22, fontWeight: 'bold', color: COLORS.dark}}>
          Messages
        </Text>
        <Icon name="border-color" size={25} color={COLORS.primary} />
      </View>
      <View style={style.searchContainer}>
        <Icon name="search" size={25} color={COLORS.grey} />
        <TextInput placeholder="Search" />
      </View>
      <Text style={style.title}>Activities</Text>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: 20,
            paddingVertical: 0,
          }}>
          {stories.map((user, index) => (
            <StoriesImage user={user} key={index} />
          ))}
        </ScrollView>
      </View>
      <Text style={style.title}>Messages</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 20}}
        data={recentChats}
        renderItem={({item}) => <ChatList chat={item} />}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  storiesConatiner: {
    paddingRight: 20,
    alignItems: 'center',
  },
  displayName: {
    fontWeight: 'bold',
    color: COLORS.dark,
    fontSize: 14,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 20,
    color: COLORS.dark,
    marginVertical: 20,
  },
  searchContainer: {
    height: 45,
    backgroundColor: COLORS.light,
    borderRadius: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  chatImageContainer: {
    height: 65,
    width: 65,
    borderRadius: 35,
    borderColor: COLORS.primary,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unReadTag: {
    height: 23,
    width: 23,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
