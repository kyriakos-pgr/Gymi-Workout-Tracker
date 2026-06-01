import { useFocusEffect } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Query } from "react-native-appwrite";

//notification imports
import {
  scheduleUpdateReminder,
  scheduleWorkoutReminder,
} from "../../utils/notifications";
//context
import { useUser } from "../../contexts/AuthContext";

//lib--appwrite
import { config, databases } from "../../lib/appwrite";

//themed components
import BackButton from "../../components/BackButton";
import HomeTopBar from "../../components/HomeTopBar";
import Spacer from "../../components/Spacer";
import ThemeText from "../../components/ThemeText";
import ThemeView from "../../components/ThemeView";
import ToggleButton from "../../components/ToggleButton";

export default function SettingsScreen() {
  const { user } = useUser();
  const [profileId, setProfileId] = useState(null);

  const [workoutReminders, setWorkoutReminders] = useState(false);
  const [updateReminders, setUpdateReminders] = useState(false);
  const [workoutMotivators, setWorkoutMotivators] = useState(false);

  const [exportData, setExportData] = useState(false);
  const [accountDeletion, setAccountDeletion] = useState(false);

  const [autoWeightAdjustment, setAutoWeightAdjustment] = useState(false);
  const [unit, setUnit] = useState("kg");

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchSettings();
      }
    }, [user]),
  );

  const fetchSettings = async () => {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.profilesTableId,
        [Query.equal("userid", user.$id)],
      );

      const profile = response.documents[0];

      if (profile) {
        setProfileId(profile.$id);
        setUnit(profile.unit || "kg");
        setAutoWeightAdjustment(profile.autoWeightAdjustment || false);
        setWorkoutMotivators(profile.workoutMotivators || false);
        setWorkoutReminders(profile.workoutReminders || false);
        setUpdateReminders(profile.updateReminders || false);
      }
    } catch (error) {
      console.log(error);
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

        <BackButton style={styles.backButton} />

        <Spacer height={10} />

        <ThemeText title={true} style={styles.heading}>
          Settings
        </ThemeText>

        <ThemeText style={styles.sectionTitle}>Appearance</ThemeText>
        <Spacer height={7} />

        <ThemeView style={styles.settingRow}>
          <ThemeText style={styles.letters}>Theme:</ThemeText>
          <ThemeText style={styles.systemText}>System Default</ThemeText>
        </ThemeView>

        <ThemeText style={styles.sectionTitle}>
          Notifications & Support
        </ThemeText>
        <Spacer height={7} />

        <ThemeView style={styles.settingRow}>
          <ThemeText style={styles.letters}>Workout Reminders:</ThemeText>
          <ToggleButton
            value={workoutReminders}
            onPress={async () => {
              console.log("TOGGLE PRESSED");

              const newValue = !workoutReminders;
              setWorkoutReminders(newValue);

              if (newValue) {
                console.log("SCHEDULING NOTIFICATION");
                await scheduleWorkoutReminder();
              }

              if (profileId) {
                await databases.updateDocument(
                  config.databaseId,
                  config.profilesTableId,
                  profileId,
                  {
                    workoutReminders: newValue,
                  },
                );
              }
            }}
          />
        </ThemeView>

        <ThemeView style={styles.settingRow}>
          <ThemeText style={styles.letters}>Update Reminders:</ThemeText>
          <ToggleButton
            value={updateReminders}
            onPress={async () => {
              const newValue = !updateReminders;
              setUpdateReminders(newValue);

              if (newValue) {
                await scheduleUpdateReminder();
              } else {
                await Notifications.cancelAllScheduledNotificationsAsync();
              }

              if (profileId) {
                await databases.updateDocument(
                  config.databaseId,
                  config.profilesTableId,
                  profileId,
                  {
                    updateReminders: newValue,
                  },
                );
              }
            }}
          />
        </ThemeView>

        <ThemeView style={styles.settingRow}>
          <ThemeText style={styles.letters}>Workout Motivators:</ThemeText>
          <ToggleButton
            value={workoutMotivators}
            onPress={async () => {
              const newValue = !workoutMotivators;
              setWorkoutMotivators(newValue);

              if (profileId) {
                await databases.updateDocument(
                  config.databaseId,
                  config.profilesTableId,
                  profileId,
                  {
                    workoutMotivators: newValue,
                  },
                );
              }
            }}
          />
        </ThemeView>

        <ThemeText style={styles.sectionTitle}>Data & Connectivity</ThemeText>
        <Spacer height={7} />

        <ThemeView style={styles.settingRow}>
          <ThemeText style={styles.letters}>Coming Soon!</ThemeText>
        </ThemeView>

        <ThemeView style={styles.settingRow}>
          <ThemeText style={styles.letters}>Coming Soon!</ThemeText>
        </ThemeView>

        <ThemeText style={styles.sectionTitle}>Workout Settings</ThemeText>
        <Spacer height={7} />

        <ThemeView style={styles.settingRow}>
          <ThemeText style={styles.letters}>Auto-Weight Adjustment: </ThemeText>
          <ToggleButton
            value={autoWeightAdjustment}
            onPress={async () => {
              const newValue = !autoWeightAdjustment;
              setAutoWeightAdjustment(newValue);

              if (profileId) {
                await databases.updateDocument(
                  config.databaseId,
                  config.profilesTableId,
                  profileId,
                  {
                    autoWeightAdjustment: newValue,
                  },
                );
              }
            }}
          />
        </ThemeView>

        <ThemeView style={styles.settingRow}>
          <ThemeText style={styles.letters}>Default Unit:</ThemeText>

          <TouchableOpacity
            style={styles.unitSwitch}
            onPress={async () => {
              const newUnit = unit === "kg" ? "lbs" : "kg";
              setUnit(newUnit);

              if (profileId) {
                await databases.updateDocument(
                  config.databaseId,
                  config.profilesTableId,
                  profileId,
                  {
                    unit: newUnit,
                  },
                );
              }
            }}
          >
            <ThemeText style={styles.unitText}>Kg</ThemeText>

            <ThemeView
              style={[styles.unitKnob, unit === "lbs" && styles.unitKnobRight]}
            />

            <ThemeText style={styles.unitText}>Lbs</ThemeText>
          </TouchableOpacity>
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
    paddingTop: 120,
    paddingBottom: 60,
    paddingHorizontal: 24,
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
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 22,
    marginBottom: 10,
  },
  systemText: {
    fontSize: 16,
    opacity: 0.8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
    left: 5,
  },
  settingRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  letters: {
    fontSize: 17,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  unitSwitch: {
    width: 95,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    position: "relative",
  },

  unitKnob: {
    position: "absolute",
    left: 3,
    width: 42,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ad0d0d",
    zIndex: -1,
  },

  unitKnobRight: {
    left: 46,
  },

  unitText: {
    fontSize: 13,
    fontWeight: "bold",
  },
});
