import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Speech from "expo-speech";

// I have more flashcards in my private environment.
const flashcards = [
  {
    id: 1,
    german: "das Huhn",
    de_irr: " ̈-er",
    de_sent: "Gestern haben wir das Huhn im Ofen gebacken.",
    ch: "das Poulet, -s",
    ch_sent: "Gestern haben wir das Poulet im Ofen gebacken.",
    english: "the chicken",
    en_sent: "Yesterday, we baked the chicken in the oven.",
  },
  {
    id: 2,
    german: "essen",
    de_irr: "isst, aß, hat gegessen",
    de_sent: "Er isst gerne Pommes mit Mayonnaise.",
    english: "to eat",
    en_sent: "He likes to eat French fries with mayonnaise.",
  },
  {
    id: 3,
    german: "das Boot",
    de_irr: "-e",
    de_sent: "Das Boot fährt auf dem Wasser.",
    english: "the boat",
    en_sent: "The boat is sailing on the water.",
  },
];

const initialRatings = flashcards.map((card) => ({
  id: card.id,
  reviews: 0,
  lastReviewed: null,
  nextReview: null,
  reviewedToday: false, // New property
}));

const calculateNextReviewDate = (rating, lastReviewed) => {
  const intervals = {
    easy: 5, // days until next review if easy
    correct: 3, // days if correct
    hard: 1, // days if hard
    fail: 0, // review again immediately if failed
  };

  const nextReviewDate = new Date(lastReviewed || new Date());
  nextReviewDate.setDate(nextReviewDate.getDate() + intervals[rating]);
  return nextReviewDate;
};

const FlashcardApp = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [ratings, setRatings] = useState(initialRatings);
  const [numCardsToReview, setNumCardsToReview] = useState(2);
  const [startScreenVisible, setStartScreenVisible] = useState(true);

  const resetReviewedToday = () => {
    setRatings(
      ratings.map((r) => ({
        ...r,
        reviewedToday: false,
      }))
    );
  };

  const handleShowTranslation = () => {
    setShowTranslation(true);
  };

  const handlePronunciation = async () => {
    const germanWord = flashcards[currentCardIndex].german;
    await Speech.speak(germanWord, { language: "de" });
  };

  const handleSentencePronunciation = async () => {
    const germanSentence = flashcards[currentCardIndex].de_sent;
    await Speech.speak(germanSentence, { language: "de" });
  };

  const updateRating = (rating) => {
    setRatings(
      ratings.map((r) => {
        if (r.id === flashcards[currentCardIndex].id) {
          const newLastReviewed = new Date();
          return {
            ...r,
            reviews: r.reviews + 1,
            lastReviewed: newLastReviewed,
            nextReview: calculateNextReviewDate(rating, newLastReviewed),
            reviewedToday: true,
          };
        }
        return r;
      })
    );

    handleNextCard();
  };

  const handleNextCard = () => {
    const reviewedCount = ratings.filter((r) => r.reviewedToday).length;
    if (reviewedCount >= numCardsToReview) {
      alert("Review session complete for today!");
      return;
    }

    // Logic to select the next card
    let nextCardIndex = -1;
    let minNextReviewDate = new Date(8640000000000000); // A distant future date

    for (let i = 0; i < flashcards.length; i++) {
      const cardRating = ratings.find((r) => r.id === flashcards[i].id);
      if (!cardRating.reviewedToday && cardRating.nextReview <= new Date()) {
        if (cardRating.nextReview < minNextReviewDate) {
          minNextReviewDate = cardRating.nextReview;
          nextCardIndex = i;
        }
      }
    }

    if (nextCardIndex === -1) {
      // If no cards are due for review, randomly select a card
      nextCardIndex = Math.floor(Math.random() * flashcards.length);
    }

    setCurrentCardIndex(nextCardIndex);
    setShowTranslation(false);
  };

  const handleStart = () => {
    resetReviewedToday();
    setStartScreenVisible(false);
  };

  if (startScreenVisible) {
    return (
      <View style={styles.container}>
        <Text style={styles.input}>Enter the number of cards to review:</Text>
        <TextInput
          style={styles.input} //
          onChangeText={(text) => {
            // Check if the text is empty, and if so, set numCardsToReview to 0 or a default value
            // to prevent NaN on screen
            const num = text === "" ? 0 : parseInt(text, 10);
            setNumCardsToReview(num);
          }}
          keyboardType="numeric"
          defaultValue="2"
          value={String(numCardsToReview)}
        />
        <Button title="Start Review" color="white" onPress={handleStart} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!showTranslation && (
        <View style={[styles.card, { backgroundColor: "#495a8d" }]}>
          <Text style={styles.cardText}>
            {flashcards[currentCardIndex].english}
          </Text>
        </View>
      )}

      {showTranslation && (
        <View>
          {/* English Box */}
          <View style={[styles.card, { backgroundColor: "#495a8d" }]}>
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
          <View style={styles.card}>
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
                <Feather name="volume-2" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.sentenceSpeakerContainer}>
              <TouchableOpacity onPress={handleSentencePronunciation}>
                <Feather name="volume-2" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Whitespace */}
          <View style={{ height: 10 }} />

          {/* Schweizer Hochdeutsch Box */}
          {flashcards[currentCardIndex].ch && (
            <View style={styles.card}>
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

      {!showTranslation && (
        <Button title="Flip" color="white" onPress={handleShowTranslation} />
      )}

      {showTranslation && (
        <View style={styles.buttonContainer}>
          <Button
            title="Easy"
            color="white"
            onPress={() => updateRating("easy")}
          />
          <Button
            title="Correct"
            color="white"
            onPress={() => updateRating("correct")}
          />
          <Button
            title="Hard"
            color="white"
            onPress={() => updateRating("hard")}
          />
          <Button
            title="Fail"
            color="white"
            onPress={() => updateRating("fail")}
          />
        </View>
      )}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#191c53",
  },
  cardText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginLeft: 20,
    marginRight: 20,
  },
  sentenceText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
    color: "white",
  },
  card: {
    backgroundColor: "#4d64ff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    position: "relative",
  },
  wordSpeakerContainer: {
    position: "absolute",
    marginTop: 13,
    right: 10,
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
  swissFlag: {
    width: 20,
    height: 20,
    position: "absolute",
    marginTop: 25,
    marginLeft: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    position: "absolute",
    bottom: 50,
  },
  input: {
    fontSize: 20,
    marginTop: 5,
    marginBottom: 20,
    color: "white",
  },
});

export default FlashcardApp;
