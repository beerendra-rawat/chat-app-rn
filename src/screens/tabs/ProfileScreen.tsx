import { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView, // ✅ new
  Platform, // ✅ new
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppContainer from "../../components/common/AppContainer";
import CustomInput from "../../components/auth/CustomInput";
import PrimaryButton from "../../components/auth/PrimaryButton";
import ProfileSkeleton from "../../components/common/ProfileSkeleton";
import { useAppSelector } from "../../redux/store/hooks";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";

export default function ProfileScreen({ navigation }: any) {
  const { user } = useAppSelector((state) => state.auth);
  const { signOut } = useAuth();
  const {
    isEditing,
    setIsEditing,
    fullName,
    setFullName,
    bio,
    setBio,
    profileImage,
    handleAvatarPress,
    saveProfile,
    saving,
    uploadingImage,
  } = useProfile();

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          } catch (e: any) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);
  };

  if (!user) {
    return (
      <AppContainer>
        <ProfileSkeleton />
      </AppContainer>
    );
  }

  return (
    // ✅ new — lets the ScrollView content resize/reposition when the
    // keyboard opens, so you can actually scroll to fields hidden behind it
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <AppContainer
        scrollable
        refreshing={refreshing}
        onRefresh={handleRefresh}
        keyboardShouldPersistTaps="handled" // ✅ new — taps on buttons work while keyboard is open
      >
        {/* Edit Button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => (isEditing ? saveProfile() : setIsEditing(true))}
            disabled={saving}
          >
            <Ionicons
              name={isEditing ? "checkmark" : "create-outline"}
              size={28}
              color="#4F46E5"
            />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={
            isEditing
              ? !uploadingImage
                ? handleAvatarPress
                : undefined
              : profileImage
                ? () =>
                    navigation.navigate("ViewImage", {
                      imageUri: profileImage,
                    })
                : undefined
          }
          activeOpacity={0.8}
          disabled={uploadingImage}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={70} color="#9CA3AF" />
            </View>
          )}

          {uploadingImage && (
            <View style={styles.avatarOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}

          {isEditing && !uploadingImage && (
            <View style={styles.cameraButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        {/* Name & Bio */}
        {!isEditing ? (
          <>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.bio}>{bio || "No bio yet"}</Text>
          </>
        ) : (
          <View style={styles.form}>
            <CustomInput
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              autoComplete="off" // ✅ new — stops OS suggesting old saved values
              autoCorrect={false} // ✅ new
              textContentType="none" // ✅ new — iOS: disables QuickType suggestion bar
              importantForAutofill="no" // ✅ new — Android equivalent
            />
            <CustomInput
              label="Bio"
              placeholder="Write something about yourself..."
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              autoComplete="off" // ✅ new
              autoCorrect={false} // ✅ new
              textContentType="none" // ✅ new
              importantForAutofill="no" // ✅ new
            />
          </View>
        )}

        <View style={styles.spacer} />

        <PrimaryButton
          title="Logout"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </AppContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 }, // ✅ new
  header: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  editButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarContainer: {
    alignSelf: "center",
    marginBottom: 25,
    position: "relative",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#ECECEC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  avatarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    position: "absolute",
    right: 8,
    bottom: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  form: { marginTop: 10, gap: 16 },
  spacer: { minHeight: 40 }, // ✅ changed — see note below
  logoutButton: {
    backgroundColor: "#EF4444",
    marginTop: 200,
  },
});
