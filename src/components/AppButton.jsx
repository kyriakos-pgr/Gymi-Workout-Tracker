import { Pressable, StyleSheet } from "react-native";
import { Colors } from "../constants/Colors";

function AppButton({ style, disabled, children, ...props }) {
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
    marginVertical: 10,
  },
  pressed: {
    opacity: 0.5,
  },
  disabled: {
    opacity: 0.3,
  },
});

export default AppButton;
