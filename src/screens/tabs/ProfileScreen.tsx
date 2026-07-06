import {
  ActivityIndicator, // ✅ new import
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppContainer from "../../components/common/AppContainer";
import CustomInput from "../../components/auth/CustomInput";
import PrimaryButton from "../../components/auth/PrimaryButton";
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
    uploadingImage, // ✅ new
  } = useProfile();

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
        <View style={styles.centered}>
          <Text>Loading profile...</Text>
        </View>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
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
          onPress={isEditing && !uploadingImage ? handleAvatarPress : undefined}
          activeOpacity={0.8}
          disabled={uploadingImage} // ✅ prevent tapping while uploading
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={70} color="#9CA3AF" />
            </View>
          )}

          {/* ✅ Loader overlay while uploading */}
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
            />
            <CustomInput
              label="Bio"
              placeholder="Write something about yourself..."
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
            />
          </View>
        )}

        <View style={{ flex: 1 }} />

        <PrimaryButton
          title="Logout"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </ScrollView>
    </AppContainer>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
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
  // ✅ New: dark overlay + spinner on top of the avatar
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
  logoutButton: {
    backgroundColor: "#EF4444",
    marginTop: 40,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
