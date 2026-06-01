import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

//themed components
import BackButton from "../../components/BackButton";
import HomeTopBar from "../../components/HomeTopBar";
import Spacer from "../../components/Spacer";
import ThemeText from "../../components/ThemeText";
import ThemeView from "../../components/ThemeView";

const splitPrograms = {
  "Push, Pull, Legs": [
    {
      id: "ppl-strength",
      title: "PPL strength",
      description: "Heavy compound focused Push Pull Legs split.",

      splitDays: {
        Monday: ["Chest", "Shoulders", "Arms"],
        Tuesday: ["Back", "Arms"],
        Wednesday: ["Legs", "Core"],
        Thursday: ["Rest"],
        Friday: ["Chest", "Shoulders", "Core"],
        Saturday: ["Back", "Legs"],
        Sunday: ["Rest"],
      },

      dayNames: {
        Monday: "Push A",
        Tuesday: "Pull A",
        Wednesday: "Legs A",
        Friday: "Push B",
        Saturday: "Pull + Legs B",
      },

      selectedExercises: {
        Monday: {
          0: { name: "Bench Press", muscleGroup: "Chest" },
          1: { name: "Incline Dumbbell Press", muscleGroup: "Chest" },
          2: { name: "Chest Fly", muscleGroup: "Chest" },
          3: { name: "Shoulder Press", muscleGroup: "Shoulders" },
          4: { name: "Lateral Raises", muscleGroup: "Shoulders" },
          5: { name: "Triceps Pushdown", muscleGroup: "Arms" },
          6: { name: "Skull Crushers", muscleGroup: "Arms" },
        },
        Tuesday: {
          0: { name: "Pull-ups", muscleGroup: "Back" },
          1: { name: "Lat Pulldown", muscleGroup: "Back" },
          2: { name: "Barbell Row", muscleGroup: "Back" },
          3: { name: "Bicep Curl", muscleGroup: "Arms" },
          4: { name: "Hammer Curl", muscleGroup: "Arms" },
        },
        Wednesday: {
          0: { name: "Squat", muscleGroup: "Legs" },
          1: { name: "Leg Extension", muscleGroup: "Legs" },
          2: { name: "Romanian Deadlift (RDL)", muscleGroup: "Legs" },
          3: { name: "Leg Press", muscleGroup: "Legs" },
          4: { name: "Plank", muscleGroup: "Core" },
          5: { name: "Hanging Leg Raise", muscleGroup: "Core" },
        },
        Friday: {
          0: { name: "Push-Ups", muscleGroup: "Chest" },
          1: { name: "Incline Dumbbell Press", muscleGroup: "Chest" },
          2: { name: "Arnold Press", muscleGroup: "Shoulders" },
          3: { name: "Rear Delt Fly", muscleGroup: "Shoulders" },
          4: { name: "Cable Crunch", muscleGroup: "Core" },
          5: { name: "Russian Twists", muscleGroup: "Core" },
        },
        Saturday: {
          0: { name: "Deadlift", muscleGroup: "Legs" },
          1: { name: "Leg Press", muscleGroup: "Legs" },
          2: { name: "Pull-ups", muscleGroup: "Back" },
          3: { name: "Seated Cable Row", muscleGroup: "Back" },
        },
      },
    },
  ],

  "Upper, Lower": [
    {
      id: "ul-balanced",
      title: "Upper Lower Balanced",
      description: "Balanced upper lower split with good recovery.",

      splitDays: {
        Monday: ["Chest", "Back", "Arms"],
        Tuesday: ["Legs", "Core"],
        Wednesday: ["Rest"],
        Thursday: ["Chest", "Back", "Core"],
        Friday: ["Legs"],
        Saturday: ["Shoulders", "Core"],
        Sunday: ["Rest"],
      },

      dayNames: {
        Monday: "Upper A",
        Tuesday: "Lower A",
        Thursday: "Upper B",
        Friday: "Lower B",
        Saturday: "Extra A",
      },

      selectedExercises: {
        Monday: {
          0: { name: "Bench Press", muscleGroup: "Chest" },
          1: { name: "Incline Dumbbell Press", muscleGroup: "Chest" },
          2: { name: "Pull-ups", muscleGroup: "Back" },
          3: { name: "Barbell Row", muscleGroup: "Back" },
          4: { name: "Skull Crushers", muscleGroup: "Arms" },
          5: { name: "Bicep Curl", muscleGroup: "Arms" },
        },
        Tuesday: {
          0: { name: "Squat", muscleGroup: "Legs" },
          1: { name: "Leg Extension", muscleGroup: "Legs" },
          2: { name: "Romanian Deadlift (RDL)", muscleGroup: "Legs" },
          3: { name: "Leg Press", muscleGroup: "Legs" },
          4: { name: "Cable Crunch", muscleGroup: "Core" },
          5: { name: "Hanging Leg Raise", muscleGroup: "Core" },
        },
        Thursday: {
          0: { name: "Push-ups", muscleGroup: "Chest" },
          1: { name: "Chest Fly", muscleGroup: "Chest" },
          2: { name: "Pull-ups", muscleGroup: "Back" },
          3: { name: "Lat Pulldown", muscleGroup: "Back" },
          4: { name: "Plank", muscleGroup: "Core" },
          5: { name: "Russian Twists", muscleGroup: "Core" },
        },
        Friday: {
          0: { name: "Squat", muscleGroup: "Legs" },
          1: { name: "Leg Extension", muscleGroup: "Legs" },
          2: { name: "Romanian Deadlift (RDL)", muscleGroup: "Legs" },
          3: { name: "Leg Press", muscleGroup: "Legs" },
        },
        Saturday: {
          0: { name: "Shoulder Press", muscleGroup: "Shoulders" },
          1: { name: "Lateral Raises", muscleGroup: "Shoulders" },
          2: { name: "Rear Delt Fly", muscleGroup: "Shoulders" },
          3: { name: "Cable Crunch", muscleGroup: "Core" },
          4: { name: "Hanging Leg Raise", muscleGroup: "Core" },
        },
      },
    },
  ],

  FullBody: [
    {
      id: "fb-classic",
      title: "Classic Full Body",
      description: "3x weekly full body training program.",

      splitDays: {
        Monday: ["Chest", "Back", "Legs"],
        Tuesday: ["Rest"],
        Wednesday: ["Chest", "Shoulders", "Legs"],
        Thursday: ["Rest"],
        Friday: ["Back", "Arms", "Legs"],
        Saturday: ["Rest"],
        Sunday: ["Rest"],
      },

      dayNames: {
        Monday: "FullBody A",
        Wednesday: "FullBody B",
        Friday: "FullBody C",
      },
      selectedExercises: {
        Monday: {
          0: { name: "Bench Press", muscleGroup: "Chest" },
          1: { name: "Incline Dumbbell Press", muscleGroup: "Chest" },
          2: { name: "Pull-ups", muscleGroup: "Back" },
          3: { name: "Lat Pulldown", muscleGroup: "Back" },
          4: { name: "Deadlift", muscleGroup: "Legs" },
          5: { name: "Leg Press", muscleGroup: "Legs" },
        },
        Wednesday: {
          0: { name: "Push-Ups", muscleGroup: "Chest" },
          1: { name: "Chest Fly", muscleGroup: "Chest" },
          2: { name: "Shoulder Press", muscleGroup: "Shoulders" },
          3: { name: "Lateral Raises", muscleGroup: "Shoulders" },
          4: { name: "Squat", muscleGroup: "Legs" },
          5: { name: "Leg Extension", muscleGroup: "Legs" },
        },
        Friday: {
          0: { name: "Pull-ups", muscleGroup: "Back" },
          1: { name: "Barbell Row", muscleGroup: "Back" },
          2: { name: "Triceps Pushdown", muscleGroup: "Arms" },
          3: { name: "Bicep Curl", muscleGroup: "Arms" },
          4: { name: "Romanian Deadlift (RDL)", muscleGroup: "Legs" },
          5: { name: "Leg Press", muscleGroup: "Legs" },
        },
      },
    },
  ],
};

