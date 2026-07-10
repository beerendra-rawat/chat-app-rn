// src/screens/auth/VerifyCodeScreen.tsx
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import AppContainer from "../../components/common/AppContainer";
import BackButton from "../../components/auth/BackButton";
import AuthHeader from "../../components/auth/AuthHeader";
import PrimaryButton from "../../components/auth/PrimaryButton";

export default function VerifyCodeScreen({ navigation, route }: any) {
  const email = route.params?.email ?? "";
  const [resending, setResending] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Email sent", "We've resent the reset link to your inbox.");
    } catch (err: any) {
      Alert.alert("Error", "Could not resend the email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AppContainer backgroundColor="#F7F8FA">
      <BackButton onPress={() => navigation.goBack()} />
      <View style={styles.content}>
        <AuthHeader
          title="Check your email"
          subtitle={
            email
              ? `We sent a password reset link to ${email}. Tap the link in that email to set a new password, then come back and sign in.`
              : "We sent you a password reset link. Tap the link in that email to set a new password, then come back and sign in."
          }
        />

        <PrimaryButton
          title="Back to Login"
          onPress={() => navigation.navigate("Login")}
        />

        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText}>Haven't got the email yet? </Text>
          <TouchableOpacity onPress={handleResend} disabled={resending}>
            <Text style={styles.resendText}>
              {resending ? "Sending..." : "Resend email"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  content: {},
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  bottomText: {
    fontSize: 15,
    color: "#9AA0AA",
    fontWeight: "500",
  },
  resendText: {
    fontSize: 15,
    color: "#4F7CF7",
    fontWeight: "700",
  },
});
