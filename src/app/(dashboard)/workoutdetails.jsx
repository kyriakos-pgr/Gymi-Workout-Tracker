import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { Query } from "react-native-appwrite";

//lib--apwrite
import { config, databases } from "../../lib/appwrite";

//themed components
import BackButton from "../../components/BackButton";
import HomeTopBar from "../../components/HomeTopBar";
import Spacer from "../../components/Spacer";
import ThemeText from "../../components/ThemeText";
import ThemeView from "../../components/ThemeView";

export default function WorkoutDailyScreen() {
  const params = useLocalSearchParams();

  const [program, setProgram] = useState(null);
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    if (params.programId) {
      fetchProgramDetails();
    }
  }, [params.programId]);

  const fetchProgramDetails = async () => {
    try {
      setProgram(null);
      setExercises([]);
      //PROGRAM
      const programResponse = await databases.getDocument(
        config.databaseId,
        config.programsTableId,
        params.programId,
      );

      setProgram(programResponse);

      //EXERCISES
      const exercisesResponse = await databases.listDocuments(
        config.databaseId,
        config.exercisesTableId,
        [Query.equal("programid", params.programId)],
      );

      setExercises(exercisesResponse.documents);
    } catch (error) {
      console.log(error);
    }
  };

  //GROUP EXERCISES BY DAY
  const groupedExercises = exercises.reduce((acc, exercise) => {
    if (!acc[exercise.day]) {
      acc[exercise.day] = [];
    }

    acc[exercise.day].push(exercise);

    return acc;
  }, {});

  return (
    <ThemeView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <HomeTopBar />

        <BackButton style={styles.backButton} backTo="/savedprograms" />

        <ThemeText title={true} style={styles.heading}>
          {program?.title || "Workout Details"}
        </ThemeText>

        <Spacer height={10} />

        <ThemeText style={styles.infoText}>
          Style: {program?.trainingStyle}
        </ThemeText>

        <Spacer height={15} />

        {Object.keys(groupedExercises).map((day) => (
          <TouchableOpacity
            key={day}
            style={styles.dayCard}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/startworkout",
                params: {
                  programId: params.programId,
                  day,
                },
              })
            }
          >
            <ThemeText style={styles.dayTitle}>{day}</ThemeText>

            <Spacer height={10} />

            {groupedExercises[day]
              .sort((a, b) => a.order - b.order)
              .map((exercise) => (
                <ThemeText key={exercise.$id} style={styles.exerciseText}>
                  • {exercise.name}
                </ThemeText>
              ))}
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
    paddingTop: 140,
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
  infoText: {
    fontSize: 15,
    opacity: 0.8,
  },
  dayCard: {
    width: "88%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  exerciseText: {
    fontSize: 16,
    marginBottom: 8,
  },
});
