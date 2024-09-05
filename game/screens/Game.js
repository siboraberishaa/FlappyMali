import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, useWindowDimensions, View, Button, StyleSheet, Text as Ttext, BackHandler } from 'react-native';
import { Canvas, useImage, Image, Group, Text, matchFont, Skia, Path } from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  withSequence,
  useFrameCallback,
  useDerivedValue,
  interpolate,
  Extrapolation,
  useAnimatedReaction,
  runOnJS,
  cancelAnimation,
  withRepeat,
  useAnimatedStyle
} from 'react-native-reanimated';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Modal from '../components/Modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const GRAVITY = 1000;
const JUMP_FORCE = -500;

const pipeWidth = 104;
const pipeHeight = 620;



const Game = () => {

  const navigation = useNavigation()

  const { width, height } = useWindowDimensions();
  const [score, setScore] = useState(0);
  const [showRestartButton, setShowRestartButton] = useState(false); // State for showing the restart button
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [characterKey, setCharacterKey] = useState("blue-bird"); // Store the key instead of the image path

  const characterImages = {
    "blue-bird": require("../assets/sprites/blue-bird.png"),
    "ch-5": require("../assets/sprites/ch-5.png"),
    "ch-2": require("../assets/sprites/ch-2.png"),
    "ch-3": require("../assets/sprites/ch-3.png"),
    "ch-4": require("../assets/sprites/ch-4.png"),
    "ch-1": require("../assets/sprites/ch-1.png"),
  };
  

  // const bg = useImage(require('./assets/sprites/background-day-3.png'));
  const bg = useImage(require('../assets/sprites/background-day-finale.png'));
  const clouds = useImage(require('../assets/sprites/clouds-finale-4.png'));
  const birdImage = useImage(characterImages[characterKey]);
  const pipeBottom = useImage(require('../assets/sprites/pipe-green.png'));
  const pipeTop = useImage(require('../assets/sprites/pipe-green-top.png'));
  const base = useImage(require('../assets/sprites/base-4.png'));
  const message = useImage(require('../assets/sprites/message-4.png'));

  const flashOpacity = useSharedValue(0); // For flash effect
  const gameOver = useSharedValue(false);
  const pipeX = useSharedValue(width);

  const birdY = useSharedValue(height / 3);
  const birdX = width / 4;
  const birdYVelocity = useSharedValue(0);

  const pipeOffset = useSharedValue(0);
  const topPipeY = useDerivedValue(() => pipeOffset.value - 340);
  const bottomPipeY = useDerivedValue(() => height - 310 + pipeOffset.value);

  const cloudX = useSharedValue(0);

  useEffect(() => {
    const backAction = () => {
      // Prevent the default back action
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  
  useEffect(() => {
    const loadCharacter = async () => {
      try {
        const storedCharacterKey = await AsyncStorage.getItem("character");
        if (storedCharacterKey && characterImages[storedCharacterKey]) {
          setCharacterKey(storedCharacterKey);
        } else {
          setCharacterKey("blue-bird"); // Default if not found
        }
      } catch (error) {
        console.error("Error loading character from AsyncStorage:", error);
        setCharacterKey("blue-bird"); // Fallback to default
      }
    };

    loadCharacter();
  }, []);


  useEffect(() => {
    // Load high score from AsyncStorage when the game starts
    const loadHighScore = async () => {
      try {
        const storedHighScore = await AsyncStorage.getItem('highScore');
        if (storedHighScore !== null) {
          setHighScore(parseInt(storedHighScore, 10));
        }
      } catch (error) {
        console.error('Failed to load high score:', error);
      }
    };

    loadHighScore();
  }, []);

  const saveHighScore = async (newHighScore) => {
    try {
      await AsyncStorage.setItem('highScore', newHighScore.toString());
      setHighScore(newHighScore);
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  };



  const flashStyle = useAnimatedStyle(() => {
    return {
      opacity: flashOpacity.value,
    };
  });


  const triggerFlash = () => {
    flashOpacity.value = withTiming(1, { duration: 100 }, () => {
      flashOpacity.value = withTiming(0, { duration: 900 });
    });
  };

  // Function to set gravity to zero and animate bird to the ground
  const setGravityToZero = () => {
    birdYVelocity.value = 0; // Set gravity to zero
    birdY.value = withTiming(height - 75 - 38, { duration: 1000 }); // Animate bird to ground
  };


  const pipesSpeed = useDerivedValue(() => {
    return interpolate(score, [0, 20], [1, 2]);
  });

  const obstacles = useDerivedValue(() => [
    {
      x: pipeX.value,
      y: bottomPipeY.value,
      h: pipeHeight,
      w: pipeWidth,
    },
    {
      x: pipeX.value,
      y: topPipeY.value,
      h: pipeHeight,
      w: pipeWidth,
    },
  ]);



  useEffect(() => {
    if(gameStarted) {
      startGame()
    }
  }, [gameStarted]);





  const moveClouds = () => {
    'worklet';
    cloudX.value = withRepeat(
      withTiming(-width, {
        duration: 10000, // Duration for clouds to move across the screen
        easing: Easing.linear,
      }),
      -1,
      false // No yoyo effect; it resets to the start position after moving left
    );
  };

  
  
  

  const startGame = () => {
    if (!gameStarted) return; // Only start game mechanics if game has started

    console.log('Starting game: Moving the pipes');

    cloudX.value = width;

    moveClouds()
    // Delay the start of the pipes
    setTimeout(() => {
      if (!gameOver.value) {
        moveTheMap();
      }
    }, 3000);
  };

  const moveTheMap = () => {
    if (gameOver.value) return; // Don't move pipes if the game is over

    console.log('Moving pipes across the screen');
    pipeX.value = withSequence(
      withTiming(width, { duration: 0 }),
      withTiming(-150, {
        duration: 3000 / pipesSpeed.value,
        easing: Easing.linear,
      }),
      withTiming(width, { duration: 0 })
    );
  };

  // Scoring system
  useAnimatedReaction(
    () => pipeX.value,
    (currentValue, previousValue) => {
      if (gameOver.value) return; // Stop processing when the game is over

      const middle = birdX;

      if (previousValue && currentValue < -100 && previousValue > -100) {
        pipeOffset.value = Math.random() * 400 - 200;
        cancelAnimation(pipeX);
        // cancelAnimation(cloudX)
        runOnJS(moveTheMap)();
      }

      if (
        currentValue !== previousValue &&
        previousValue &&
        currentValue <= middle &&
        previousValue > middle
      ) {
        runOnJS(setScore)(score + 1);
      }
    }
  );

  const isPointCollidingWithRect = (point, rect) => {
    'worklet';
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.w &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.h
    );
  };

  
  useAnimatedReaction(
    () => birdY.value,
    (currentValue) => {
      const center = {
        x: birdX + 32,
        y: currentValue + 24,
      };

      if (currentValue > height - 100 || currentValue < 0) {
        if (!gameOver.value) {
          gameOver.value = true;
          runOnJS(triggerFlash)(); // Trigger flash when game is over
          runOnJS(setGravityToZero)(); // Make the bird fall after flash
          runOnJS(setShowRestartButton)(true);
        }
      }

      const isColliding = obstacles.value.some((rect) =>
        isPointCollidingWithRect(center, rect)
      );
      if (isColliding) {
        if (!gameOver.value) {
          gameOver.value = true;
          runOnJS(triggerFlash)(); // Trigger flash on collision
          runOnJS(setShowRestartButton)(true);
          runOnJS(setGravityToZero)(); // Make the bird fall after flash
        }
      }
    }
  );

  useAnimatedReaction(
    () => gameOver.value,
    (currentValue, previousValue) => {
      if (currentValue && !previousValue) {
        // Game over logic
        cancelAnimation(pipeX);
        cancelAnimation(birdY);
        cancelAnimation(cloudX);
        birdYVelocity.value = 2000;

        // Check if current score is higher than the stored high score
        if (score > highScore) {
          runOnJS(saveHighScore)(score); // Save the new high score
        }

        // runOnJS(setShowRestartButton)(true); // Show restart button
      }
    }
  );

  useFrameCallback(({ timeSincePreviousFrame: dt }) => {
    if (!dt || gameOver.value || !gameStarted) {
      return;
    }
    birdY.value = birdY.value + (birdYVelocity.value * dt) / 1000;
    birdYVelocity.value = birdYVelocity.value + (GRAVITY * dt) / 1000;
  });
  
  
//   const groundDebug = Skia.Path.Make();
// groundDebug.addRect(Skia.XYWHRect(0, height - 100, width, 5)); // A 5px high line representing the ground
  

  const restartGame = () => {
    'worklet';
    console.log('Restarting game');
    birdY.value = height / 3;
    birdYVelocity.value = 0;
    gameOver.value = false;
    pipeX.value = width;
    cloudX.value = width;
    pipeOffset.value = 0; // Reset pipe offset
    runOnJS(setScore)(0);
    runOnJS(setShowRestartButton)(false); // Hide restart button

    // Restart the game after delay
    runOnJS(startGame)();
  };

  const gesture = Gesture.Tap().onStart(() => {
  if (!gameStarted) {
    // First tap: start the game
    console.log('Game started with first tap');
    runOnJS(setGameStarted)(true);
    birdYVelocity.value = JUMP_FORCE;
    runOnJS(startGame)(); // Start the game mechanics
  } else if (!gameOver.value) {
    // Subsequent taps: apply jump force
    birdYVelocity.value = JUMP_FORCE;
  }
});

  

  const birdTransform = useDerivedValue(() => {

    if (gameOver.value) {
      // Rotate the bird to point straight down on game over
      return [{ rotate: Math.PI / 2 }];
    }


    return [
      {
        rotate: interpolate(
          birdYVelocity.value,
          [-500, 0],
          [0.2, 0],
          Extrapolation.CLAMP
        ),
      },
    ];
  });

  const birdOrigin = useDerivedValue(() => {
    return { x: width / 4 + 32, y: birdY.value + 24 };
  });

  const fontFamily = Platform.select({ ios: 'Helvetica', default: 'Helvetica' });
  const fontStyle = {
    fontFamily,
    fontSize: 60,
    fontWeight: 'bold',
  };
  const font = matchFont(fontStyle);

  const paint = Skia.Paint();
  paint.setColor(Skia.Color('white'));
  

  return (
    <GestureHandlerRootView style={{ flex: 1}}>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ width, height }}>
        <StatusBar backgroundColor='#000' />
          {/* Render blue background */}
          <Image image={bg} width={width} height={height} fit={'cover'} />

          {/* Render first moving clouds */}
          
          <Image image={clouds} x={cloudX} width={gameStarted ? width : 0} height={gameStarted ? height : 0} fit={'contain'} />


        

          {/* Pipes */}
          <Image
            image={pipeTop}
            y={topPipeY}
            x={pipeX}
            width={pipeWidth}
            height={pipeHeight}
          />
          <Image
            image={pipeBottom}
            y={bottomPipeY}
            x={pipeX}
            width={pipeWidth}
            height={pipeHeight}
          />


        {/* <Path path={groundDebug} color="red" /> */}

          <Image
            image={base}
            width={width}
            height={200}
            y={height - 100}
            x={0}
            fit={'cover'}
          />



          <Group transform={birdTransform} origin={birdOrigin}>
            <Image image={birdImage} y={birdY} x={birdX} width={64} height={38} />
          </Group>
            
        {!gameStarted && (
          <Image
            image={message}
            x={birdX - 20} 
            y={birdY.value + 40}
            width={120}
            height={90}
            fit={'cover'}
          />
        )}

          

        </Canvas>




      </GestureDetector>
        {!showRestartButton && <Ttext style={{position: 'absolute',
                      top: 100,
                      left: width / 2 - 30,
                      fontSize: 50,
                      // fontWeight: 'bold',
                      fontFamily: 'Flappy-Bird',
                      color: '#000',
                      }}>{score.toString()}</Ttext>}

      
      <Animated.View style={[StyleSheet.absoluteFillObject, flashStyle, { backgroundColor: '#fff' }]} />
        
      

      <Modal setModalVisible={setShowRestartButton} highScore={highScore} modalVisible={showRestartButton} score={score} restartGame={restartGame} />
    </GestureHandlerRootView>
  )
}
export default Game
