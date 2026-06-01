import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { ID, Permission, Query, Role } from "react-native-appwrite";

//lib--apwrite
import { config, databases } from "../../lib/appwrite";

//context
import { useUser } from "../../contexts/AuthContext";

//themed components
import BackButton from "../../components/BackButton";
import HomeTopBar from "../../components/HomeTopBar";
import Spacer from "../../components/Spacer";
import ThemeButton from "../../components/ThemeButton";
import ThemeText from "../../components/ThemeText";
import ThemeTextInput from "../../components/ThemeTextInput";
import ThemeView from "../../components/ThemeView";

export default function StartWorkoutScreen() {
  const params = useLocalSearchParams();
  const { user } = useUser();

  const [exercises, setExercises] = useState([]);
  const [workoutData, setWorkoutData] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const [saving, setSaving] = useState(false);
  const [program, setProgram] = useState(null);
  const [unit, setUnit] = useState("kg");
  const [autoWeightAdjustment, setAutoWeightAdjustment] = useState(false);
  const [workoutMotivators, setWorkoutMotivators] = useState(false);

  useEffect(() => {
    if (params.programId && params.day) {
      setExercises([]);
      setSuggestions({});
      setWorkoutData({});

      fetchProgram();
      fetchExercises();
      fetchUserSettings();
    }
  }, [params.programId, params.day]);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchUserSettings();
      }
    }, [user]),
  );

  const handleSaveWorkout = async () => {
    if (saving) return;

    setSaving(true);
    try {
      const workoutLogResponse = await databases.createDocument(
        config.databaseId,
        config.workoutLogsTableId,
        ID.unique(),
        {
          userid: user.$id,
          programId: params.programId,
          date: new Date().toISOString(),
        },
        [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ],
      );

      for (const exerciseId of Object.keys(workoutData)) {
        const exerciseSets = workoutData[exerciseId];

        for (const setNumber of Object.keys(exerciseSets)) {
          const setData = exerciseSets[setNumber];

          await databases.createDocument(
            config.databaseId,
            config.setsTableId,
            ID.unique(),
            {
              workoutLogId: workoutLogResponse.$id,

              exerciseId: exerciseId,

              setNumber: Number(setNumber),

              kg: Number(setData.kg || 0),

              reps: Number(setData.reps || 0),

              rpe: Number(setData.rpe || 0),
            },
            [
              Permission.read(Role.user(user.$id)),
              Permission.update(Role.user(user.$id)),
              Permission.delete(Role.user(user.$id)),
            ],
          );
        }
      }
      Alert.alert("Workout Saved!");

      await fetchSuggestions();

      setWorkoutData({});

      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Error saving workout");
    } finally {
      setSaving(false);
    }
  };

  const fetchProgram = async () => {
    try {
      const response = await databases.getDocument(
        config.databaseId,
        config.programsTableId,
        params.programId,
      );

      setProgram(response);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.exercisesTableId,
        [
          Query.equal("programid", params.programId),
          Query.equal("day", params.day),
        ],
      );

      const sortedExercises = response.documents.sort(
        (a, b) => a.order - b.order,
      );

      setExercises(sortedExercises);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (exercises.length > 0) {
      fetchSuggestions();
    }
  }, [exercises, unit]);

  const getSuggestion = (set) => {
    const kg = Number(set.kg || 0);
    const reps = Number(set.reps || 0);
    const rpe = Number(set.rpe || 0);

    if (rpe <= 7) {
      return `${kg + 2.5}${unit} x ${reps}`;
    }

    if (rpe === 8) {
      return `${kg}${unit} x ${reps + 1}`;
    }

    return `${Math.max(kg - 2.5, 0)} ${unit} x ${reps}`;
  };

  const fetchSuggestions = async () => {
    try {
      const newSuggestions = {};

      for (const exercise of exercises) {
        const response = await databases.listDocuments(
          config.databaseId,
          config.setsTableId,
          [
            Query.equal("exerciseId", exercise.$id),
            Query.orderDesc("$createdAt"),
            Query.limit(1),
          ],
        );

        if (response.documents.length > 0) {
          const lastSet = response.documents[0];

          newSuggestions[exercise.$id] = {
            last: `${lastSet.kg} ${unit} x ${lastSet.reps} RPE ${lastSet.rpe}`,
            next: getSuggestion(lastSet),
          };
        }
      }

      setSuggestions(newSuggestions);
    } catch (error) {
      console.log(error);
    }
  };
  const getTargetRpe = (trainingStyle) => {
    if (trainingStyle === "Slow & Steady (RPE 6-7)") {
      return "6-7";
    }

    if (trainingStyle === "The Sweet Spot (RPE 7-8)") {
      return "7-8";
    }

    if (trainingStyle === "Beast Mode (RPE 8-10)") {
      return "8-10";
    }

    return null;
  };

  const targetRpe = getTargetRpe(program?.trainingStyle);

  const fetchUserSettings = async () => {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.profilesTableId,
        [Query.equal("userid", user.$id)],
      );

      const profile = response.documents[0];

      if (profile) {
        setUnit(profile.unit || "kg");
        setAutoWeightAdjustment(profile.autoWeightAdjustment || false);
        setWorkoutMotivators(profile.workoutMotivators || false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const motivators = [
    "Today's goal: beat your last session.",
    "Small progress is still progress.",
    "Focus on consistency, not perfection.",
    "One more rep can make the difference.",
    "Train hard. Recover harder.",
  ];

  const motivator = motivators[new Date().getDate() % motivators.length];

  return (
    <ThemeView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <HomeTopBar />

        <BackButton
          style={styles.backButton}
          backTo={{
            pathname: "/workoutdetails",
            params: {
              programId: params.programId,
            },
          }}
        />

        <ThemeText title={true} style={styles.heading}>
          {params.day}
        </ThemeText>

        <Spacer height={8} />

        {workoutMotivators && (
          <ThemeText style={styles.motivatorText}>{motivator}</ThemeText>
        )}

        {targetRpe && (
          <>
            <ThemeText>Target RPE: {targetRpe}</ThemeText>
          </>
        )}

        <Spacer height={25} />

        {exercises.map((exercise) => (
          <ThemeView key={exercise.$id} style={styles.exerciseCard}>
            <ThemeText style={styles.exerciseName}>{exercise.name}</ThemeText>

            <Spacer height={15} />

            {suggestions[exercise.$id] && (
              <>
                <Spacer height={7} />

                <ThemeText>Last: {suggestions[exercise.$id].last}</ThemeText>

                {autoWeightAdjustment && (
                  <ThemeText>
                    Suggested: {suggestions[exercise.$id].next}
                  </ThemeText>
                )}
              </>
            )}

            <Spacer height={20} />

            {[1, 2, 3].map((set) => (
              <ThemeView key={set} style={styles.setRow}>
                <ThemeText style={styles.setLabel}>Set {set}</ThemeText>

                <ThemeTextInput
                  style={styles.input}
                  placeholder={unit.toUpperCase()}
                  keyboardType="numeric"
                  value={workoutData[exercise.$id]?.[set]?.kg || ""}
                  onChangeText={(text) =>
                    setWorkoutData((prev) => ({
                      ...prev,
                      [exercise.$id]: {
                        ...(prev[exercise.$id] || {}),
                        [set]: {
                          ...(prev[exercise.$id]?.[set] || {}),
                          kg: text,
                        },
                      },
                    }))
                  }
                />

                <ThemeTextInput
                  style={styles.input}
                  placeholder="Reps"
                  keyboardType="numeric"
                  value={workoutData[exercise.$id]?.[set]?.reps || ""}
                  onChangeText={(text) =>
                    setWorkoutData((prev) => ({
                      ...prev,
                      [exercise.$id]: {
                        ...(prev[exercise.$id] || {}),
                        [set]: {
                          ...(prev[exercise.$id]?.[set] || {}),
                          reps: text,
                        },
                      },
                    }))
                  }
                />

                <ThemeTextInput
                  style={styles.input}
                  placeholder={targetRpe ? `RPE ${targetRpe}` : "RPE"}
                  keyboardType="numeric"
                  value={workoutData[exercise.$id]?.[set]?.rpe || ""}
                  onChangeText={(text) =>
                    setWorkoutData((prev) => ({
                      ...prev,
                      [exercise.$id]: {
                        ...(prev[exercise.$id] || {}),
                        [set]: {
                          ...(prev[exercise.$id]?.[set] || {}),
                          rpe: text,
                        },
                      },
                    }))
                  }
                />
              </ThemeView>
            ))}
          </ThemeView>
        ))}

        <Spacer height={30} />

        <ThemeButton onPress={handleSaveWorkout}>
          <ThemeText>{saving ? "Saving..." : "Save Workout"}</ThemeText>
        </ThemeButton>
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
    zIndex: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  exerciseCard: {
    width: "88%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  setRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  setLabel: {
    width: 50,
    fontSize: 15,
  },

  input: {
    width: 70,
    padding: 10,
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    textAlign: "center",
  },
  motivatorText: {
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.8,
    marginBottom: 15,
  },
});
