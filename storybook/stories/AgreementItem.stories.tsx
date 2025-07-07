// storybook/stories/AgreementItem.stories.tsx

import AgreementItem from '@/components/AgreementItem';
import { ThemeProvider } from '@/context/ThemeContext';
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';

export default {
  title: 'Components/AgreementItem',
  component: AgreementItem,
};

export const Default = () => {
  const [checked, setChecked] = useState(false);
  const [showMore, setShowMore] = useState(false);

  return (
    <SafeAreaView>
      <ThemeProvider>
        <View style={{ padding: 16 }}>
          <AgreementItem
            checked={checked}
            onToggle={() => setChecked(!checked)}
            onToggleShowMore={() => setShowMore(!showMore)}
            showMore={showMore}
            agreementText="Zgoda na przetwarzanie danych osobowych w celach obsługi konta użytkownika oraz zapewnienia dostępu do funkcjonalności aplikacji."
          />
        </View>
      </ThemeProvider>
    </SafeAreaView>
  );
};
