import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

//themed components
import HomeTopBar from "../../components/HomeTopBar";
import Spacer from "../../components/Spacer";
import ThemeText from "../../components/ThemeText";
import ThemeView from "../../components/ThemeView";

export default function HomeScreen() {
  return (
    <ThemeView style={styles.container}>
      <HomeTopBar />

      <Spacer height={50} />
      <ThemeText style={{ fontSize: 25 }}> Welcome to Gymi! </ThemeText>
      <Spacer height={50} />

      <ThemeView style={styles.programHelpSection}>
        <ThemeText>Something went wrong with your program?</ThemeText>

        <Spacer height={15} />

        <View style={styles.switchProgramContainer}>
          <TouchableOpacity
            style={styles.buttonSwitch}
            onPress={() => router.push("/savedprograms")}
          >
            <ThemeText style={{ color: "#ad0d0d" }}>Switch Program</ThemeText>
          </TouchableOpacity>
        </View>
      </ThemeView>

      <Spacer height={40} />

      <View style={styles.cardsContainer}>
        <View style={styles.cardWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/progress")}
          >
            <Ionicons name="stats-chart-outline" size={60} color="#fff" />
          </TouchableOpacity>
          <Spacer height={15} />
          <ThemeText>See Progress</ThemeText>
        </View>

        <View style={styles.cardWrapper}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/createworkout")}
          >
            <Ionicons name="create-outline" size={60} color="#fff" />
          </TouchableOpacity>
          <Spacer height={15} />
          <ThemeText>Create Program</ThemeText>
        </View>
      </View>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
  },
  button: {
    backgroundColor: "#ad0d0d",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    padding: 30,
  },
  buttonSwitch: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    padding: 20,
    marginVertical: 5,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
  },
  cardWrapper: {
    alignItems: "center",
  },
  programHelpSection: {
    marginTop: 20,
    marginBottom: 20,
    gap: 10,
  },
  switchProgramContainer: {
    width: 200,
    alignSelf: "center",
  },
});
