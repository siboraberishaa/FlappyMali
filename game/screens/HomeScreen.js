import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CharacterModal from '../components/CharacterModal';

const HomeScreen = () => {
  const navigation = useNavigation();

  const [ modalVisible, setModalVisible ] = useState(false)

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
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
          <Text style={styles.buttonText}>Select Character</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Game')} style={styles.button}>
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
    height: 720,  // Increase the height for bigger clouds
  },
  titleContainer: {
    flexDirection: 'row',  // Align items horizontally
    alignItems: 'center',  // Center items vertically within the row
    position: 'absolute',
    top: '40%',  // Adjust this value to control how far below the clouds the text appears
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
    position: 'absolute',  // Use absolute positioning
    bottom: 100,  // Adjust this value for the desired button placement
    flexDirection: 'row',  // Align buttons horizontally
    justifyContent: 'space-between',  // Add space between the buttons
    width: '100%',  // Adjust the width as needed to control button spacing
  },
  button: {
    flex: 1,  // Allow buttons to equally share the space
    marginHorizontal: 10,  // Add horizontal spacing between buttons
    paddingVertical: 10,  // Vertical padding for button text
    paddingHorizontal: 10,
    backgroundColor: '#fff',  // Button background color (optional)
    alignItems: 'center',  // Center text within the button
    justifyContent: 'center',
    borderRadius: 7,  // Optional: rounded corners
  },
  buttonText: {
    // fontFamily: 'Flappy-Birdy',
    fontSize: 20,
    color: '#87ceeb',
    textAlign: 'center',
    fontWeight: 'bold'
  },
});
