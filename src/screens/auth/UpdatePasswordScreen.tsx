// src/screens/auth/UpdatePasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import AppContainer from '../../components/common/AppContainer';
import BackButton from '../../components/auth/BackButton';
import AuthHeader from '../../components/auth/AuthHeader';
import PasswordInput from '../../components/auth/PasswordInput';
import PrimaryButton from '../../components/auth/PrimaryButton';

export default function UpdatePasswordScreen({ navigation }: any) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <AppContainer backgroundColor="#F7F8FA">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <BackButton onPress={() => navigation.goBack()} />

          <View style={styles.content}>
            <AuthHeader
              title="Set a new password"
              subtitle="Create a new password. Ensure it differs from previous ones for security."
            />

            <PasswordInput
              label="Password"
              value={password}
              onChangeText={setPassword}
            />

            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <PrimaryButton
              title="Update Password"
              onPress={() => navigation.navigate('Success')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
});