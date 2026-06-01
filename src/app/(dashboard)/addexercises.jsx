import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

//lib--appwrite
import { config, databases, ID } from "../../lib/appwrite";

//context
import { useUser } from "../../contexts/AuthContext";

//Themed components
import BackButton from "../../components/BackButton";
import HomeTopBar from "../../components/HomeTopBar";
import Spacer from "../../components/Spacer";
import ThemeButton from "../../components/ThemeButton";
import ThemeText from "../../components/ThemeText";
import ThemeTextInput from "../../components/ThemeTextInput";
import ThemeView from "../../components/ThemeView";

export default function AddExercisesScreen() {
  const params = useLocalSearchParams();
  const isPreviewOnly = params.previewOnly === "true";

  const { user } = useUser();

  const customSplitDays = useMemo(() => {
    try {
      return params.customSplitDays ? JSON.parse(params.customSplitDays) : {};
    } catch {
      return {};
    }
  }, [params.customSplitDays]);

  const activeDays = Object.entries(customSplitDays).filter(
    ([_, muscles]) =>
      Array.isArray(muscles) && muscles.length > 0 && !muscles.includes("Rest"),
  );

  const [dayIndex, setDayIndex] = useState(0);
  const currentDay = activeDays[dayIndex]?.[0];
  const currentMuscles = activeDays[dayIndex]?.[1] || [];

  const [dayNames, setDayNames] = useState(() => {
    try {
      return params.dayNames ? JSON.parse(params.dayNames) : {};
    } catch {
      return {};
    }
  });

  const [selectedExercises, setSelectedExercises] = useState(() => {
    try {
      return params.selectedExercises
        ? JSON.parse(params.selectedExercises)
        : {};
    } catch {
      return {};
    }
  });

  const handleGoToCreateWorkout = () => {
    router.push({
      pathname: "/createworkout",
      params: {
        ...params,
        selectedExercises: JSON.stringify(selectedExercises),
        dayNames: JSON.stringify(dayNames),
        customSplitDays: params.customSplitDays,
        builtInProgramId: params.builtInProgramId,
        builtInProgramTitle: params.builtInProgramTitle,
        from: "/addexercises",
      },
    });
  };

  useEffect(() => {
    try {
      setSelectedExercises(
        params.selectedExercises ? JSON.parse(params.selectedExercises) : {},
      );

      setDayNames(params.dayNames ? JSON.parse(params.dayNames) : {});

      setDayIndex(0);
    } catch (error) {
      console.log(error);
    }
  }, [params.selectedExercises, params.dayNames, params.customSplitDays]);

  const handlePickExercise = (slotIndex) => {
    router.push({
      pathname: "/pickexercise",
      params: {
        ...params,
        day: currentDay,
        muscles: JSON.stringify(currentMuscles),
        slotIndex: String(slotIndex),
        dayIndex: String(dayIndex),
        selectedExercises: JSON.stringify(selectedExercises),
        dayNames: JSON.stringify(dayNames),
      },
    });
  };
  useEffect(() => {
    if (
      !params.selectedExercise ||
      !params.selectedDay ||
      !params.selectedSlotIndex
    ) {
      return;
    }
    if (params.dayIndex) {
      setDayIndex(Number(params.dayIndex));
    }

    const exercise = JSON.parse(params.selectedExercise);

    const day = params.selectedDay;
    const slotIndex = Number(params.selectedSlotIndex);

    setSelectedExercises((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [slotIndex]: exercise,
      },
    }));
  }, [params.selectedExercise, params.selectedDay, params.selectedSlotIndex]);

  const handleBack = () => {
    if (isPreviewOnly) {
      if (params.from) {
        try {
          router.push(JSON.parse(params.from));
        } catch {
          router.push("/builtinprograms");
        }
      } else {
        router.push("/builtinprograms");
      }

      return;
    }

    if (dayIndex === 0) {
      if (params.from) {
        try {
          router.push(JSON.parse(params.from));
        } catch {
          router.push(params.from);
        }
      } else {
        router.push("/programs");
      }
    } else {
      setDayIndex((prev) => prev - 1);
    }
  };

  const handleSaveDay = () => {
    Alert.alert("Day Saved", `${currentDay} has been saved`);
  };
  const handleNextDay = () => {
    if (dayIndex < activeDays.length - 1) {
      setDayIndex((prev) => prev + 1);
    }
  };

  const handleFinishProgram = async () => {
    try {
      // CREATE--PROGRAM
      const programResponse = await databases.createDocument(
        config.databaseId,
        config.programsTableId,
        ID.unique(),
        {
          userid: user.$id,
          title: params.title,
          description: params.description || "",
          createdAt: new Date().toISOString(),

          trainingGoal: params.trainingGoal,
          weakPoints: params.weakPoints || "",
          failureFrequency: params.failureFrequency || "",
          experienceLevel: params.experienceLevel || "",
          durationWeeks: params.durationWeeks
            ? Number(params.durationWeeks)
            : null,

          splitType: params.splitType,
          trainingStyle: params.trainingStyle,
          customSplitDays: params.customSplitDays || "",
        },
      );
      //CREATE--EXERCISES
      for (const day of Object.keys(selectedExercises)) {
        const exercisesForDay = selectedExercises[day];

        for (const order of Object.keys(exercisesForDay)) {
          const exercise = exercisesForDay[order];

          await databases.createDocument(
            config.databaseId,
            config.exercisesTableId,
            ID.unique(),
            {
              programid: programResponse.$id,
              name: exercise.name,
              muscleGroup: exercise.muscleGroup,
              day,
              order: Number(order),
            },
          );
        }
      }

      Alert.alert("Success", "Program created successfully!");

      router.push("/programs");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    }
  };

  if (!currentDay) {
    return (
      <ThemeView style={styles.container}>
        <HomeTopBar />
        <BackButton style={styles.backButton} onPress={handleBack} />
        <ThemeText title={true} style={{ flex: 1 }}>
          No training days selected
        </ThemeText>
      </ThemeView>
    );
  }

  const exerciseSlots = params.builtInProgramId
    ? Object.keys(selectedExercises[currentDay] || {}).length
    : Math.max(6, Object.keys(selectedExercises[currentDay] || {}).length + 1);

  const isBuiltInFlow = !!params.builtInProgramId;

  return (
    <ThemeView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <HomeTopBar />
        <BackButton style={styles.backButton} onPress={handleBack} />

        <ThemeText title={true} style={styles.heading}>
          Select Your Exercises
        </ThemeText>

        <ThemeText style={styles.subHeading}>
          Build your Blueprint. Select the movements that will drive your
          progress.
        </ThemeText>

        <Spacer height={35} />

        <ThemeText style={styles.dayTitle}>
          Day {dayIndex + 1}: {currentMuscles.join(" & ")}
        </ThemeText>

        <ThemeTextInput
          style={styles.dayNameInput}
          placeholder="Name this day e.g. Push Day"
          placeholderTextColor="#999"
          value={dayNames[currentDay] || ""}
          onChangeText={(text) =>
            setDayNames((prevs) => ({
              ...prevs,
              [currentDay]: text,
            }))
          }
        />
        <Spacer height={20} />

        {Array.from({ length: exerciseSlots }).map((_, index) => {
          const exercise = selectedExercises[currentDay]?.[index]?.name || null;

          return (
            <ThemeView key={index} style={styles.exerciseRow}>
              <ThemeText style={styles.exerciseLabel}>
                Exercise {index + 1}:
              </ThemeText>

              <TouchableOpacity
                style={styles.pickButton}
                onPress={() => handlePickExercise(index)}
              >
                <ThemeText style={styles.pickText}>
                  {exercise || "PICK"}
                </ThemeText>
              </TouchableOpacity>
            </ThemeView>
          );
        })}

        <Spacer height={40} />

        <ThemeView style={styles.bottomRow}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert("Day Saved", `${currentDay} has been saved`);
            }}
            style={styles.testButton}
          >
            <ThemeText>Save Day</ThemeText>
          </TouchableOpacity>

          <ThemeButton
            style={styles.nextButton}
            onPress={
              dayIndex === activeDays.length - 1
                ? isPreviewOnly
                  ? handleGoToCreateWorkout
                  : handleFinishProgram
                : handleNextDay
            }
          >
            <ThemeText>
              {dayIndex === activeDays.length - 1
                ? isPreviewOnly
                  ? "Go To Create"
                  : "Finish"
                : "Next Day"}
            </ThemeText>
          </ThemeButton>
        </ThemeView>
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
  subHeading: {
    width: "80%",
    marginTop: 8,
    textAlign: "center",
    fontSize: 15,
  },
  dayTitle: {
    width: "85%",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  dayNameInput: {
    width: "85%",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
  },
  exerciseRow: {
    width: "85%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  exerciseLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  pickButton: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 5,
  },
  pickText: {
    fontSize: 13,
  },
  bottomRow: {
    width: "85%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  testButton: {
    backgroundColor: "#ad0d0d",
    padding: 18,
    borderRadius: 6,
    marginVertical: 10,
  },
  nextButton: {
    marginVertical: 10,
  },
});
