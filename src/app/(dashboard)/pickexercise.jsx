import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import BackButton from "../../components/BackButton";
import HomeTopBar from "../../components/HomeTopBar";
import Spacer from "../../components/Spacer";
import ThemeText from "../../components/ThemeText";
import ThemeView from "../../components/ThemeView";

const exercises = {
  Chest: ["Bench Press", "Incline Dumbbell Press", "Chest Fly", "Push-Ups"],
  Back: ["Pull-ups", "Lat Pulldown", "Barbell Row", "Seated Cable Row"],
  Legs: [
    "Squat",
    "Leg Press",
    "Romanian Deadlift (RDL)",
    "Deadlift",
    "Leg Extension",
  ],
  Shoulders: [
    "Shoulder Press",
    "Lateral Raises",
    "Rear Delt Fly",
    "Arnold Press",
  ],
  Arms: ["Bicep Curl", "Hammer Curl", "Triceps Pushdown", "Skull Crushers"],
  Core: ["Plank", "Cable Crunch", "Hanging Leg Raise", "Russian Twists"],
};

export default function PickExerciseScreen() {
  const params = useLocalSearchParams();

  const muscles = useMemo(() => {
    try {
      return params.muscles ? JSON.parse(params.muscles) : [];
    } catch {
      return [];
    }
  }, [params.muscles]);

  const availableExercises = muscles.flatMap((muscle) =>
    exercises[muscle]
      ? exercises[muscle].map((name) => ({
          name,
          muscleGroup: muscle,
        }))
      : [],
  );

  const handleSelectExercise = (exercise) => {
    router.push({
      pathname: "/addexercises",
      params: {
        ...params,
        selectedExercise: JSON.stringify(exercise),
        selectedDay: params.day,
        selectedSlotIndex: params.slotIndex,
      },
    });
  };

  return (
    <ThemeView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <HomeTopBar />

        <BackButton
          style={styles.backButton}
          backTo={{
            pathname: "/addexercises",
            params: {
              ...params,
            },
          }}
        />

        <ThemeText title={true} style={styles.heading}>
          Choose Exercise
        </ThemeText>

        <ThemeText style={styles.subheading}>
          Pick an exercise for {params.day}
        </ThemeText>

        <Spacer height={25} />

        {availableExercises.map((exercise, index) => (
          <TouchableOpacity
            key={`${exercise.name}-${index}`}
            style={styles.exerciseCard}
            onPress={() => handleSelectExercise(exercise)}
          >
            <ThemeText style={styles.exerciseName}>{exercise.name}</ThemeText>
            <ThemeText style={styles.muscleText}>
              {exercise.muscleGroup}
            </ThemeText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 135,
    paddingBottom: 80,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subheading: {
    width: "80%",
    textAlign: "center",
    marginTop: 10,
  },
  exerciseCard: {
    width: "85%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  muscleText: {
    fontSize: 13,
    marginTop: 4,
    opacity: 0.8,
  },
});
