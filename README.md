import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DatePickerModal } from 'react-native-paper-dates';

const ProfileSetup = () => {
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [birthdateError, setBirthdateError] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setDatePickerVisible(true)} style={styles.datePickerButton}>
        <Text style={styles.datePickerButtonText}>
          {birthdate ? birthdate.toLocaleDateString('pl-PL') : 'Wybierz datę urodzenia'}
        </Text>
      </TouchableOpacity>

      <DatePickerModal
        locale="pl"
        mode="single"
        visible={datePickerVisible}
        onDismiss={() => setDatePickerVisible(false)}
        date={birthdate || undefined}
        onConfirm={({ date }) => {
          setDatePickerVisible(false);
          setBirthdate(date);
          setBirthdateError('');
        }}
        saveLabel="Zapisz datę"
        label="Data urodzenia"
        saveLabelDisabled={false}
        presentationStyle="pageSheet"
        theme={{ colors: { primary: '#FF6B00' } }}
      />

      {birthdateError ? <Text style={styles.errorText}>{birthdateError}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  datePickerButton: {
    padding: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    marginTop: 8,
    color: 'red',
  },
});

export default ProfileSetup;