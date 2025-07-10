import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import * as ImagePicker from 'expo-image-picker';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { DatePickerModal, registerTranslation } from 'react-native-paper-dates';
registerTranslation('pl', {
  save: 'Zapisz datę',
  selectSingle: 'Wybierz datę',
  selectMultiple: 'Wybierz daty',
  selectRange: 'Wybierz zakres',
  notAccordingToDateFormat: (inputFormat) =>
    `Data nie pasuje do formatu ${inputFormat}`,
  mustBeHigherThan: (date) => `Data musi być późniejsza niż ${date}`,
  mustBeLowerThan: (date) => `Data musi być wcześniejsza niż ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Data musi być pomiędzy ${startDate} a ${endDate}`,
  dateIsDisabled: 'Data jest wyłączona',
  previous: 'Poprzedni',
  next: 'Następny',
  typeInDate: 'Wpisz datę',
  pickDateFromCalendar: 'Wybierz datę z kalendarza',
  close: 'Zamknij',
  hour: 'Godzina',
  minute: 'Minuta',
});

// AgreementItem with animated checkmark
interface AgreementItemProps {
  checked: boolean;
  onToggle: () => void;
  text: string;
  showMore: boolean;
  onToggleShowMore: () => void;
  moreText?: string;
  shake?: boolean;
  triggerShake?: () => void;
}

