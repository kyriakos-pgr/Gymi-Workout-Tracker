import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Query } from "react-native-appwrite";

import { useUser } from "../../contexts/AuthContext";
import { config, databases } from "../../lib/appwrite";

import BackButton from "../../components/BackButton";
import HomeTopBar from "../../components/HomeTopBar";
import Spacer from "../../components/Spacer";
import ThemeText from "../../components/ThemeText";
import ThemeView from "../../components/ThemeView";

export default function CurrentProgramScreen() {
  const { user } = useUser();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (user) fetchActiveProgram();
    }, [user]),
  );

  const fetchActiveProgram = async () => {
    try {
      setLoading(true);

      const response = await databases.listDocuments(
        config.databaseId,
        config.programsTableId,
        [
          Query.equal("userid", user.$id),
          Query.equal("isActivate", true),
          Query.limit(1),
        ],
      );

      setProgram(response.documents[0] || null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeView style={styles.container}>
      <HomeTopBar />
      <BackButton style={styles.backButton} backTo="/programs" />

      <ScrollView contentContainerStyle={styles.content}>
        <ThemeText title={true} style={styles.heading}>
          Current Program
        </ThemeText>

        <Spacer height={30} />

        {!loading && !program ? (
          <>
            <ThemeText>Oops! No programs are activated...</ThemeText>

            <Spacer height={25} />

            <TouchableOpacity
              style={styles.programsButton}
              onPress={() => router.push("/savedprograms")}
            >
              <ThemeText>Go To Saved Programs</ThemeText>
            </TouchableOpacity>
          </>
        ) : (
          program && (
            <TouchableOpacity
              style={styles.programCard}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/workoutdetails",
                  params: {
                    programId: program.$id,
                  },
                })
              }
            >
              <ThemeText style={styles.programTitle}>{program.title}</ThemeText>

              <Spacer height={8} />

              <ThemeText>Style: {program.trainingStyle}</ThemeText>
              <ThemeText>Split: {program.splitType}</ThemeText>
            </TouchableOpacity>
          )
        )}
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
  },
  programTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  programsButton: {
    borderWidth: 1,
    backgroundColor: "#ad0d0d",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },
});
