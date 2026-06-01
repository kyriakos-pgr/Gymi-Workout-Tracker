import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeTopBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { top: insets.top }]}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push("/profile")}
      >
        <Ionicons name="person-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => router.push("/settings")}
      >
        <Ionicons name="settings-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 187,
    height: 70,
    backgroundColor: "#ad0d0d",
    borderBottomLeftRadius: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    zIndex: 10,
    paddingTop: 20,
  },

  iconButton: {
    width: 50,
    height: 45,
    borderRadius: 21,
    alignItems: "right",
    justifyContent: "right",
  },
});
