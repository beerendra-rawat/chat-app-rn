// src/screens/profile/ProfileScreen.tsx

import React, { useState } from "react";
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

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("Beerendra Rawat");
  const [bio, setBio] = useState(
    "React Native Developer • Traveller • Nature Lover",
  );

  // null = show dummy avatar
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleAvatarPress = () => {
    if (!isEditing) return;

    // Open Image Picker Here
    Alert.alert("Profile Image", "Open image picker here.");
  };

  const handleSave = () => {
    setIsEditing(false);

    Alert.alert("Success", "Profile updated successfully.");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Implement logout here.");
  };

  return (
    <AppContainer>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        {/* Header */}

        <View style={styles.header}>
          <View />

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.editButton}
            onPress={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
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
              placeholder="Write something..."
              value={bio}
              onChangeText={setBio}
            />
          </View>
        )}

        <View style={{ flex: 1 }} />

        {/* Logout */}

        <PrimaryButton title="Logout" onPress={handleLogout} />
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
    alignItems: "center",
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
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 3,
  },

  avatarContainer: {
    alignSelf: "center",
    marginBottom: 25,
  },

  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },

  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,

    backgroundColor: "#ECECEC",
    justifyContent: "center",
    alignItems: "center",
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
  },

  name: {
    fontSize: 24,
    fontWeight: "700",

    color: "#111827",

    textAlign: "center",
  },

  bio: {
    marginTop: 10,

    fontSize: 15,

    color: "#6B7280",

    textAlign: "center",

    lineHeight: 24,

    paddingHorizontal: 15,
  },

  form: {
    marginTop: 10,
  },
});
