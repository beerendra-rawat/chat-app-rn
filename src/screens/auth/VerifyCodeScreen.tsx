// src/screens/auth/VerifyCodeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import AppContainer from '../../components/common/AppContainer';
import BackButton from '../../components/auth/BackButton';
import AuthHeader from '../../components/auth/AuthHeader';
import OTPInput from '../../components/auth/OTPInput';
import PrimaryButton from '../../components/auth/PrimaryButton';

export default function VerifyCodeScreen({ navigation }: any) {
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
              title="Check your email"
              subtitle="We sent a reset link to contact@dscodetech.com. Enter the 5 digit code mentioned in the email."
            />

            <OTPInput length={5} />

            <PrimaryButton
              title="Verify Code"
              onPress={() => navigation.navigate('PasswordReset')}
            />

            <View style={styles.bottomContainer}>
              <Text style={styles.bottomText}>Haven’t got the email yet? </Text>
              <TouchableOpacity>
                <Text style={styles.resendText}>Resend email</Text>
              </TouchableOpacity>
            </View>
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
    // paddingHorizontal: 24,
    // marginTop: 8,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  bottomText: {
    fontSize: 15,
    color: '#9AA0AA',
    fontWeight: '500',
  },
  resendText: {
    fontSize: 15,
    color: '#4F7CF7',
    fontWeight: '700',
  },
});