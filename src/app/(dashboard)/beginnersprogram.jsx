import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";

//themed components
import BackButton from "../../components/BackButton";
import HomeTopBar from "../../components/HomeTopBar";
import Spacer from "../../components/Spacer";
import ThemeText from "../../components/ThemeText";
import ThemeView from "../../components/ThemeView";

export default function BeginnersProgramScreen() {
  const params = useLocalSearchParams();
  return (
    <ThemeView style={styles.container}>
      <HomeTopBar />
      <BackButton
        style={styles.backButton}
        backTo={params.from || "/programs"}
      />

      <ThemeText>Program For Beginners</ThemeText>
      <Spacer height={20} />

      <ThemeText style={{ fontSize: 26 }}>Coming Soon!</ThemeText>
    </ThemeView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
  },
});
