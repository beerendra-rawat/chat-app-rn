// src/screens/auth/ForgotPasswordScreen.tsx
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
import CustomInput from '../../components/auth/CustomInput';
import PrimaryButton from '../../components/auth/PrimaryButton';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');

  return (
    <AppContainer backgroundColor="#F7F8FA">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <BackButton onPress={() => navigation.goBack()} />

          <View style={styles.content}>
            <AuthHeader
              title="Forgot Password"
              subtitle="Please enter your email address to reset your password"
            />

            <CustomInput
              label="Your Email"
              placeholder="contact@dscodetech.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <PrimaryButton
              title="Reset Password"
              onPress={() => navigation.navigate('VerifyCode')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
});