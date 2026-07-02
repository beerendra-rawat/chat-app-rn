// src/screens/auth/SuccessScreen.tsx
import React from 'react';
import AppContainer from '../../components/common/AppContainer';
import SuccessMessage from '../../components/auth/SuccessMessage';

export default function SuccessScreen({ navigation }: any) {
  return (
    <AppContainer backgroundColor="#F7F8FA">
      <SuccessMessage
        title="Successful"
        subtitle="Congratulations! Your password has been changed successfully. Click continue to sign in."
        buttonText="Continue"
        onPress={() => navigation.replace('Login')}
      />
    </AppContainer>
  );
}