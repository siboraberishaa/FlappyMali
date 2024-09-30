import {
    StyleSheet,
    Text,
    View,
    Modal as Modall,
    TouchableOpacity,
  } from "react-native";
  import React from "react";
import { useNavigation } from "@react-navigation/native";
  
  const Modal = ({ modalVisible, highScore, setModalVisible, score, restartGame }) => {

    const navigation = useNavigation()


    return (
      <Modall animationType="slide" transparent={true} visible={modalVisible}>
        <View style={[styles.container, { position: "relative" }]}>
            <Text style={styles.modalText2}>Game Over</Text>
          <View style={styles.modalView}>
            
            
            <Text style={styles.modalText}>Score</Text>
            <Text style={styles.modalNumber}>{score.toString()}</Text>
            <Text style={styles.modalText}>High Score</Text>
            <Text style={styles.modalNumber}>{highScore.toString()}</Text>
            <View style={styles.btnView}>


                <TouchableOpacity onPress={() => restartGame()} style={[styles.button, styles.buttonOpen, {marginTop: 30}]}>
                  <Text style={styles.buttonText}>Restart game</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                onPress={() => {setModalVisible(false),
                    navigation.navigate('Home')}}
                style={[styles.button, styles.buttonOpen]}>
                  <Text style={styles.buttonText}>Go back home</Text>
                </TouchableOpacity>
            </View>
  
            
          </View>
        </View>
      </Modall>
    );
  };
  
  export default Modal;
  
  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flex: 1,
      backgroundColor: "rgba(255,255,255,.4)",
      justifyContent: "center",
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 7,
      padding: 10,
      marginTop: 10
    },
    buttonOpen: {
      backgroundColor: "#2196F3",
      borderWidth: 1,
      borderWidth: 0
    },
    buttonClose: {
      padding: 8,
      backgroundColor: "#AA0000",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 16,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 16,
      
    },
    modalText: {
      paddingBottom: 5,
      paddingTop: 10,
      textAlign: "center",
      fontSize: 50,
      fontFamily: 'Flappy-Birdy'
    },
    modalText2: {
      textAlign: "center",
      fontSize: 80,
      fontFamily: 'Flappy-Birdy'
    },
    modalNumber: {
      paddingBottom: 5,
      paddingTop: 10,
      textAlign: "center",
      fontSize: 40,
    //   fontWeight: 'bold'
    fontFamily: 'Flappy-Bird'
    },
    btnView: {
      width: "100%",
      display: "flex",
    },
  });
  