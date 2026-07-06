// src/hooks/useProfile.ts
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store/hooks";
import { setUser } from "../redux/slice/authSlice";
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import {
  ProfileData,
  subscribeToProfile,
  updateUserProfile,
} from "../services/profile.service";
import { Alert } from "react-native";

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false); // ✅ new

  useEffect(() => {
    if (!user?.uid) return;

    const initialName = user.displayName || user.email?.split("@")[0] || "User";
    setFullName(initialName);
    setProfileImage(user.photoURL || null);

    const unsubscribe = subscribeToProfile(
      user.uid,
      (profile: ProfileData | null) => {
        if (profile) {
          setFullName(profile.fullName || initialName);
          setBio(profile.bio || "");
          setProfileImage(profile.photoURL || null);
        }
      },
    );

    return () => unsubscribe();
  }, [user]);

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission Required", "Please allow gallery access.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]) return;

      setUploadingImage(true); // ✅ show loader
      const imageUrl = await uploadToCloudinary(result.assets[0].uri);
      setProfileImage(imageUrl);
      Alert.alert("✅ Success", "Image uploaded successfully!");
    } catch (error: any) {
      console.error("Image Upload Error:", error);
      Alert.alert("Error", error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false); // ✅ hide loader
    }
  };

  const removeImage = () => {
    setProfileImage(null);
  };

  const handleAvatarPress = () => {
    const options: any[] = [{ text: "Change Photo", onPress: pickImage }];

    if (profileImage) {
      options.push({
        text: "Remove Photo",
        style: "destructive",
        onPress: removeImage,
      });
    }

    options.push({ text: "Cancel", style: "cancel" });

    Alert.alert("Profile Photo", "Choose an option", options);
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updatedUser = await updateUserProfile(
        fullName.trim(),
        bio.trim(),
        profileImage || undefined,
      );
      dispatch(setUser(updatedUser));
      setIsEditing(false);
      Alert.alert("✅ Success", "Profile updated successfully!");
    } catch (error: any) {
      console.error(error);
      Alert.alert("❌ Error", error.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return {
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
    uploadingImage, // ✅ expose to UI
  };
};
