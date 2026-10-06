import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AddCustomerModal } from "@/components/add-customer-modal";
import { CustomerRow } from "@/components/customer-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Customer, fetchCustomers } from "@/data/customers";
import { problemFor, Status } from "@/data/problem";

export default function CustomerScreen() {
  const [status, setStatus] = useState<Status>("loading");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [problem, setProblem] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");

  const [adding, setAdding] = useState(false);

  const retry = () => setAttempt((prev) => prev + 1);

  useEffect(() => {
    let live = true;
    setStatus("loading");
    fetchCustomers()
      .then((rows) => {
        if (!live) return;
        setCustomers(rows);
        setStatus(rows.length === 0 ? "empty" : "content");
      })
      .catch((e) => {
        if (!live) return;
        setProblem(problemFor(e));
        setStatus("error");
      });

    return () => {
      live = false;
    };
  }, [attempt]);

  const shown = customers.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );

  const total = shown.reduce((sum, c) => sum + c.balance, 0);

  if (status === "loading") {
    return (
      <ThemedView style={styles.middle}>
        <ActivityIndicator />
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
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.screen}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search customers"
          style={styles.search}
        />
        <ThemedText>Total owed: ₱ {total.toFixed(2)}</ThemedText>

        <Button title="Add customer" onPress={() => setAdding(true)} />

        <AddCustomerModal
          visible={adding}
          onClose={() => setAdding(false)}
          onAdded={retry}
        />

        <FlatList
          data={shown}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <CustomerRow
              {...item}
              onPress={() => router.push(`/customers/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <ThemedText>No customers match "{query}".</ThemedText>
          }
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  middle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  screen: {
    flex: 1,
    padding: 24,
    gap: 12,
  },
  search: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
});
