import { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import AppContainer from "../../components/common/AppContainer";
import BackButton from "../../components/auth/BackButton";
import AuthHeader from "../../components/auth/AuthHeader";
import CustomInput from "../../components/auth/CustomInput";
import PrimaryButton from "../../components/auth/PrimaryButton";

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetRequest = async () => {
    const trimmed = email.trim();
    if (!trimmed || !/^\S+@\S+\.\S+$/.test(trimmed)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, trimmed);
      // ✅ real Firebase email sent — navigate to confirmation, passing the
      // email along so the next screen can display it
      navigation.navigate("VerifyCode", { email: trimmed });
    } catch (err: any) {
      let message = "Something went wrong. Please try again.";
      if (err.code === "auth/user-not-found") {
        message = "No account found with that email address.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      }
      Alert.alert("Reset Failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppContainer backgroundColor="#F7F8FA">
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
          onChangeText={(text) => {
            setEmail(text);
            if (error) setError("");
          }}
          error={error}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <PrimaryButton
          title="Reset Password"
          onPress={handleResetRequest}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  content: {},
});
