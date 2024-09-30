import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal as Modall,
  TouchableOpacity,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const CharacterModal = ({ modalVisible, setModalVisible }) => {

    const navigation = useNavigation()

  const [loading, setLoading] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const characters = {
    mali: "blue-bird",
    hana: "ch-5",
    fatime: "ch-2",
    taulit: "ch-3",
    saranda: "ch-4",
    aria: "ch-1",
  };

  useEffect(() => {
    const loadSelectedCharacter = async () => {
      try {
        const character = await AsyncStorage.getItem("character");
        setSelectedCharacter(character);
      } catch (error) {
        console.error("Error loading character from AsyncStorage:", error);
      }
    };

    if (modalVisible) {
      loadSelectedCharacter();
    }
  }, [modalVisible]);

  const selectCharacter = async (characterKey) => {
    setLoading(true); // Start loading
    try {
      await AsyncStorage.setItem("character", characterKey);
      setSelectedCharacter(characterKey); // Update selected character
    } catch (error) {
      console.error("Error saving character to AsyncStorage:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const renderCharacterItem = (characterKey, characterName, imagePath) => (
    <TouchableOpacity
      onPress={() => selectCharacter(characterKey)}
      disabled={selectedCharacter === characterKey} // Disable if character is selected
      style={{ opacity: selectedCharacter === characterKey ? 0.5 : 1 }} // Reduce opacity if disabled
    >
      <View style={styles.characterItem}>
        <Image
          source={imagePath}
          resizeMode="contain"
          style={styles.characterImage}
        />
        {/* <Text style={styles.characterText}>{characterName}</Text> */}
      </View>
    </TouchableOpacity>
  );

  return (
    <>
    
    <Modall animationType="slide" transparent={true} visible={modalVisible}>
      <View style={[styles.container, { position: "relative" }]}>
        <View style={styles.modalView}>
          
            <View style={styles.characterGrid}>
              {renderCharacterItem(characters.mali, "Mali", require("../assets/sprites/blue-bird.png"))}
              {renderCharacterItem(characters.hana, "Hana", require("../assets/sprites/ch-5.png"))}
              {renderCharacterItem(characters.fatime, "Fatime", require("../assets/sprites/ch-2.png"))}
              {renderCharacterItem(characters.taulit, "Taulit", require("../assets/sprites/ch-3.png"))}
              {renderCharacterItem(characters.saranda, "Saranda", require("../assets/sprites/ch-4.png"))}
              {renderCharacterItem(characters.aria, "Aria", require("../assets/sprites/ch-1.png"))}
            </View>
        

                {/* <TouchableOpacity onPress={() => navigation.navigate('Game')} style={[styles.button, styles.buttonOpen, {marginTop: 20}]}>
                  <Text style={styles.buttonText}>Start Game</Text>
                </TouchableOpacity> */}

          <Pressable
            style={[styles.buttonClose, { position: "absolute", top: 0, right: 0 }]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.textStyle}>X</Text>
          </Pressable>
        </View>
      </View>
    </Modall>
    </>
  );
};

export default CharacterModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,.9)",
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
  characterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  characterItem: {
    alignItems: "center",
    marginBottom: 20,
  },
  characterImage: {
    width: 100,
    height: 100,
  },
  characterText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
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
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    
  },
});
