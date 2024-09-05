import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen';
import {  Text, Platform,  View, StyleSheet, StatusBar } from 'react-native';
import Game from '../screens/Game';
import HomeScreen from '../screens/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();


const App = () => {

  const [loaded, error] = useFonts({
    'Flappy-Birdy': require('../assets/fonts/FlappyBirdy.ttf'),
    'Flappy-Bird': require('../assets/fonts/flappy-bird-font.ttf'),
    // 'Numbers': require('./assets/fonts/04B_19__.TTF')
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);


  useEffect(() => {
    const initializeCharacter = async () => {
      try {
        const character = await AsyncStorage.getItem("character");
        if (!character) {
          await AsyncStorage.setItem("character", "blue-bird"); // Set default key
        }
      } catch (error) {
        console.error("Error initializing character in AsyncStorage:", error);
      }
    };

    initializeCharacter();
  }, []);

  if (!loaded && !error) {
    return null;
  }
  
  return (
    <>
      <NavigationContainer independent={true}>
        <StatusBar backgroundColor={'#000'} />
      <Stack.Navigator>
         <Stack.Group screenOptions={{ headerShown: false }}>
           <Stack.Screen name="Home" component={HomeScreen} />
           <Stack.Screen name="Game" component={Game} />
          </Stack.Group>
      </Stack.Navigator>

      </NavigationContainer>
    </>
  );
};

export default App

  
