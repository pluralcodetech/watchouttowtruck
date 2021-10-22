import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Modal,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
const ModalPopup = ({visible, children}) => {
  const [showModal, setShowModal] = React.useState(visible);
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    toggleModal();
  }, [visible]);

  const toggleModal = () => {
    if (visible) {
      setShowModal(visible);
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setTimeout(() => setShowModal(visible), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackground}>
        <Animated.View
          style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const App = () => {
  const [visible, setVisible] = React.useState(false);
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ModalPopup visible={visible}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Image
                source={require('./assets/x.png')}
                style={{height: 30, width: 30}}
              />
            </TouchableOpacity>
          </View>
          <Image
            source={require('./assets/success.png')}
            style={{height: 150, width: 150, marginVertical: 10}}
          />
          <Text
            style={{
              marginVertical: 30,
              fontSize: 20,
              textAlign: 'center',
            }}>
            Congratulations registration was successful
          </Text>
        </View>
      </ModalPopup>
      <Button title="Open Modal" onPress={() => setVisible(true)} />
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default App;
