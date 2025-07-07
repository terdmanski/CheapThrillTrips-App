import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default {
  title: 'Form/DateInput',
};

export const Basic = () => {
  const [date, setDate] = useState<Date | null>(null);
  const [show, setShow] = useState(false);

  const formatDate = (d: Date) =>
    d.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={() => setShow(true)}
        style={styles.input}
        activeOpacity={0.8}
      >
        <Text style={{ color: date ? '#000' : '#999' }}>
          {date ? formatDate(date) : 'Data urodzenia'}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#FF6B00" />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={show}
        mode="date"
        date={date || new Date()}
        onConfirm={(selected) => {
          setDate(selected);
          setShow(false);
        }}
        onCancel={() => setShow(false)}
        headerTextIOS="Wybierz datę"
        confirmTextIOS="Zapisz"
        cancelTextIOS="Anuluj"
        accentColor="#FF6B00"
        maximumDate={new Date()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 24,
    backgroundColor: '#fff',
    flex: 1,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#DADADA',
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
});
