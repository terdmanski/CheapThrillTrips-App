import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// AgreementItem component as it was before CustomCheckbox refactor
interface AgreementItemProps {
  checked: boolean;
  onToggle: () => void;
  text: string;
  showMore: boolean;
  onToggleShowMore: () => void;
  moreText?: string;
}

const AgreementItem: React.FC<AgreementItemProps> = ({
  checked,
  onToggle,
  text,
  showMore,
  onToggleShowMore,
  moreText,
}) => (
  <View style={styles.agreementItem}>
    <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
      {checked && <Ionicons name="checkmark" size={20} color="#FF6B00" />}
    </TouchableOpacity>
    <View style={{ flex: 1 }}>
      <Text style={styles.agreementText}>{text}</Text>
      {moreText && (
        <>
          <TouchableOpacity onPress={onToggleShowMore}>
            <Text style={styles.showMoreText}>
              {showMore ? 'Pokaż mniej' : 'Pokaż więcej'}
            </Text>
          </TouchableOpacity>
          {showMore && (
            <Text style={styles.moreAgreementText}>{moreText}</Text>
          )}
        </>
      )}
    </View>
  </View>
);

const defaultProfileImage =
  'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const ProfileSetup: React.FC = () => {
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

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

  // Theme
  const [darkMode, setDarkMode] = useState(false);

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
  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email jest wymagany.');
      return false;
    }
    // Simple email regex
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      setEmailError('Nieprawidłowy adres email.');
      return false;
    }
    setEmailError('');
    return true;
  };
  const validateBio = () => {
    if (bio.length > 160) {
      setBioError('Bio nie może przekraczać 160 znaków.');
      return false;
    }
    setBioError('');
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
    const isEmailValid = validateEmail();
    const isBioValid = validateBio();
    if (!isFirstNameValid) {
      scrollToInput(firstNameRef);
      return;
    }
    if (!isLastNameValid) {
      scrollToInput(lastNameRef);
      return;
    }
    if (!isEmailValid) {
      scrollToInput(emailRef);
      return;
    }
    if (!isBioValid) {
      scrollToInput(bioRef);
      return;
    }
    if (!agreedTerms || !agreedPrivacy) {
      setFormError('Musisz zaakceptować regulamin i politykę prywatności.');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Profil został utworzony!');
    }, 1200);
  };

  const scrollToInput = (ref: React.RefObject<TextInput>) => {
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
        <View style={styles.headerRow}>
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
          <Text style={[styles.label, { color: theme.text }]}>Imię</Text>
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
            onChangeText={setFirstName}
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
          <Text style={[styles.label, { color: theme.text }]}>Nazwisko</Text>
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
            onChangeText={setLastName}
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
          <Text style={[styles.label, { color: theme.text }]}>Email</Text>
          <TextInput
            ref={emailRef}
            style={[
              styles.input,
              {
                backgroundColor: theme.inputBg,
                borderColor: emailError ? theme.error : theme.border,
                color: theme.text,
              },
            ]}
            placeholder="Wprowadź email"
            placeholderTextColor={theme.placeholder}
            value={email}
            onChangeText={setEmail}
            onBlur={validateEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => bioRef.current?.focus()}
          />
          {emailError ? (
            <Text style={[styles.errorText, { color: theme.error }]}>{emailError}</Text>
          ) : null}
        </View>
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
        <View style={[styles.agreementsContainer, { backgroundColor: theme.agreementBg }]}>
          <AgreementItem
            checked={agreedTerms}
            onToggle={() => setAgreedTerms((prev) => !prev)}
            text="Akceptuję regulamin CheapThrillTrips"
            showMore={showTermsMore}
            onToggleShowMore={() => setShowTermsMore((prev) => !prev)}
            moreText="Pełen regulamin znajdziesz na naszej stronie internetowej. Akceptując regulamin, zgadzasz się na zasady korzystania z aplikacji."
          />
          <AgreementItem
            checked={agreedPrivacy}
            onToggle={() => setAgreedPrivacy((prev) => !prev)}
            text="Akceptuję politykę prywatności"
            showMore={showPrivacyMore}
            onToggleShowMore={() => setShowPrivacyMore((prev) => !prev)}
            moreText="Twoje dane są przetwarzane zgodnie z naszą polityką prywatności. Dbamy o bezpieczeństwo Twoich informacji."
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
        <TouchableOpacity
          style={[
            styles.submitButton,
            {
              backgroundColor: theme.buttonBg,
              opacity:
                isSubmitting ||
                !firstName ||
                !lastName ||
                !email ||
                !agreedTerms ||
                !agreedPrivacy
                  ? 0.6
                  : 1,
            },
          ]}
          onPress={handleSubmit}
          disabled={
            isSubmitting ||
            !firstName ||
            !lastName ||
            !email ||
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
    minHeight: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
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
    marginBottom: 14,
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
  agreementText: {
    fontSize: 14,
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
});

export default ProfileSetup;
