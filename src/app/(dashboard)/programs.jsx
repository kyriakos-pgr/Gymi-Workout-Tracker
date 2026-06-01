import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

import BackButton from "../../components/BackButton";
import HomeTopBar from "../../components/HomeTopBar";
import ThemeText from "../../components/ThemeText";
import ThemeView from "../../components/ThemeView";

export default function ProgramsScreen() {
  const cards = [
    {
      title: "Saved\nPrograms",
      icon: "folder-outline",
      route: "/savedprograms",
    },
    {
      title: "Current\nProgram",
      icon: "book-outline",
      route: "/currentprogram",
    },
    { title: "Progress", icon: "swap-vertical-outline", route: "/progress" },
    {
      title: "Beginners\nProgram",
      icon: "book-outline",
      route: "/beginnersprogram",
    },
    {
      title: "Built-In\nPrograms",
      icon: "book-outline",
      route: "/builtinprograms",
    },
    {
      title: "Create\nProgram",
      icon: "add-circle-outline",
      route: "/createworkout",
    },
  ];

  return (
    <ThemeView style={styles.container}>
      <ThemeView style={styles.content}>
        <HomeTopBar />

        <BackButton style={styles.backButton} />

        <ThemeText title={true} style={styles.heading}>
          Programs{"\n"}Section
        </ThemeText>

        <ThemeView style={styles.grid}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.title}
              style={styles.card}
              onPress={() => {
                if (card.route === "/builtinprograms") {
                  router.push({
                    pathname: "/builtinprograms",
                    params: {
                      from: "/programs",
                    },
                  });
                } else {
                  router.push(card.route);
                }
                if (card.route === "/progress") {
                  router.push({
                    pathname: "/progress",
                    params: {
                      from: "/programs",
                    },
                  });
                } else {
                  router.push(card.route);
                }
                if (card.route === "/createworkout") {
                  router.push({
                    pathname: "/createworkout",
                    params: {
                      from: "/programs",
                    },
                  });
                }
              }}
              activeOpacity={0.8}
            >
              <Ionicons name={card.icon} size={38} color="#fff" />
              <ThemeText style={styles.cardText}>{card.title}</ThemeText>
            </TouchableOpacity>
          ))}
        </ThemeView>
      </ThemeView>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 120,
    paddingBottom: 90,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  heading: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 25,
  },
  grid: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    height: 155,
    backgroundColor: "#ad0d0d",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  cardText: {
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
    marginTop: 12,
    fontWeight: "310",
  },
});
