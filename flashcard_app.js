// Work in progress (not finished).
// The goal is to have a superior free iOs/Android flashcard app
// with intelligent repitition of flashcards so that less familiar
// words are repeated with a higher frequency.
//

import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const flashcards = [
  {
    id: 1,
    german: "Hallo",
    de_sent: "Er begrüßt ihn mit Hallo",
    english: "Hello",
    en_sent: "He greets him with Hello",
    points: 0,
  },
  {
    id: 2,
    german: "essen",
    de_sent: "Er isst gerne Pommes mit Mayonnaise.",
    english: "to eat",
    en_sent: "He likes to eat French fries with mayonnaise",
    points: 0,
  },
  {
    id: 3,
    german: "das Boot",
    de_sent: "Das Boot fährt auf dem Wasser.",
    english: "the boat",
    en_sent: "The boat is sailing on the water.",
    points: 0,
  },
  {
    id: 4,
    german: "der Mensch",
    de_sent: "Der Mensch ist das einzige Lebewesen mit Vernunft.",
    english: "the human",
    en_sent: "Humans are the only beings with reason.",
    points: 0,
  },
  {
    id: 5,
    german: "der Tisch",
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
              </Text>
              <Text style={styles.sentenceText}>
                {flashcards[currentCardIndex].de_sent}
              </Text>
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
    backgroundColor: "darkgray",
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
  },
  difficultyButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
    marginBottom: 0,
  },
});

export default FlashcardApp;
