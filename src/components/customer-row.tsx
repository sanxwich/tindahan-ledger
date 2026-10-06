import { Pressable } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type CustomerRowProps = {
  name: string;
  balance: number;
  lastPaid: string;
  onPress: () => void;
};

export function CustomerRow({
  name,
  balance,
  lastPaid,
  onPress,
}: CustomerRowProps) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: Spacing.three,
        borderBottomWidth: 1,
        borderColor: theme.backgroundSelected,
      }}
    >
      <ThemedText>{name}</ThemedText>
      <ThemedText themeColor="textSecondary">₱ {balance.toFixed(2)}</ThemedText>
      <ThemedText themeColor="textSecondary">Last Paid: {lastPaid}</ThemedText>
    </Pressable>
  );
}
