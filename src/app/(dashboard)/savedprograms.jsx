import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import { Query } from "react-native-appwrite";

//contexts
import { useUser } from "../../contexts/AuthContext";

//lib--apwrite
import { config, databases } from "../../lib/appwrite";

//themed Components
import BackButton from "../../components/BackButton";
import HomeTopBar from "../../components/HomeTopBar";
import Spacer from "../../components/Spacer";
import ThemeText from "../../components/ThemeText";
import ThemeView from "../../components/ThemeView";

export default function SavedProgramsScreen() {
  const { user } = useUser();
  const params = useLocalSearchParams();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [activateMode, setActivateMode] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        fetchPrograms();
      }
    }, [user]),
  );

  const fetchPrograms = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.programsTableId,
        [Query.equal("userid", user.$id), Query.orderDesc("$createdAt")],
      );

      setPrograms(response.documents);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProgramSelection = (programId) => {
    setSelectedPrograms((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId],
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedPrograms.length === 0) {
      setDeleteMode(false);
      return;
    }

    try {
      for (const programId of selectedPrograms) {
        await databases.deleteDocument(
          config.databaseId,
          config.programsTableId,
          programId,
        );
      }

      setSelectedPrograms([]);
      setDeleteMode(false);
      fetchPrograms();

      Alert.alert("Deleted", "Selected programs deleted successfully.");
    } catch (error) {
      Alert.alert("Error", "Could not delete programs");
    }
  };

  const handleActivateProgram = async () => {
    if (!selectedProgram) {
      setActivateMode(false);
      return;
    }

    try {
      //reset all programs
      for (const program of programs) {
        await databases.updateDocument(
          config.databaseId,
          config.programsTableId,
          program.$id,
          {
            isActivate: false,
          },
        );
      }

      //activate selected program
      await databases.updateDocument(
        config.databaseId,
        config.programsTableId,
        selectedProgram,
        {
          isActivate: true,
        },
      );

      setActivateMode(false);
      setSelectedProgram(null);

      fetchPrograms();

      Alert.alert("Success", "Program activated!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemeView style={styles.container}>
      <HomeTopBar />

      <BackButton
        style={styles.backButton}
        backTo={params.from || "/programs"}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <ThemeText title={true} style={styles.heading}>
          Saved Programs
        </ThemeText>

        <Spacer height={25} />

        {programs.length === 0 && !loading ? (
          <ThemeText>No saved programs yet...</ThemeText>
        ) : (
          programs.map((program) => (
            <TouchableOpacity
              key={program.$id}
              style={styles.programCard}
              activeOpacity={0.8}
              onPress={() => {
                if (deleteMode) {
                  toggleProgramSelection(program.$id);
                  return;
                }

                if (activateMode) {
                  setSelectedProgram(program.$id);
                  return;
                }

                router.push({
                  pathname: "/workoutdetails",
                  params: {
                    programId: program.$id,
                  },
                });
              }}
            >
              {deleteMode && (
                <ThemeView
                  style={[
                    styles.selectionOuterCircle,
                    selectedPrograms.includes(program.$id) &&
                      styles.selectionOuterCircleActive,
                  ]}
                >
                  {selectedPrograms.includes(program.$id) && (
                    <ThemeView style={styles.selectionInnerCircle} />
                  )}
                </ThemeView>
              )}
              {activateMode && (
                <ThemeView
                  style={[
                    styles.selectionOuterCircle,
                    selectedProgram === program.$id &&
                      styles.selectionOuterCircleActive,
                  ]}
                >
                  {selectedProgram === program.$id && (
                    <ThemeView style={styles.selectionInnerCircle} />
                  )}
                </ThemeView>
              )}

              <ThemeText style={styles.programTitle}>{program.title}</ThemeText>

              <Spacer height={6} />

              <ThemeText style={styles.programInfo}>
                Style: {program.trainingStyle}
              </ThemeText>
            </TouchableOpacity>
          ))
        )}

        <Spacer height={25} />

        <ThemeView style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={
              deleteMode
                ? handleDeleteSelected
                : () => {
                    setActivateMode(false);
                    setSelectedProgram(null);
                    setDeleteMode(true);
                  }
            }
          >
            <ThemeText style={{ color: "#ad0d0d" }}>
              {deleteMode
                ? `Delete Selected (${selectedPrograms.length})`
                : "Delete Program"}
            </ThemeText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={
              activateMode
                ? handleActivateProgram
                : () => {
                    setDeleteMode(false);
                    setSelectedPrograms([]);
                    setActivateMode(true);
                  }
            }
          >
            <ThemeText>
              {activateMode ? "Confirm Activation" : "Activate Program"}
            </ThemeText>
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
    fontSize: 26,
    fontWeight: "bold",
  },
  programCard: {
    width: "88%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  programTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 38,
  },
  programInfo: {
    fontSize: 14,
    opacity: 0.8,
  },
  actionsRow: {
    width: "88%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  actionButton: {
    width: "47%",
    backgroundColor: "#ad0d0d",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButton: {
    width: "47%",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  selectCircle: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 5,
  },
  selectionOuterCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  selectionOuterCircle: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 3,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  selectionInnerCircle: {
    width: 13,
    height: 13,
    borderRadius: 6,
    backgroundColor: "#ad0d0d",
  },
});
