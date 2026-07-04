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

import { useAuth } from "../../hooks/useAuth";
import { useAppSelector } from "../../redux/store/hooks";
import { validateSignupForm } from "../../utils/validation";

export default function SignupScreen({ navigation }: any) {
  //Local State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Hooks
  const { signupWithEmail } = useAuth();
  const { loading } = useAppSelector((state) => state.auth);

  // Handle Signup
  const handleSignup = async () => {
    console.log("======================================");
    console.log("🚀 Create Account Button Pressed");
    console.log("======================================");

    //Validate Form
    const errors = validateSignupForm(fullName, email, password);
    if (errors.length > 0) {
      console.log("❌ Validation Failed");
      console.log(errors);
      Alert.alert("Validation Error", errors[0].message);
      return;
    }

    try {
      console.log("📤 Creating Firebase Account...");
      const user = await signupWithEmail(fullName, email, password);

      console.log("✅ Firebase Signup Success");
      console.log("👤 UID:", user.uid);
      console.log("📧 Email:", user.email);
      console.log("🙍 Name:", user.displayName);

      navigation.replace("AccountCreatedSuccess");
    } catch (error: any) {
      console.log("❌ Signup Failed");
      console.log(error);

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
          {/* Back Button */}
          <BackButton onPress={() => navigation.goBack()} />

          {/* Header */}
          <AuthHeader
            title="Create Account"
            subtitle="Create your account and start chatting"
          />

          <View style={styles.form}>
            {/* Full Name */}
            <CustomInput
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
            />

            {/* Email */}
            <CustomInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Password */}
            <PasswordInput
              label="Create Password"
              value={password}
              onChangeText={setPassword}
            />

            {/* Signup Button */}
            <PrimaryButton
              title={loading ? "Creating Account..." : "Create Account"}
              onPress={handleSignup}
              disabled={loading}
            />

            {/* Login */}
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
