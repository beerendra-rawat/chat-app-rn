// src/screens/LoginScreen.tsx
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import AppContainer from "../../components/common/AppContainer";
import AuthTabs from "../../components/auth/AuthTabs";
import CustomInput from "../../components/auth/CustomInput";
import PasswordInput from "../../components/auth/PasswordInput";
import PrimaryButton from "../../components/auth/PrimaryButton";
import SocialButton from "../../components/auth/SocialButton";

import { validateLoginForm } from "../../utils/validation";
import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../redux/store/hooks"; // ← Fixed import path

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginWithEmail, loginWithGoogle } = useAuth();
  const { loading } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    const validationErrors = validateLoginForm(email, password);
    if (validationErrors.length > 0) {
      const errorMap: any = {};
      validationErrors.forEach((err) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await loginWithEmail(email.trim(), password);

      // Important: Use reset instead of replace for clean navigation
      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();

      navigation.reset({
        index: 0,
        routes: [{ name: "MainTabs" }],
      });
    } catch (error: any) {
      Alert.alert(
        "Google Sign In Failed",
        error.message || "Something went wrong",
      );
    }
  };

  return (
    <AppContainer backgroundColor="#FAFAFA">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <AuthTabs
            activeTab="signin"
            onSignInPress={() => {}}
            onSignUpPress={() => navigation.navigate("Signup")}
          />

          <View style={styles.form}>
            <CustomInput
              label="Your Email"
              placeholder="contact@dscodetech.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              error={errors.email}
              keyboardType="email-address"
            />

            <PasswordInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              error={errors.password}
            />

            <TouchableOpacity
              style={styles.forgotContainer}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <PrimaryButton
              title="Continue"
              onPress={handleLogin}
              loading={isSubmitting || loading}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.orText}>Or</Text>
              <View style={styles.divider} />
            </View>

            <SocialButton
              title="Login with Google"
              icon={require("../../assets/img/google.png")}
              onPress={handleGoogleLogin}
              loading={loading}
            />

            <View style={styles.bottom}>
              <Text>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
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
  form: { flex: 1 },
  forgotContainer: {
    alignItems: "flex-end",
    marginVertical: 12,
  },
  forgotText: {
    color: "#4F7CF7",
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E3E3E3",
  },
  orText: {
    marginHorizontal: 16,
    color: "#A0A0A0",
  },
  bottom: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signUpLink: {
    color: "#4F7CF7",
    fontWeight: "700",
  },
});
