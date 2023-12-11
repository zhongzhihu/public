import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Speech from "expo-speech";

// I have more flashcards on my private environment
const flashcards = [
  {
    id: 1,
    german: "das Huhn",
    de_irr: "-ü-er",
    de_sent: "Gestern haben wir das Huhn im Ofen gebacken.",
    ch: "das Poulet, -s",
    ch_sent: "Gestern haben wir das Poulet im Ofen gebacken.",
    english: "the chicken",
    en_sent: "Yesterday, we baked the chicken in the oven.",
    points: 0,
  },
  {
    id: 2,
    german: "essen",
    de_irr: "isst, aß, hat gegessen",
    de_sent: "Er isst gerne Pommes mit Mayonnaise.",
    english: "to eat",
    en_sent: "He likes to eat French fries with mayonnaise",
    points: 0,
  },
  {
    id: 3,
    german: "das Boot",
    de_irr: "-e",
    de_sent: "Das Boot fährt auf dem Wasser.",
    english: "the boat",
    en_sent: "The boat is sailing on the water.",
    points: 0,
  },
];

const FlashcardApp = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [currentCardPoints, setCurrentCardPoints] = useState(0);

  const handleShowTranslation = () => {
    setShowTranslation(true);
  };

  const handlePronunciation = async () => {
    const germanWord = flashcards[currentCardIndex].german;
    await Speech.speak(germanWord, { language: "de" });
  };

  const handleDifficulty = (points) => {
    const updatedFlashcards = [...flashcards];
    const updatedPoints = currentCardPoints + points;
    updatedFlashcards[currentCardIndex].points = updatedPoints;
    setCurrentCardPoints(updatedPoints);
    handleNextCard();
  };

  const handleNextCard = () => {
    const randomIndex = Math.floor(Math.random() * flashcards.length);
    setCurrentCardIndex(randomIndex);
    setShowTranslation(false);
    setCurrentCardPoints(flashcards[randomIndex].points);
  };

  const handleSentencePronunciation = async () => {
    const germanSentence = flashcards[currentCardIndex].de_sent;
    await Speech.speak(germanSentence, { language: "de" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pointCounter}>Points: {currentCardPoints}</Text>
      </View>

      <View style={styles.card}>
        {!showTranslation && (
          <Text style={styles.cardText}>
            {flashcards[currentCardIndex].english}
          </Text>
        )}

        {showTranslation && (
          <View>
            {/* English Box */}
            <View style={styles.translatedBox}>
              <Text style={styles.cardText}>
                {flashcards[currentCardIndex].english}
              </Text>
              <Text style={styles.sentenceText}>
                {flashcards[currentCardIndex].en_sent}
              </Text>
            </View>

            {/* Whitespace */}
            <View style={{ height: 10 }} />

            {/* German Box */}
            <View style={styles.translatedBox}>
              <Text style={styles.cardText}>
                {flashcards[currentCardIndex].german}
                {flashcards[currentCardIndex].de_irr
                  ? `, ${flashcards[currentCardIndex].de_irr}`
                  : ""}
              </Text>
              <Text style={styles.sentenceText}>
                {flashcards[currentCardIndex].de_sent}
              </Text>
              <View style={styles.wordSpeakerContainer}>
                <TouchableOpacity
                  onPress={handlePronunciation}
                  style={styles.wordSpeakerIcon}
                >
                  <Feather name="volume-2" size={24} color="black" />
                </TouchableOpacity>
              </View>
              <View style={styles.sentenceSpeakerContainer}>
                <TouchableOpacity onPress={handleSentencePronunciation}>
                  <Feather name="volume-2" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Whitespace */}
            <View style={{ height: 10 }} />

            {/* Schweizer Hochdeutsch Box*/}
            {flashcards[currentCardIndex].ch && (
              <View style={[styles.translatedBox, styles.swissBox]}>
                <Image
                  source={require("./swiss_flag.png")}
                  style={styles.swissFlag}
                />
                <Text style={styles.cardText}>
                  {flashcards[currentCardIndex].ch}
                </Text>
                <Text style={styles.sentenceText}>
                  {flashcards[currentCardIndex].ch_sent}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>

      {showTranslation && (
        <View style={styles.difficultyButtons}>
          <Button title="Easy" onPress={() => handleDifficulty(5)} />
          <Button title="Correct" onPress={() => handleDifficulty(1)} />
          <Button title="Hard" onPress={() => handleDifficulty(-2)} />
          <Button title="Fail" onPress={() => handleDifficulty(-5)} />
        </View>
      )}

      {!showTranslation && (
        <Button title="Flip" onPress={handleShowTranslation} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  pointCounter: {
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  cardText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  sentenceText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  translatedBox: {
    backgroundColor: "lightblue",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    position: "relative",
  },
  difficultyButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    position: "absolute",
    bottom: 50,
  },
  wordSpeakerContainer: {
    position: "absolute",
    marginTop: 15,
    right: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  sentenceSpeakerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  wordSpeakerIcon: {
    marginRight: 10,
    marginTop: 10,
  },
  swissBox: {
    backgroundColor: "lightblue",
  },
  swissFlag: {
    width: 20,
    height: 20,
  },
});

export default FlashcardApp;
