import { Link, router } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { Colors } from "../../constants/Colors";

//context
import { useUser } from "../../contexts/AuthContext";

//lib--appwrite
import { useState } from "react";
import { ID } from "react-native-appwrite";
import { account, config, databases } from "../../lib/appwrite";

// themed components
import BackButton from "../../components/BackButton";
import Spacer from "../../components/Spacer";
import ThemeButton from "../../components/ThemeButton";
import ThemeText from "../../components/ThemeText";
import ThemeTextInput from "../../components/ThemeTextInput";
import ThemeView from "../../components/ThemeView";

export default function RegisterScreen() {
  //appwrite--states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { checkUser } = useUser();

  const handleSubmit = async () => {
    setError(null);

    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username,
      );

      try {
        await account.deleteSession("current");
      } catch (error) {
        console.log("No active session");
      }

      await account.createEmailPasswordSession(email, password);

      await databases.createDocument(
        config.databaseId,
        config.profilesTableId,
        ID.unique(),
        {
          userid: newAccount.$id,
          username: username,
          onboardingCompleted: false,
        },
      );

      await checkUser();
      router.replace("/(dashboard)");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ThemeView style={styles.container}>
      <BackButton
        style={{
          position: "absolute",
          top: 60,
          left: 20,
        }}
      />
      <ThemeText>Create an Account</ThemeText>
      <Spacer height={70} />

      <ThemeTextInput
        style={{ width: "80%", marginBottom: 20 }}
        placeholder="Username"
        onChangeText={setUsername}
        value={username}
      />

      <ThemeTextInput
        style={{ width: "80%", marginBottom: 20 }}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      <ThemeTextInput
        style={{ width: "80%", marginBottom: 20 }}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      <ThemeButton onPress={handleSubmit}>
        <Text style={{ color: "#f2f2f2" }}>Register</Text>
      </ThemeButton>

      <Spacer />
      {error && <Text style={styles.error}>{error}</Text>}

      <Link href="/auth/login" replace>
        <ThemeText style={{ textAlign: "center" }}>Login instead</ThemeText>
      </Link>
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
  title: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30,
  },
  btn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.8,
  },
  error: {
    color: Colors.warning,
    marginTop: 10,
    textAlign: "center",
  },
});
