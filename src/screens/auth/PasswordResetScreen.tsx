// src/screens/auth/PasswordResetScreen.tsx
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

import AppContainer from '../../components/common/AppContainer';
import BackButton from '../../components/auth/BackButton';
import AuthHeader from '../../components/auth/AuthHeader';
import PrimaryButton from '../../components/auth/PrimaryButton';

export default function PasswordResetScreen({ navigation }: any) {
  return (
    <AppContainer backgroundColor="#F7F8FA">
      <BackButton onPress={() => navigation.goBack()} />

      <View style={styles.content}>
        <AuthHeader
          title="Password reset"
          subtitle="Your password has been successfully reset. Click confirm to set a new password."
        />

        <PrimaryButton
          title="Confirm"
          onPress={() => navigation.navigate('UpdatePassword')}
        />
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    // paddingHorizontal: 24,
    // marginTop: 24,
  },
});