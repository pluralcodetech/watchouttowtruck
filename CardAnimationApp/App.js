import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  TextInput,
  Animated,
  PanResponder,
} from 'react-native';
const {width, height} = Dimensions.get('screen');

const App = () => {
  const cardsList = [
    {id: 1, title: 'Card1', color: 'red'},
    {id: 2, title: 'Card1', color: 'purple'},
    {id: 3, title: 'Card1', color: 'blue'},
    {id: 4, title: 'Card1', color: 'pink'},
  ];
  const Card = ({item, index}) => {
    const reverseIndex = cardsList.length - 1 - index;
    const testScale = 1 - reverseIndex * 0.1;
    const pan = React.useRef(new Animated.ValueXY()).current;
    const translateX = React.useRef(
      new Animated.Value(index + 22 * reverseIndex),
    ).current;
    const scale = React.useRef(new Animated.Value(1 - reverseIndex * 0.1))
      .current;
    const tScale = pan.x.interpolate({
      inputRange: [-width / 2, 0, width / 2],
      outputRange: [0, 0.5, 1],
      extrapolate: 'clamp',
    });
    const rotate = pan.x.interpolate({
      inputRange: [-width / 2, 0, width / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp',
    });
    const nextCardOpacity = pan.x.interpolate({
      inputRange: [-width / 2, 0, width / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp',
    });
    const panResponder = React.useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          console.log(cardsList.length - 1 == index);
          if (cardsList.length - 1 == index) {
            pan.setOffset({
              x: pan.x._value,
              y: pan.y._value,
            });
          }
        },
        onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}]),
        onPanResponderRelease: (evt, gestureState) => {
          console.log(gestureState.dx);
          if (gestureState.dx > 120) {
            console.log('ok');
            Animated.spring(pan, {
              toValue: {x: width + 1000, y: gestureState.dy},
              duration: 20,
              useNativeDriver: true,
            }).start();
          } else if (gestureState.dx < -120) {
            Animated.spring(pan, {
              toValue: {x: width - 1000, y: gestureState.dy},
              duration: 20,
              useNativeDriver: true,
            }).start();
            console.log('noi');
          } else {
            console.log(index);
            Animated.spring(pan, {
              toValue: {x: 0, y: 0},
              duration: 20,
              useNativeDriver: true,
            }).start();
          }
          pan.flattenOffset();
        },
      }),
    ).current;

    return (
      <Animated.View
        style={{
          zIndex: index,
          position: 'absolute',
          width,
          padding: 20,
          transform: [{translateX: pan.x}, {translateY: pan.y}, {rotate}],
        }}
        {...panResponder.panHandlers}>
        <Animated.View
          style={{
            margin: 20,
            height: 350,
            width: width * 0.7,
            paddingHorizontal: 20,
            borderRadius: 25,
            backgroundColor: item.color,
            borderRadius: 2,
            borderRadius: 20,
            opacity: nextCardOpacity,
            transform: [{translateX}, {scale}],
          }}
        />
      </Animated.View>
    );
  };
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 0,
        flex: 1,
      }}>
      {cardsList.reverse().map((item, index) => (
        <Card item={item} index={index} key={index} />
      ))}
    </View>
  );
};

export default App;
