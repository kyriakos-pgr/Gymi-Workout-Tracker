import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Colors } from "../../constants/Colors";

const DashboardLayout = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.navBackground,
          paddingTop: 10,
          height: 90,
        },
        tabBarActiveTintColor: theme.iconColorFocused,
        tabBarInactiveTintColor: theme.iconColor,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={24}
              name={focused ? "home" : "home-outline"}
              color={focused ? theme.iconColorFocused : theme.iconColor}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="currentprogram"
        options={{
          title: "Start Workout",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={24}
              name={focused ? "barbell" : "barbell-outline"}
              color={focused ? theme.iconColorFocused : theme.iconColor}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="programs"
        options={{
          title: "Programs",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              size={24}
              name={focused ? "library" : "library-outline"}
              color={focused ? theme.iconColorFocused : theme.iconColor}
            />
          ),
        }}
      />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="createworkout" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
      <Tabs.Screen name="progress" options={{ href: null }} />
      <Tabs.Screen name="customsplit" options={{ href: null }} />
      <Tabs.Screen name="addexercises" options={{ href: null }} />
      <Tabs.Screen name="pickexercise" options={{ href: null }} />
      <Tabs.Screen name="savedprograms" options={{ href: null }} />
      <Tabs.Screen name="builtinprograms" options={{ href: null }} />
      <Tabs.Screen name="startworkout" options={{ href: null }} />
      <Tabs.Screen name="workoutdetails" options={{ href: null }} />
      <Tabs.Screen name="beginnersprogram" options={{ href: null }} />
    </Tabs>
  );
};
export default DashboardLayout;
