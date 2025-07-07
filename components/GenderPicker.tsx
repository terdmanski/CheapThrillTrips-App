// components/GenderPicker.tsx
import { useAppTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

interface GenderPickerProps {
  open: boolean;
  value: string | null;
  setOpen: (open: boolean) => void;
  setValue: (callback: (currValue: string | null) => string | null) => void;
  error?: boolean;
}

export default function GenderPicker({
  open,
  value,
  setOpen,
  setValue,
  error = false,
}: GenderPickerProps) {
  const { colors } = useAppTheme();

  const genders = [
    { label: 'Mężczyzna', value: 'Mężczyzna' },
    { label: 'Kobieta', value: 'Kobieta' },
    { label: 'Niebinarna', value: 'Niebinarna' },
  ];

  return (
    <View style={{ zIndex: 1000 }}>
      <DropDownPicker
        open={open}
        value={value}
        items={genders}
        setOpen={setOpen}
        setValue={setValue}
        placeholder="Płeć *"
        placeholderStyle={{ color: colors.placeholder }}
        style={[
          styles.dropdown,
          {
            backgroundColor: colors.background,
            borderColor: open
              ? '#FF6B00'
              : error
              ? '#FF3B30'
              : '#DADADA',
          },
        ]}
        dropDownContainerStyle={{
          borderColor: '#DADADA',
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: colors.background,
        }}
        listItemContainerStyle={{ paddingHorizontal: 14 }}
        textStyle={{
          color: colors.text,
          fontSize: 16,
        }}
        selectedItemContainerStyle={{ backgroundColor: '#FFEDE2' }}
        selectedItemLabelStyle={{
          fontWeight: 'bold',
          color: '#FF6B00',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 4,
  },
});
