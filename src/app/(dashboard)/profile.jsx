import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

//lib--appwrite
import { config, databases } from "../../lib/appwrite";

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

export default function ProfileScreen() {
  const { profile, logout } = useUser();

  const [bodyweight, setBodyWeight] = useState(profile?.bodyweight || "");

  const [height, setHeight] = useState(profile?.height || "");

  const [gymgoal, setGymGoal] = useState(profile?.gymgoal || "");

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await databases.updateDocument(
        config.databaseId,
        config.profilesTableId,
        profile.$id,
        {
          bodyweight,
          height,
          gymgoal,
        },
      );

      alert("Profile updated!");
    } catch (error) {
      console.log(error);
      alert("Could not update profile");
    }
  };

  console.log("PROFILE IN SCREEN:", profile);
  return (
    <ThemeView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <HomeTopBar />
        <BackButton
          style={{
            position: "absolute",
            top: 60,
            left: 20,
          }}
        />
        <ThemeText title={true} style={styles.heading}>
          Profile
        </ThemeText>
        <Spacer />

        <ThemeText title={true} style={styles.heading}>
          Hello! {profile?.username}
        </ThemeText>

        <Spacer height={35} />

        <ThemeView style={styles.profileImage}>
          <ThemeText>📷</ThemeText>
        </ThemeView>

        <Spacer height={35} />

        <ThemeView style={styles.infoRow}>
          <ThemeView style={styles.infoCard}>
            <ThemeText style={styles.cardTitle}>Level</ThemeText>

            <Spacer height={10} />

            <ThemeText>Advanced</ThemeText>
          </ThemeView>

          <ThemeView style={styles.infoCard}>
            <ThemeText style={styles.cardTitle}>Focus</ThemeText>

            <Spacer height={10} />

            <ThemeText>PPL</ThemeText>
          </ThemeView>
        </ThemeView>

        <Spacer height={30} />

        <ThemeView style={styles.largeCard}>
          <ThemeText style={styles.cardTitle}>Body Metrics</ThemeText>

          <Spacer height={15} />

          <ThemeView style={styles.row}>
            <ThemeText>Body Weight:</ThemeText>

            <ThemeTextInput
              style={[styles.input, styles.rowInput]}
              placeholder="e.g. 82kg"
              value={bodyweight}
              onChangeText={setBodyWeight}
            />
          </ThemeView>

          <Spacer height={8} />

          <ThemeView style={styles.row}>
            <ThemeText>Height:</ThemeText>
            <ThemeTextInput
              style={[styles.input, styles.rowInput]}
              placeholder="e.g. 178cm"
              value={height}
              onChangeText={setHeight}
            />
          </ThemeView>
        </ThemeView>

        <Spacer height={30} />

        <ThemeView style={styles.goalsCard}>
          <ThemeText style={styles.cardTitle}>Goals</ThemeText>

          <Spacer height={15} />

          <ThemeView style={styles.row}>
            <ThemeText>Gym Goals:</ThemeText>
            <ThemeTextInput
              style={[styles.input, styles.rowInput]}
              placeholder="Bench Press 115kg"
              value={gymgoal}
              onChangeText={setGymGoal}
            />
          </ThemeView>

          <Spacer height={8} />

          <ThemeText>Workout Streak: 11 Weeks</ThemeText>
        </ThemeView>

        <Spacer height={40} />

        <ThemeButton onPress={handleSaveProfile}>
          <ThemeText>Save Profile</ThemeText>
        </ThemeButton>

        <Spacer height={15} />

        <ThemeButton onPress={handleLogout} style={styles.logoutButton}>
          <ThemeText style={styles.logoutText}>Logout</ThemeText>
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
    paddingBottom: 90,
    alignItems: "center",
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
  },
  heading: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#fff",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  infoRow: {
    width: "88%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  infoCard: {
    width: "47%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },

  largeCard: {
    width: "88%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 18,
    padding: 20,
  },

  goalsCard: {
    width: "88%",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 18,
    padding: 20,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowInput: {
    flex: 1,
    marginLeft: 10,
  },

  logoutButton: {
    backgroundColor: "#fff",
  },
  logoutText: {
    color: "#ad0d0d",
  },
});
