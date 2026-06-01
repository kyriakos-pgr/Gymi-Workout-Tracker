import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

//contexts
import { useUser } from "../../contexts/AuthContext";

//themed components
import BackButton from "../../components/BackButton";
import HomeTopBar from "../../components/HomeTopBar";
import Spacer from "../../components/Spacer";
import ThemeButton from "../../components/ThemeButton";
import ThemeText from "../../components/ThemeText";
import ThemeTextInput from "../../components/ThemeTextInput";
import ThemeView from "../../components/ThemeView";

export default function CreateProgramScreen() {
  const { user } = useUser();
  const params = useLocalSearchParams();

  const [title, setTitle] = useState(params.builtInProgramTitle || "");
  const [description, setDescription] = useState("");
  const [weakPoints, setWeakPoints] = useState("");
  const [failureFrequency, setFailureFrequency] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [durationWeeks, setDurationWeeks] = useState("");
  const [splitType, setSplitType] = useState(params.splitType || "");
  const [trainingStyle, setTrainingStyle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.builtInProgramTitle) {
      setTitle(params.builtInProgramTitle);
    }

    if (params.splitType) {
      setSplitType(params.splitType);
    }
  }, [params.builtInProgramTitle, params.splitType]);

  const failOptions = ["Never", "Last set only", "Every set"];
  const experienceOptions = ["Beginner", "Intermediate", "Advanced"];
  const splitOptions = [
    "Push, Pull, Legs",
    "Upper, Lower",
    "FullBody",
    "Custom",
  ];
  const trainingOptions = [
    "Slow & Steady (RPE 6-7)",
    "The Sweet Spot (RPE 7-8)",
    "Beast Mode (RPE 8-10)",
  ];

  const handleMainButtonPress = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Split name is required");
      return;
    }
    if (splitType !== "Custom" && !trainingStyle) {
      Alert.alert("Error", "Training style is required for built-in programs");
      return;
    }

    const baseParams = {
      title: title.trim(),
      description: description.trim(),
      weakPoints: weakPoints.trim(),
      failureFrequency,
      experienceLevel,
      durationWeeks,
      splitType,
      trainingStyle,
    };

    if (params.selectedExercises) {
      router.push({
        pathname: "/addexercises",
        params: {
          ...baseParams,
          selectedExercises: params.selectedExercises,
          customSplitDays: params.customSplitDays,
          dayNames: params.dayNames,
          builtInProgramId: params.builtInProgramId,
          builtInProgramTitle: params.builtInProgramTitle,
        },
      });

      return;
    }
    if (splitType === "Custom") {
      router.push({
        pathname: "/customsplit",
        params: baseParams,
      });
    } else {
      router.push({
        pathname: "/builtinprograms",
        params: {
          ...baseParams,
          from: "/createworkout",
        },
      });
    }
  };

  const Option = ({ label, selected, onPress }) => (
    <TouchableOpacity style={styles.optionRow} onPress={onPress}>
      <ThemeView
        style={[
          styles.selectionOuterCircle,
          selected && styles.selectionOuterCircleActive,
        ]}
      >
        {selected && <ThemeView style={styles.selectionInnerCircle} />}
      </ThemeView>

      <ThemeText style={styles.optionText}>{label}</ThemeText>
    </TouchableOpacity>
  );

  return (
    <ThemeView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <HomeTopBar />
        <BackButton style={styles.backButton} backTo={params.from} />

        <Spacer height={10} />

        <ThemeText title={true} style={styles.heading}>
          Setup your{"\n"}[{title || "Split Name"}]
        </ThemeText>

        <Spacer height={25} />

        <ThemeTextInput
          style={styles.input}
          placeholder="Split Name"
          value={title}
          onChangeText={setTitle}
        />
        <ThemeTextInput
          style={styles.input}
          placeholder="Add a Description (optional)"
          value={description}
          onChangeText={setDescription}
        />

        <ThemeText style={styles.label}>Split Type:</ThemeText>
        {splitOptions.map((option) => (
          <Option
            key={option}
            label={option}
            selected={splitType === option}
            onPress={() => setSplitType(option)}
          />
        ))}

        <Spacer height={15} />

        <ThemeText style={styles.label}>Training Style:</ThemeText>
        {trainingOptions.map((option) => (
          <Option
            key={option}
            label={option}
            selected={trainingStyle === option}
            onPress={() => setTrainingStyle(option)}
          />
        ))}

        <Spacer height={15} />

        <ThemeTextInput
          style={styles.input}
          placeholder="Weak Points e.g. Chest, Rear Delts"
          value={weakPoints}
          onChangeText={setWeakPoints}
        />

        <ThemeText style={styles.label}>Failure Frequency</ThemeText>

        {failOptions.map((option) => (
          <Option
            key={option}
            label={option}
            selected={failureFrequency === option}
            onPress={() => setFailureFrequency(option)}
          />
        ))}

        <Spacer height={15} />

        <ThemeText style={styles.label}>Experience Level</ThemeText>

        {experienceOptions.map((option) => (
          <Option
            key={option}
            label={option}
            selected={experienceLevel === option}
            onPress={() => setExperienceLevel(option)}
          />
        ))}

        <Spacer height={15} />

        <ThemeTextInput
          style={styles.input}
          placeholder="Duration Weeks e.g. 8"
          value={durationWeeks}
          onChangeText={setDurationWeeks}
          keyboardType="numeric"
        />

        <Spacer height={25} />

        <ThemeButton onPress={handleMainButtonPress}>
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
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  content: {
    paddingTop: 120,
    paddingBottom: 60,
    alignItems: "center",
  },
  heading: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
  },
  input: {
    width: "85%",
    marginBottom: 15,
  },
  label: {
    width: "85%",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  optionRow: {
    width: "85%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  optionText: {
    fontSize: 16,
  },
  selectionOuterCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  selectionOuterCircleActive: {
    borderColor: "#fff",
  },

  selectionInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ad0d0d",
  },
});
