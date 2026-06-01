import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function BackButton({ style, onPress, backTo }) {
  const handleBack = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (backTo) {
      router.push(backTo);
      return;
    }

    router.back();
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handleBack}
      activeOpacity={0.8}
    >
      <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ad0d0d",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    elevation: 8,
  },
});
