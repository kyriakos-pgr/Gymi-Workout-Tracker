import { StyleSheet, TouchableOpacity } from "react-native";
import ThemeView from "./ThemeView";

export default function ToggleButton({ value, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.container, value && styles.containerActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <ThemeView style={[styles.circle, value && styles.circleActive]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 54,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 2,
  },

  containerActive: {
    backgroundColor: "#ad0d0d",
    borderColor: "#fff",
  },

  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#fff",
  },

  circleActive: {
    alignSelf: "flex-end",
  },
});
