import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface CustomCheckboxProps {
  checked: boolean;
  onPress: () => void;
}

export default function CustomCheckbox({ checked, onPress }: CustomCheckboxProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={[styles.checkbox, checked && styles.checked]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // styles for TouchableOpacity container
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
  },
  checked: {
    backgroundColor: '#000',
  },
});