const AgreementItem: React.FC<AgreementItemProps> = ({
  checked,
  onToggle,
  text,
  showMore,
  onToggleShowMore,
  moreText,
  shake = false,
  triggerShake,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;


  // Shake animation
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const translateX = shakeAnim.interpolate({
    inputRange: [-1, -0.5, 0, 0.5, 1],
    outputRange: [-8, 8, 0, -8, 8],
  });

  // Expose triggerShake to parent
  React.useImperativeHandle(
    triggerShake ? { current: { triggerShake } } : undefined,
    () => ({
      triggerShake: () => {
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 1,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -1,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 1,
            duration: 40,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 40,
            useNativeDriver: true,
          }),
        ]).start();
      },
    }),
    [shakeAnim]
  );

  // Allow parent to trigger shake
  useEffect(() => {
    if (shake && triggerShake) {
      triggerShake();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shake]);

  useEffect(() => {
    if (checked) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.5);
    }
  }, [checked]);


  return (
    <Animated.View style={{ transform: [{ translateX }] }}>
      <Animated.View
        style={[
          styles.agreementItem,
          checked && {
            backgroundColor: '#FFF2E8',
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 12,
          },
        ]}
      >
        <Pressable
          onPress={onToggle}
          android_ripple={{ color: '#FF6B00', borderless: false }}
          style={({ pressed }) => [
            styles.checkbox,
            pressed && { opacity: 0.8 },
            checked && styles.checkboxChecked,
          ]}
        >
          {checked && (
            <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
              <LottieView
                source={require('../../assets/lottie/checkmark.json')}
                autoPlay
                loop={false}
                style={{ width: 24, height: 24 }}
                resizeMode="cover"
              />
            </Animated.View>
          )}
        </Pressable>
        <View style={{ flex: 1 }}>
          {/* Show orange star only if text ends with ' *' */}
          {/\s\*$/.test(text) ? (
            <Text style={styles.agreementText}>
              {text.replace(/\s\*$/, '')}
              <Text style={{ color: '#FF6B00' }}> *</Text>
            </Text>
          ) : (
            <Text style={styles.agreementText}>{text}</Text>
          )}
          {moreText && (
            <>
              <TouchableOpacity
                onPress={onToggleShowMore}
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}
              >
                <Text style={styles.showMoreText}>
                  {showMore ? 'Pokaż mniej' : 'Pokaż więcej'}
                </Text>
                <Ionicons
                  name={showMore ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#FF6B00"
                  style={{ marginLeft: 4 }}
                />
              </TouchableOpacity>
              {showMore && (
                <Text style={styles.moreAgreementText}>{moreText}</Text>
              )}
            </>
          )}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const defaultProfileImage =
  'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const today = new Date();
today.setHours(0, 0, 0, 0);
const maxDate = new Date(today.getTime() - 86400000);

const ProfileSetup: React.FC = () => {
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Birthdate state
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [birthdateError, setBirthdateError] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  // Animated opacity for fade-in
  const birthdateOpacity = useRef(new Animated.Value(1)).current;

  // Telefon state
  const [phoneNumber, setPhoneNumber] = useState('');
  // Helper to format phone number
  const formatPhoneNumber = (input: string) => {
    const cleaned = input.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+')) return '+';
    const digitsOnly = cleaned.slice(1).replace(/\D/g, '');
    const groups = digitsOnly.match(/.{1,3}/g) || [];
    return '+' + groups.join(' ');
  };

  // Validation states
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [bioError, setBioError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Agreements
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedMarketing, setAgreedMarketing] = useState(false);
  const [showTermsMore, setShowTermsMore] = useState(false);
  const [showPrivacyMore, setShowPrivacyMore] = useState(false);
  const [showMarketingMore, setShowMarketingMore] = useState(false);
  // Shake state for agreements
  const [shakeTerms, setShakeTerms] = useState(false);
  const [shakePrivacy, setShakePrivacy] = useState(false);
  // Refs to trigger shake
  const termsShakeRef = useRef<{ triggerShake: () => void } | null>(null);
  const privacyShakeRef = useRef<{ triggerShake: () => void } | null>(null);

  // Theme
  const [darkMode, setDarkMode] = useState(false);

  // Success overlay state
  const [showSuccess, setShowSuccess] = useState(false);

  // Refs for scrolling to error fields
  const scrollViewRef = useRef<ScrollView>(null);
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const bioRef = useRef<TextInput>(null);

  // Validation functions
  const validateFirstName = () => {
    if (!firstName.trim()) {
      setFirstNameError('Imię jest wymagane.');
      return false;
    }
    setFirstNameError('');
    return true;
  };
  const validateLastName = () => {
    if (!lastName.trim()) {
      setLastNameError('Nazwisko jest wymagane.');
      return false;
    }
    setLastNameError('');
    return true;
  };
  // Email validation removed (email is not required nor validated)
  const validateBio = () => {
    if (bio.length > 160) {
      setBioError('Bio nie może przekraczać 160 znaków.');
      return false;
    }
    setBioError('');
    return true;
  };

  // Birthdate validation
  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);
  const handleConfirmDate = (date: Date) => {
    // Fade out, set date, then fade in
    birthdateOpacity.setValue(0);
    setBirthdate(date);
    setBirthdateError('');
    hideDatePicker();
    Animated.timing(birthdateOpacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  };
  const validateBirthdate = () => {
    if (!birthdate || birthdate >= today) {
      setBirthdateError('Nie można wybrać dzisiejszej ani przyszłej daty.');
      return false;
    }
    setBirthdateError('');
    return true;
  };

  // Image picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Form submission
  const handleSubmit = async () => {
    setFormError('');
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isBioValid = validateBio();
    const isBirthdateValid = validateBirthdate();
    if (!isFirstNameValid) {
      scrollToInput(firstNameRef);
      return;
    }
    if (!isLastNameValid) {
      scrollToInput(lastNameRef);
      return;
    }
    if (!isBioValid) {
      scrollToInput(bioRef);
      return;
    }
    if (!isBirthdateValid) {
      return;
    }
    // Shake effect for agreements
    let anyError = false;
    if (!agreedTerms) {
      setShakeTerms(true);
      if (termsShakeRef.current && typeof termsShakeRef.current.triggerShake === 'function') {
        termsShakeRef.current.triggerShake();
      }
      anyError = true;
    }
    if (!agreedPrivacy) {
      setShakePrivacy(true);
      if (privacyShakeRef.current && typeof privacyShakeRef.current.triggerShake === 'function') {
        privacyShakeRef.current.triggerShake();
      }
      anyError = true;
    }
    if (anyError) {
      setFormError('Musisz zaakceptować regulamin i politykę prywatności.');
      // Reset shake after animation
      setTimeout(() => {
        setShakeTerms(false);
        setShakePrivacy(false);
      }, 350);
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1200);
  };

  const scrollToInput = (ref: React.RefObject<TextInput | null>) => {
    setTimeout(() => {
      ref.current?.focus();
    }, 300);
  };

  // Theme colors
  const theme = darkMode
    ? {
        background: '#181818',
        text: '#fff',
        inputBg: '#222',
        border: '#333',
        placeholder: '#aaa',
        error: '#FF6B00',
        buttonBg: '#FF6B00',
        buttonText: '#fff',
        agreementBg: '#222',
      }
    : {
        background: '#fff',
        text: '#181818',
        inputBg: '#f7f7f7',
        border: '#dadada',
        placeholder: '#888',
        error: '#FF6B00',
        buttonBg: '#FF6B00',
        buttonText: '#fff',
        agreementBg: '#f7f7f7',
      };

  // Ref for submit button animation
  const submitScale = useRef(new Animated.Value(1)).current;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[
          styles.headerRow,
          {
            backgroundColor: theme.background,
            paddingHorizontal: 24,
            paddingTop: 44,
            paddingBottom: 16,
          }
        ]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Ustaw swój profil</Text>
          <View style={styles.themeSwitchRow}>
            <Ionicons name={darkMode ? 'moon' : 'sunny'} size={20} color={theme.text} />
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              thumbColor={darkMode ? '#FF6B00' : '#fff'}
              trackColor={{ false: '#dadada', true: '#333' }}
              style={{ marginLeft: 8 }}
            />
          </View>
        </View>
        <View style={{ paddingTop: 4 }}>
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: profileImage || defaultProfileImage,
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              <MaterialIcons name="edit" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Form fields */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Imię *</Text>
            <TextInput
              ref={firstNameRef}
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: firstNameError ? theme.error : theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Wprowadź imię"
              placeholderTextColor={theme.placeholder}
              value={firstName}
              onChangeText={(text) => setFirstName(text.replace(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, ''))}
              onBlur={validateFirstName}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
            />
            {firstNameError ? (
              <Text style={[styles.errorText, { color: theme.error }]}>{firstNameError}</Text>
            ) : null}
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Nazwisko *</Text>
            <TextInput
              ref={lastNameRef}
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: lastNameError ? theme.error : theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Wprowadź nazwisko"
              placeholderTextColor={theme.placeholder}
              value={lastName}
              onChangeText={(text) => setLastName(text.replace(/[^a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ \-]/g, ''))}
              onBlur={validateLastName}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
            {lastNameError ? (
              <Text style={[styles.errorText, { color: theme.error }]}>{lastNameError}</Text>
            ) : null}
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>E-mail *</Text>
            {/* Wartość email pochodzi z Clerk i nie jest edytowalna */}
            <TextInput
              ref={emailRef}
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              value={email}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Data urodzenia *</Text>
            <TouchableOpacity
              onPress={showDatePicker}
            >
              <View
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: isDatePickerVisible
                      ? '#FF6B00'
                      : (birthdateError ? theme.error : theme.border),
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}
              >
                <Animated.View style={{ flex: 1, opacity: birthdateOpacity }}>
                  <Text
                    style={{
                      color: birthdate ? theme.text : '#aaa',
                      fontStyle: 'italic',
                      opacity: 0.7,
                    }}
                  >
                    {birthdate
                      ? format(birthdate, 'dd.MM.yyyy', { locale: pl })
                      : 'DD.MM.RRRR'}
                  </Text>
                </Animated.View>
                <View style={{ marginLeft: 8 }}>
                  <Ionicons name="calendar-outline" size={20} color="#FF6B00" />
                </View>
              </View>
            </TouchableOpacity>
            {birthdateError ? (
              <Text style={[styles.errorText, { color: theme.error }]}>{birthdateError}</Text>
            ) : null}
          </View>

          {/* Telefon field */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Telefon</Text>
            <View
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                },
              ]}
            >
              <Text style={{ color: theme.text }}>+</Text>
              <TextInput
                style={{ flex: 1, color: theme.text }}
                keyboardType="number-pad"
                value={phoneNumber}
                onChangeText={(text) => {
                  const digits = text.replace(/\D/g, '').slice(0, 11);
                  const parts = digits.match(/^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,3})$/);
                  if (parts) {
                    const [, p1, p2, p3, p4] = parts;
                    const formatted =
                      (p1 ? p1 : '') +
                      (p2 ? ' ' + p2 : '') +
                      (p3 ? ' ' + p3 : '') +
                      (p4 ? ' ' + p4 : '');
                    setPhoneNumber(formatted.trim());
                  }
                }}
                placeholder="99 222 999 777"
                placeholderTextColor={theme.placeholder}
                maxLength={14}
              />
            </View>
          </View>

            <DatePickerModal
              locale="pl"
              mode="single"
              visible={isDatePickerVisible}
              onDismiss={() => setDatePickerVisible(false)}
              date={birthdate ?? undefined}
              onConfirm={({ date }) => {
                if (!date) {
                  setBirthdateError('Nie wybrano daty.');
                  return;
                }
                if (date >= today) {
                  setBirthdateError('Nie można wybrać dzisiejszej ani przyszłej daty.');
                  return;
                }
                handleConfirmDate(date);
              }}
              saveLabel="Zapisz datę"
              label="Data urodzenia"
              saveLabelDisabled={false}
              presentationStyle="pageSheet"
              animationType="slide"
              validRange={{ endDate: maxDate }}
            />
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Bio</Text>
            <TextInput
              ref={bioRef}
              style={[
                styles.input,
                styles.bioInput,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: bioError ? theme.error : theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Opowiedz coś o sobie (max 160 znaków)"
              placeholderTextColor={theme.placeholder}
              value={bio}
              onChangeText={setBio}
              onBlur={validateBio}
              multiline
              maxLength={160}
            />
            <View style={styles.bioCountRow}>
              <Text style={{ color: theme.placeholder, fontSize: 13 }}>{bio.length}/160</Text>
            </View>
            {bioError ? (
              <Text style={[styles.errorText, { color: theme.error }]}>{bioError}</Text>
            ) : null}
          </View>
          {/* Agreements */}
          <View style={[styles.formGroup, { marginBottom: 6 }]}>
            <Text style={[
              styles.label,
              {
                color: theme.text,
                fontWeight: '700',
                marginTop: 24,
                letterSpacing: 0.1,
                fontSize: 16,
              }
            ]}>
              Zgody użytkownika *
            </Text>
          </View>
          <View style={[styles.agreementsContainer, { backgroundColor: theme.agreementBg }]}>
            <AgreementItem
              checked={agreedTerms}
              onToggle={() => {
                setAgreedTerms((prev) => !prev);
                setShakeTerms(false);
              }}
              text="Akceptuję regulamin CheapThrillTrips *"
              showMore={showTermsMore}
              onToggleShowMore={() => setShowTermsMore((prev) => !prev)}
              moreText="Pełen regulamin znajdziesz na naszej stronie internetowej. Akceptując regulamin, zgadzasz się na zasady korzystania z aplikacji."
              shake={shakeTerms}
              triggerShake={() => {
                if (termsShakeRef.current && typeof termsShakeRef.current.triggerShake === 'function') {
                  termsShakeRef.current.triggerShake();
                }
              }}
              ref={termsShakeRef}
            />
            <AgreementItem
              checked={agreedPrivacy}
              onToggle={() => {
                setAgreedPrivacy((prev) => !prev);
                setShakePrivacy(false);
              }}
              text="Akceptuję politykę prywatności *"
              showMore={showPrivacyMore}
              onToggleShowMore={() => setShowPrivacyMore((prev) => !prev)}
              moreText="Twoje dane są przetwarzane zgodnie z naszą polityką prywatności. Dbamy o bezpieczeństwo Twoich informacji."
              shake={shakePrivacy}
              triggerShake={() => {
                if (privacyShakeRef.current && typeof privacyShakeRef.current.triggerShake === 'function') {
                  privacyShakeRef.current.triggerShake();
                }
              }}
              ref={privacyShakeRef}
            />
            <AgreementItem
              checked={agreedMarketing}
              onToggle={() => setAgreedMarketing((prev) => !prev)}
              text="Chcę otrzymywać informacje marketingowe"
              showMore={showMarketingMore}
              onToggleShowMore={() => setShowMarketingMore((prev) => !prev)}
              moreText="Zaznaczając tę opcję, wyrażasz zgodę na otrzymywanie informacji o promocjach i nowościach."
            />
          </View>
          {/* Form error */}
          {formError ? (
            <Text style={[styles.formError, { color: theme.error }]}>{formError}</Text>
          ) : null}
          {/* Submit button */}
          <Animated.View style={{ transform: [{ scale: submitScale }] }}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: theme.buttonBg,
                  opacity:
                    isSubmitting ||
                    !firstName ||
                    !lastName ||
                    !agreedTerms ||
                    !agreedPrivacy
                      ? 0.6
                      : 1,
                },
              ]}
              onPress={() => {
                Animated.sequence([
                  Animated.timing(submitScale, {
                    toValue: 0.96,
                    duration: 80,
                    useNativeDriver: true,
                  }),
                  Animated.timing(submitScale, {
                    toValue: 1,
                    duration: 120,
                    useNativeDriver: true,
                  }),
                ]).start(() => handleSubmit());
              }}
              disabled={
                isSubmitting ||
                !firstName ||
                !lastName ||
                !agreedTerms ||
                !agreedPrivacy
              }
            >
              {isSubmitting ? (
                <Text style={[styles.submitButtonText, { color: theme.buttonText }]}>
                  Przetwarzanie...
                </Text>
              ) : (
                <Text style={[styles.submitButtonText, { color: theme.buttonText }]}>
                  Zatwierdź profil
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
      {/* Success overlay */}
      {showSuccess && (
        <View style={styles.successOverlay}>
          <LottieView
            source={require('../../assets/lottie/success-celebration.json')}
            autoPlay
            loop={false}
            style={{ width: 200, height: 200 }}
          />
          <Text style={styles.successText}>🎉 Gratulacje!</Text>
          <Text style={styles.successSubText}>Twój profil został utworzony</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingTop: 44, // removed, now handled in contentContainerStyle
    paddingHorizontal: 24,
    paddingBottom: 48,
    minHeight: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    // Usunięto cień i sticky style
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  themeSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  imagePickerButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B00',
    borderRadius: 16,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  bioInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  bioCountRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  errorText: {
    marginTop: 4,
    fontSize: 13,
  },
  agreementsContainer: {
    borderRadius: 8,
    padding: 14,
    marginTop: 8,
    marginBottom: 24,
  },
  agreementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#FFE5D1', // lekko podświetlony po zaznaczeniu
  },
  agreementText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  showMoreText: {
    color: '#FF6B00',
    marginTop: 4,
    fontWeight: '500',
    fontSize: 13,
  },
  moreAgreementText: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
  formError: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 15,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  successText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FF6B00',
    marginTop: 16,
  },
  successSubText: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
});

export default ProfileSetup;