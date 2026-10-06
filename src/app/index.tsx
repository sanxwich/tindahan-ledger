import { Link } from "expo-router";
import {
  ActivityIndicator,
  Button,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ShareBar } from "@/components/share-bar";
import { Stat } from "@/components/stat";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { summarise } from "@/data/summary";
import { useCustomers } from "@/hooks/use-customers";

export default function DashboardScreen() {
  const { status, customers, problem, retry } = useCustomers();

  if (status === "loading") {
    return (
      <ThemedView style={styles.middle}>
        <ActivityIndicator />
        <ThemedText themeColor="textSecondary">Loading the ledger</ThemedText>
      </ThemedView>
    );
  }

  if (status === "error") {
    return (
      <ThemedView style={styles.middle}>
        <ThemedText>{problem}</ThemedText>
        <Button title="Try again" onPress={retry} />
      </ThemedView>
    );
  }

  if (status === "empty") {
    return (
      <ThemedView style={styles.middle}>
        <ThemedText>No customers yet.</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          Add the first one to see the totals.
        </ThemedText>
      </ThemedView>
    );
  }

  const summary = summarise(customers);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ThemedView style={styles.hero}>
            <ThemedText
              type="code"
              themeColor="textSecondary"
              style={styles.eyebrow}
            >
              Sari-sari store
            </ThemedText>
            <ThemedText type="title">Tindahan ni Dave</ThemedText>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <View style={styles.statRow}>
              <Stat
                label="Total owed"
                value={`₱ ${summary.total.toFixed(2)}`}
              />
              <Stat
                label="Average owed"
                value={`₱ ${summary.average.toFixed(2)}`}
              />
            </View>
            <View style={styles.statRow}>
              <Stat
                label="Still owing"
                value={`${summary.owing} of ${summary.count}`}
              />
              <Stat label="Settled" value={String(summary.settled)} />
            </View>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="small" themeColor="textSecondary">
              Share of what is owed
            </ThemedText>
            {summary.ranked.map((c) => (
              <ShareBar
                key={c.id}
                name={c.name}
                balance={c.balance}
                share={c.share}
              />
            ))}
            {summary.ranked.length === 0 && (
              <ThemedText themeColor="textSecondary">
                Everyone has paid up.
              </ThemedText>
            )}
          </ThemedView>

          <Link href="/customers" asChild>
            <Pressable style={styles.button}>
              <ThemedText style={styles.buttonText}>View customers</ThemedText>
            </Pressable>
          </Link>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", flexDirection: "row" },
  middle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
  },
  safeArea: { flex: 1, maxWidth: MaxContentWidth, width: "100%" },
  scroll: {
    paddingHorizontal: Spacing.four,
    paddingTop:
      Platform.OS === "web" ? Spacing.six + Spacing.three : Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.four,
  },
  hero: { gap: Spacing.two },
  eyebrow: { textTransform: "uppercase" },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.four,
  },
  statRow: { flexDirection: "row", gap: Spacing.four },
  button: {
    backgroundColor: "#3c87f7",
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: "center",
  },
  buttonText: { color: "#ffffff", fontWeight: 600 },
});
