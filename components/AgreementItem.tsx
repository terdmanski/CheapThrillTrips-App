// components/AgreementItem.tsx
import { useAppTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomCheckbox from './CustomCheckbox';

interface AgreementItemProps {
  agreementText: string;
  checked: boolean;
  onToggle: () => void;
  onToggleShowMore: () => void;
  showMore: boolean;
}

export default function AgreementItem({
  agreementText,
  checked,
  onToggle,
  onToggleShowMore,
  showMore,
}: AgreementItemProps) {
  const { colors } = useAppTheme();

  const shortText = agreementText.length > 70 ? agreementText.slice(0, 70) + '...' : agreementText;

  return (
    <View style={styles.container}>
      <CustomCheckbox checked={checked} onPress={onToggle} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.text, { color: colors.text }]}>
          {showMore ? agreementText : shortText}
        </Text>
        {agreementText.length > 70 && (
          <TouchableOpacity onPress={onToggleShowMore}>
            <Text style={[styles.showMore, { color: '#FF6B00' }]}>
              {showMore ? 'Zwiń' : 'Pokaż więcej'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  showMore: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
  },
});
