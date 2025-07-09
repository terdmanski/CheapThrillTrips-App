// components/CustomCheckbox.tsx
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

interface CustomCheckboxProps {
  checked: boolean;
  onPress: () => void;
}

export default function CustomCheckbox({ checked, onPress }: CustomCheckboxProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.checkbox}>
      {checked && <View style={styles.innerCheckbox} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#FF6B00',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCheckbox: {
    width: 12,
    height: 12,
    backgroundColor: '#FF6B00',
    borderRadius: 2,
  },
});
