import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";

import AppContainer from "../../components/common/AppContainer";
import BackButton from "../../components/auth/BackButton";
import AuthHeader from "../../components/auth/AuthHeader";
import CustomInput from "../../components/auth/CustomInput";
import PasswordInput from "../../components/auth/PasswordInput";
import PrimaryButton from "../../components/auth/PrimaryButton";
import AuthLoadingOverlay from "../../components/auth/AuthLoadingOverlay";

import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../redux/store/hooks";
import { validateSignupForm } from "../../utils/validation";

export default function SignupScreen({ navigation }: any) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signupWithEmail } = useAuth();
  const { loading } = useAppSelector((state) => state.auth);

  const handleSignup = async () => {
    const errors = validateSignupForm(fullName, email, password);
    if (errors.length > 0) {
      Alert.alert("Validation Error", errors[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      await signupWithEmail(fullName, email, password);

      // ✅ fixed — no signOut, no manual navigation, no suppressNavigation flag.
      // Firebase's createUserWithEmailAndPassword already signs the user in;
      // once the auth listener updates Redux `user`, RootNavigator switches
      // to MainTabs automatically. This works WITH Firebase's behavior
      // instead of fighting it, which eliminates every timing race we were
      // chasing before. isSubmitting stays true until this screen unmounts.
    } catch (error: any) {
      setIsSubmitting(false); // only clear on failure — success keeps overlay up until unmount
      Alert.alert("Signup Failed", error.message || "Something went wrong.");
    }
  };

  return (
    <AppContainer backgroundColor="#F7F8FA">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <BackButton onPress={() => navigation.goBack()} />

          <AuthHeader
            title="Create Account"
            subtitle="Create your account and start chatting"
          />

          <View style={styles.form}>
            <CustomInput
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
            />

            <CustomInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <PasswordInput
              label="Create Password"
              value={password}
              onChangeText={setPassword}
            />

            <PrimaryButton
              title="Create Account"
              onPress={handleSignup}
              loading={isSubmitting || loading}
              disabled={isSubmitting}
            />

            <View style={styles.bottomContainer}>
              <Text style={styles.bottomText}>Already have an account?</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.signInText}> Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <AuthLoadingOverlay
        visible={isSubmitting}
        label="Creating your account..."
      />
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  form: {},
  bottomContainer: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomText: {
    fontSize: 15,
    color: "#8B93A7",
    fontWeight: "500",
  },
  signInText: {
    fontSize: 15,
    color: "#4F7CF7",
    fontWeight: "700",
  },
});
