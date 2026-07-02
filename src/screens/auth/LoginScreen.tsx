import { useState } from 'react';
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
import AuthTabs from '../../components/auth/AuthTabs';
import CustomInput from '../../components/auth/CustomInput';
import PasswordInput from '../../components/auth/PasswordInput';
import PrimaryButton from '../../components/auth/PrimaryButton';
import SocialButton from '../../components/auth/SocialButton';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <AppContainer backgroundColor="#FAFAFA">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <AuthTabs
            activeTab="signin"
            onSignInPress={() => {}}
            onSignUpPress={() => navigation.navigate('Signup')}
          />

          <View style={styles.form}>
            <CustomInput
              label="Your Email"
              placeholder="contact@dscodetech.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <PasswordInput
              label="Password"
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              style={styles.forgotContainer}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <PrimaryButton title="Continue" onPress={() => navigation.replace('MainTabs')} />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>Or</Text>
              <View style={styles.divider} />
            </View>

            {/* Temporary Comment: Add Google icon later */}
            <SocialButton
              title="Login with Google"
              icon={require('../../assets/img/google.png')}   // Adjust path if needed
              onPress={() => {}}
            />

            <View style={styles.bottom}>
              <Text>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signUpLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    // paddingHorizontal: 24,
    flex: 1,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginVertical: 12,
  },
  forgotText: {
    color: '#4F7CF7',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E3E3E3',
  },
  orText: {
    marginHorizontal: 16,
    color: '#A0A0A0',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signUpLink: {
    color: '#4F7CF7',
    fontWeight: '700',
  },
});