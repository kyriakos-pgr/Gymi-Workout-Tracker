import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";

//context
import { useUser } from "../contexts/AuthContext";

//themed components
import ThemeView from "../components/ThemeView";

export default function Index() {
  const { user, loading } = useUser();
  if (loading) {
    return (
      <ThemeView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator />
      </ThemeView>
    );
  }

  if (user) {
    return <Redirect href="/(dashboard)" />;
  } else {
    return <Redirect href="/auth/login" />;
  }
}
