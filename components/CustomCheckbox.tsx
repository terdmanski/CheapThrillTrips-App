import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface AgreementItemProps {
  agreementText?: string;
  checked: boolean;
  onToggle: () => void;
  showMore: boolean;
  onToggleShowMore: () => void;
}

export default function AgreementItem({ agreementText = '', checked, onToggle, showMore, onToggleShowMore }: AgreementItemProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={onToggle} style={{ width: 24, height: 24, borderWidth: 1, borderColor: 'black', marginRight: 12, justifyContent: 'center', alignItems: 'center' }}>
        {checked && <View style={{ width: 16, height: 16, backgroundColor: 'black' }} />}
      </TouchableOpacity>
      <Text>{agreementText}</Text>
      <Text style={{ color: 'blue', marginLeft: 12 }} onPress={onToggleShowMore}>
        {showMore ? 'Zwiń' : 'Pokaż więcej'}
      </Text>
    </View>
  );
}
