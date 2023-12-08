// Work in progress (not finished).
// The goal is to have a superior free iOs/Android flashcard app
// with intelligent repitition of flashcards so that less familiar
// words are repeated with a higher frequency.
//

import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons"; // speaker icon
import * as Speech from "expo-speech"; // Text to speech

const flashcards = [
  {
    id: 1,
    german: "Hallo",
    de_irr: "",
    de_sent: "Er begrüßt ihn mit Hallo",
    english: "Hello",
    en_sent: "He greets him with Hello",
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
  {
    id: 4,
    german: "der Mensch",
    de_irr: "-en",
    de_sent: "Der Mensch ist das einzige Lebewesen mit Vernunft.",
    english: "the human",
    en_sent: "Humans are the only beings with reason.",
    points: 0,
  },
  {
    id: 5,
    german: "der Tisch",
    de_irr: "-e",
    de_sent: "Auf dem Tisch steht eine Vase.",
    english: "the table",
    en_sent: "There is a vase on the table.",
    points: 0,
  },

  // ... add more flashcards here
  // I have more created 5000+ flashcards on my private disk that
  // I am not showing here.
];

const FlashcardApp = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
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
    setDifficulty(null);
    setCurrentCardPoints(flashcards[randomIndex].points);
  };

  const handleSentencePronunciation = async () => {
    const germanSentence = flashcards[currentCardIndex].de_sent;
    await Speech.speak(germanSentence, { language: "de" });
  };

  useEffect(() => {
    Speech.stop(); // Stop any ongoing speech when component unmounts
  }, []);

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
            <View style={{ height: 20 }} />

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
                <TouchableOpacity
                  onPress={handleSentencePronunciation}
                  style={styles.sentenceSpeakerIcon}
                >
                  <Feather name="volume-2" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
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
    marginBottom: 10,
    position: "relative", // Add this line
  },
  difficultyButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    position: "absolute",
    bottom: 50,
  },
  wordSpeakerContainer: {
    position: "absolute", // Add this line
    marginTop: 15, // Add this line
    right: 5, // Add this line
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
  sentenceSpeakerIcon: {
    // You can add styles specific to the sentence speaker icon here if needed
  },
});

export default FlashcardApp;
