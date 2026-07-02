// src/screens/auth/AccountCreateMessageScreen.tsx
import React from 'react';
import AppContainer from '../../components/common/AppContainer';
import SuccessMessage from '../../components/auth/SuccessMessage';

export default function AccountCreateMessageScreen({ navigation }: any) {
  return (
    <AppContainer backgroundColor="#F7F8FA">
      <SuccessMessage
        title="Account Created"
        subtitle="Congratulations! Your account has been created successfully. Click continue."
        buttonText="Continue"
        onPress={() => navigation.replace('Login')}   // Better to use replace
      />
    </AppContainer>
  );
}