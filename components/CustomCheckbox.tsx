// components/CustomCheckbox.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface CustomCheckboxProps {
  checked: boolean;
  onPress: () => void;
}

export default function CustomCheckbox({ checked, onPress }: CustomCheckboxProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.wrapper}>
      <View style={[styles.box, checked && styles.checked]}>
        {checked && <Ionicons name="checkmark" size={14} color="white" />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginRight: 12,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#FF6B00',
  },
});
