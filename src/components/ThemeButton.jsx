import { Pressable, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

function ThemeButton({ style, disabled, children, ...props }) {
  return (
    <Pressable
      disabled={disabled === "true" ? true : !!disabled}
      style={({ pressed }) => [
        styles.btn,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 6,
    marginVertical: 10,
  },
  pressed: {
    opacity: 0.5,
  },
  disabled: {
    opacity: 0.3,
  },
});

export default ThemeButton;
