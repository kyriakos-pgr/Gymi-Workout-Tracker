import { StyleSheet } from "react-native";
import ThemeView from "./ThemeView";

export default function SelectionCircle({ selected = false, style }) {
  return (
    <ThemeView style={[styles.outer, selected && styles.outerActive, style]}>
      {selected && <ThemeView style={styles.inner} />}
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  outerActive: {
    borderColor: "#fff",
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#ad0d0d",
  },
});
