import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

import { useUser } from "../../contexts/AuthContext";

import BackButton from "../../components/BackButton";
import HomeTopBar from "../../components/HomeTopBar";
import Spacer from "../../components/Spacer";
import ThemeButton from "../../components/ThemeButton";
import ThemeText from "../../components/ThemeText";
import ThemeView from "../../components/ThemeView";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const options = [
  "Reset",
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Rest",
];

export default function CustomSplitScreen() {
  const { user } = useUser();
  const params = useLocalSearchParams();

  const [loading, setLoading] = useState(false);

  const [customSplit, setCustomSplit] = useState(
    days.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {}),
  );

  const toggleOption = (day, option) => {
    setCustomSplit((prev) => {
      const currentOptions = prev[day] || [];

      let updatedOptions;

      if (option === "Rest") {
        updatedOptions = currentOptions.includes("Rest") ? [] : ["Rest"];
      } else {
        const withoutRest = currentOptions.filter((item) => item !== "Rest");

        if (withoutRest.includes(option)) {
          updatedOptions = withoutRest.filter((item) => item !== option);
        } else {
          updatedOptions = [...withoutRest, option];
        }
      }
      if (option === "Reset") {
        return {
          ...prev,
          [day]: [],
        };
      }

      return {
        ...prev,
        [day]: updatedOptions,
      };
    });
  };

  const handleNext = () => {
    router.push({
      pathname: "/addexercises",
      params: {
        title: params.title,
        description: params.description || "",
        trainingGoal: params.trainingGoal,
        trainingFrequency: params.trainingFrequency,
        weakPoints: params.weakPoints || "",
        failureFrequency: params.failureFrequency,
        experienceLevel: params.experienceLevel,
        durationWeeks: params.durationWeeks,
        splitType: params.splitType,
        trainingStyle: params.trainingStyle,

        customSplitDays: JSON.stringify(customSplit),
        selectedExercises: JSON.stringify({}),
        dayNames: JSON.stringify({}),
        from: "/customsplit",
      },
    });
  };

  return (
    <ThemeView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <HomeTopBar />

        <BackButton style={styles.backButton} backTo={"/createworkout"} />

        <ThemeText title={true} style={styles.heading}>
          Define Your Split
        </ThemeText>

        <ThemeText style={styles.subheading}>
          Assign a workout focus to your selected days.
        </ThemeText>

        <Spacer height={30} />

        {days.map((day) => (
          <ThemeView key={day} style={styles.dayRow}>
            <ThemeText style={styles.dayLabel}>{day}:</ThemeText>

            <ThemeView style={styles.optionsWrap}>
              {options.map((option) => {
                const selected = customSplit[day]?.includes(option);

                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionPill,
                      option === "Reset" && styles.resetButton,
                      selected && styles.optionPillSelected,
                    ]}
                    onPress={() => toggleOption(day, option)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        option === "Reset" && styles.resetText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ThemeView>
          </ThemeView>
        ))}

        <Spacer height={35} />

        <ThemeButton onPress={handleNext}>
          <ThemeText>Next</ThemeText>
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
    paddingBottom: 60,
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
    fontSize: 16,
    textAlign: "center",
    width: "80%",
    marginTop: 10,
  },
  dayRow: {
    width: "90%",
    marginBottom: 18,
  },
  dayLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionPill: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  optionPillSelected: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  optionText: {
    fontSize: 13,
    color: "#fff",
  },
  optionTextSelected: {
    color: "#ad0d0d",
  },
  resetButton: {
    backgroundColor: "#ad0d0d",
    borderColor: "#ad0d0d",
  },

  resetText: {
    color: "#fff",
    fontWeight: 500,
  },
});
