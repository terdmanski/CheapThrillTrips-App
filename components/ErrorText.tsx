import { useAppTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function ErrorText({ message }: { message: string }) {
  const { colors } = useAppTheme();

  return <Text style={[styles.errorText, { color: colors.error }]}>{message}</Text>;
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: 13,
    marginTop: -12,
    marginBottom: 8,
  },
});
