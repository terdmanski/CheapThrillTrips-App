import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface DateInputProps {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  error?: boolean;
}

export default function DateInput({ value, onChange, placeholder = 'Data urodzenia', error }: DateInputProps) {
  const { colors } = useAppTheme();
  const [visible, setVisible] = useState(false);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const show = () => {
    setVisible(true);
    Haptics.selectionAsync();
  };

  return (
    <>
      <TouchableOpacity
        onPress={show}
        style={[
          styles.input,
          { borderColor: error ? colors.error : '#DADADA', backgroundColor: colors.background },
        ]}
        activeOpacity={0.8}
      >
        <Text style={{ color: value ? colors.text : colors.placeholder }}>
          {value ? formatDate(value) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#FF6B00" />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={visible}
        mode="date"
        date={value || new Date()}
        onConfirm={(date) => {
          setVisible(false);
          onChange(date);
        }}
        onCancel={() => setVisible(false)}
        maximumDate={new Date()}
        headerTextIOS="Wybierz datę"
        confirmTextIOS="Zapisz datę"
        cancelTextIOS="Anuluj"
        accentColor="#FF6B00"
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
