// ProfileSetup.tsx
import AgreementItem from '@/components/AgreementItem';
import ErrorText from '@/components/ErrorText';
import GenderPicker from '@/components/GenderPicker';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function ProfileSetup() {
  const { mode, colors, toggleMode } = useAppTheme();
  const [fadeAnim] = useState(new Animated.Value(1));
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const toggleModeWithFade = useCallback(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      toggleMode();
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    });
  }, [fadeAnim, toggleMode]);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState<string | null>(null);
  const [openGender, setOpenGender] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [phone, setPhone] = useState('');
  const [checkboxes, setCheckboxes] = useState([false, false, false]);
  const [showMore, setShowMore] = useState([false, false, false]);
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const nameInputRef = useRef(null);
  const surnameInputRef = useRef(null);

  const agreementTexts = [
    'Zgoda na przetwarzanie danych osobowych...',
    'Zgoda na przetwarzanie danych w celach marketingowych...',
    'Zgoda na przetwarzanie danych lokalizacyjnych...',
  ];

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    const mediaResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted || !mediaResult.granted) {
      alert('Odmowa dostępu do kamery lub galerii!');
      return;
    }

    Alert.alert('Zdjęcie profilowe', 'Wybierz źródło', [
      {
        text: 'Zrób zdjęcie',
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 1 });
          if (!result.canceled) setImage(result.assets[0].uri);
        },
      },
      {
        text: 'Wybierz z galerii',
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 1 });
          if (!result.canceled) setImage(result.assets[0].uri);
        },
      },
      { text: 'Anuluj', style: 'cancel' },
    ]);
  };

  const toggleCheckbox = (index: number) => {
    const updated = [...checkboxes];
    updated[index] = !checkboxes[index];
    setCheckboxes(updated);
    Haptics.selectionAsync();
  };

  const toggleShowMore = (index: number) => {
    const updated = [...showMore];
    updated[index] = !updated[index];
    setShowMore(updated);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formatPhoneNumber = (input: string) => {
    let digits = input.replace(/[^\d+]/g, '');
    if (!digits.startsWith('+')) digits = '+' + digits.replace('+', '');
    const parts = digits.replace(/\D/g, '').match(/(\d{2})(\d{3})(\d{3})(\d{3})/);
    return parts ? `+${parts[1]} ${parts[2]} ${parts[3]} ${parts[4]}` : digits;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = 'To pole jest wymagane';
    if (!surname) newErrors.surname = 'To pole jest wymagane';
    if (!gender) newErrors.gender = 'To pole jest wymagane';
    if (!checkboxes.every(Boolean)) newErrors.checkboxes = 'Wszystkie zgody są wymagane';
    const phoneRegex = /^\+\d{2} \d{3} \d{3} \d{3}$/;
    if (!phone || !phoneRegex.test(phone)) {
      newErrors.phone = 'Numer musi mieć format +48 600 100 200';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAndSubmit = () => {
    if (!validate()) {
      ToastAndroid.show('Uzupełnij wymagane pola', ToastAndroid.SHORT);
      return;
    }
    setSaving(true);
    setTimeout(() => {
      Alert.alert('Sukces', 'Profil zapisany!');
      setSaving(false);
    }, 1500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Toggle Dark/Light */}
      <View style={{ position: 'absolute', top: 56, right: 16, zIndex: 999 }}>
        <TouchableOpacity onPress={toggleModeWithFade} hitSlop={12}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Ionicons name={mode === 'light' ? 'moon' : 'sunny'} size={28} color={colors.text} />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Avatar */}
          <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
            {image ? <Image source={{ uri: image }} style={styles.avatar} /> : <Text style={styles.avatarPlus}>+</Text>}
          </TouchableOpacity>

          <Text style={styles.note}>Pola oznaczone * są obowiązkowe</Text>

          {/* Name */}
          <TextInput
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            value={name}
            onChangeText={setName}
            placeholder="Imię *"
            style={[styles.input, focusedField === 'name' && styles.inputFocus]}
            placeholderTextColor={colors.placeholder}
          />
          {errors.name && <ErrorText message={errors.name} />}

          {/* Surname */}
          <TextInput
            onFocus={() => setFocusedField('surname')}
            onBlur={() => setFocusedField(null)}
            value={surname}
            onChangeText={setSurname}
            placeholder="Nazwisko *"
            style={[styles.input, focusedField === 'surname' && styles.inputFocus]}
            placeholderTextColor={colors.placeholder}
          />
          {errors.surname && <ErrorText message={errors.surname} />}

          {/* Gender */}
          <GenderPicker open={openGender} value={gender} setOpen={setOpenGender} setValue={setGender} error={!!errors.gender} />
          {errors.gender && <ErrorText message={errors.gender} />}

          {/* Date Picker */}
          <TouchableOpacity
            style={[
              styles.input,
              styles.dateInput,
              showDatePicker && { borderColor: '#FF6B00' },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: birthDate ? colors.text : colors.placeholder }}>
              {birthDate ? formatDate(birthDate) : 'Data urodzenia'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#FF6B00" />
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            date={birthDate || new Date()}
            onConfirm={(date) => {
              setBirthDate(date);
              setShowDatePicker(false);
            }}
            onCancel={() => setShowDatePicker(false)}
            maximumDate={new Date()}
            headerTextIOS="Wybierz datę"
            confirmTextIOS="Zapisz datę"
            cancelTextIOS="Anuluj"
            accentColor="#FF6B00"
          />

          {/* Phone */}
          <TextInput
            value={phone}
            onChangeText={(text) => setPhone(formatPhoneNumber(text))}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
            placeholder="+48 600 100 200"
            keyboardType="phone-pad"
            style={[styles.input, focusedField === 'phone' && styles.inputFocus]}
            placeholderTextColor={colors.placeholder}
          />
          {errors.phone && <ErrorText message={errors.phone} />}

          {/* Agreements */}
          <Text style={[styles.label, { marginTop: 16 }]}>Zgody użytkownika *</Text>
          {agreementTexts.map((text, index) => (
            <View key={index}>
              <AgreementItem
                agreementText={text}
                checked={checkboxes[index]}
                onToggle={() => toggleCheckbox(index)}
                onToggleShowMore={() => toggleShowMore(index)}
                showMore={showMore[index]}
              />
            </View>
          ))}
          {errors.checkboxes && <ErrorText message={errors.checkboxes} />}

          {/* Submit */}
          <TouchableOpacity
            style={[styles.button, !name || !surname || !gender || saving ? { opacity: 0.6 } : null]}
            onPress={validateAndSubmit}
            disabled={!name || !surname || !gender || saving}
            activeOpacity={0.9}
          >
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>ZAPISZ</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 80 },
  avatarWrapper: {
    marginTop: 56, alignSelf: 'center', width: 100, height: 100,
    borderRadius: 50, borderWidth: 2, borderColor: '#FF6B00',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  avatar: { width: '100%', height: '100%', borderRadius: 50 },
  avatarPlus: { fontSize: 36, color: '#FF6B00' },
  note: { textAlign: 'center', fontSize: 13, color: '#888', marginBottom: 16 },
  input: {
    borderWidth: 1, borderColor: '#DADADA', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12,
    color: '#000',
  },
  inputFocus: { borderColor: '#FF6B00' },
  dateInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 14, color: '#888', marginBottom: 8, fontWeight: '500' },
  button: {
    backgroundColor: '#FF6B00',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
