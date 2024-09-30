import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import CharacterModal from '../components/CharacterModal';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);


  return (
    <View style={styles.container}>
      {/* Clouds Image */}
      <Image
        source={require('../assets/sprites/clouds-finale-4.png')}
        resizeMode="contain"
        style={styles.cloudImage}
      />

      {/* Title Text and Bird Image Inline */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>FlappyMali</Text>
        <Image
          source={require('../assets/sprites/blue-bird.png')}
          resizeMode="contain"
          style={styles.birdImage}
        />
      </View>

      {/* Buttons Inline */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => {
          setModalVisible(true)}} style={styles.button}>
          <Text style={styles.buttonText}>Select Character</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Game');
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
      </View>

      {modalVisible && <CharacterModal modalVisible={modalVisible} setModalVisible={setModalVisible} />}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#87ceeb',
  },
  cloudImage: {
    width: 700,
    height: 720,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: '40%',
  },
  titleText: {
    fontFamily: 'Flappy-Birdy',
    fontSize: 90,
    color: '#fff',
  },
  birdImage: {
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
  buttonText: {
    fontSize: 20,
    color: '#87ceeb',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
