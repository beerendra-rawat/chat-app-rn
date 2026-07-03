// src/screens/profile/ProfileScreen.tsx
import React, { useState, useEffect } from "react";
import {
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

import { useAppSelector } from "../../redux/store/hooks"; // ← Fixed import path
import { useAuth } from "../../hooks/useAuth";

export default function ProfileScreen({ navigation }: any) {
  const { user } = useAppSelector((state) => state.auth);
  const { signOut } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Populate data from Firebase Auth
  useEffect(() => {
    if (user) {
      const displayName =
        user.displayName || (user.email ? user.email.split("@")[0] : "User");

      setName(displayName);
      setBio("React Native Developer • Traveller • Nature Lover");

      if (user.photoURL) {
        setProfileImage(user.photoURL);
      }
    }
  }, [user]);

  const handleAvatarPress = () => {
    if (!isEditing) return;
    Alert.alert(
      "Profile Image",
      "Image picker coming soon (expo-image-picker).",
    );
  };

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully.");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (error: any) {
            Alert.alert("Logout Failed", error.message || "Please try again.");
          }
        },
      },
    ]);
  };

  // Fallback while user data is loading or not available
  if (!user) {
    return (
      <AppContainer>
        <View style={styles.centered}>
          <Text>No user data available</Text>
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.editButton}
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
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
          activeOpacity={0.9}
          disabled={!isEditing}
          onPress={handleAvatarPress}
          style={styles.avatarContainer}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={70} color="#9CA3AF" />
            </View>
          )}

          {isEditing && (
            <View style={styles.cameraButton}>
              <Ionicons name="camera" size={18} color="#fff" />
            </View>
          )}
        </TouchableOpacity>

        {/* View Mode */}
        {!isEditing ? (
          <>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.bio}>{bio}</Text>
          </>
        ) : (
          /* Edit Mode */
          <View style={styles.form}>
            <CustomInput
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
            <CustomInput
              label="Bio"
              placeholder="Write something about yourself..."
              value={bio}
              onChangeText={setBio}
              multiline
            />
          </View>
        )}

        <View style={{ flex: 1 }} />

        {/* Cool Logout Button */}
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
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
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
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  avatarContainer: {
    alignSelf: "center",
    marginBottom: 25,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#fff",
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#ECECEC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  cameraButton: {
    position: "absolute",
    right: 4,
    bottom: 4,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  bio: {
    fontSize: 15.5,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  form: {
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: "#EF4444",
    marginTop: 30,
    shadowColor: "#EF4444",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