const weakPointExercises = {
  Chest: { name: "Incline Dumbbell Press", muscleGroup: "Chest" },
  Back: { name: "Seated Cable Row", muscleGroup: "Back" },
  Shoulders: { name: "Lateral Raises", muscleGroup: "Shoulders" },
  Arms: { name: "Hammer Curl", muscleGroup: "Arms" },
  Legs: { name: "Leg Press", muscleGroup: "Legs" },
  Core: { name: "Cable Crunch", muscleGroup: "Core" },
};

const applyWeakPoints = (program, weakPointsText) => {
  if (!weakPointsText) return program;

  const weakPoints = weakPointsText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const updatedSelectedExercises = JSON.parse(
    JSON.stringify(program.selectedExercises || {}),
  );

  weakPoints.forEach((weakPoint) => {
    const extraExercise = weakPointExercises[weakPoint];

    if (!extraExercise) return;

    Object.keys(program.splitDays).forEach((day) => {
      const muscles = program.splitDays[day];

      if (!Array.isArray(muscles) || !muscles.includes(weakPoint)) return;

      const dayExercises = updatedSelectedExercises[day] || {};

      const alreadyExists = Object.values(dayExercises).some(
        (exercise) => exercise.name === extraExercise.name,
      );

      if (alreadyExists) return;

      const nextIndex = Object.keys(dayExercises).length;

      updatedSelectedExercises[day] = {
        ...dayExercises,
        [nextIndex]: extraExercise,
      };
    });
  });

  return {
    ...program,
    selectedExercises: updatedSelectedExercises,
  };
};

export default function BuiltInProgramsScreen() {
  const params = useLocalSearchParams();

  const builtInPrograms = params.splitType
    ? splitPrograms[params.splitType] || []
    : Object.values(splitPrograms).flat();

  const handleSelectProgram = (program) => {
    const finalProgram = applyWeakPoints(program, params.weakPoints);

    router.push({
      pathname: "/addexercises",
      params: {
        ...params,
        previewOnly: params.from !== "/createworkout" ? "true" : "false",
        from: JSON.stringify({
          pathname: "/builtinprograms",
          params: {
            ...params,
          },
        }),
        builtInProgramId: finalProgram.id,
        builtInProgramTitle: finalProgram.title,
        splitType:
          params.splitType ||
          Object.keys(splitPrograms).find((key) =>
            splitPrograms[key].some((item) => item.id === finalProgram.id),
          ),
        customSplitDays: JSON.stringify(finalProgram.splitDays),
        selectedExercises: JSON.stringify(finalProgram.selectedExercises),
        dayNames: JSON.stringify(finalProgram.dayNames),
      },
    });
  };

  return (
    <ThemeView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <HomeTopBar />
        <BackButton
          style={styles.backButton}
          backTo={params.from || "/programs"}
        />

        <ThemeText title={true} style={styles.heading}>
          Choose Built-In Program
        </ThemeText>

        <Spacer height={30} />

        {builtInPrograms.map((program) => (
          <TouchableOpacity
            key={program.id}
            style={styles.card}
            onPress={() => handleSelectProgram(program)}
            activeOpacity={0.8}
          >
            <ThemeText style={styles.cardTitle}>{program.title}</ThemeText>
            <Spacer height={8} />
            <ThemeText style={styles.cardDescription}>
              {program.description}
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
  card: {
    width: "88%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
});
