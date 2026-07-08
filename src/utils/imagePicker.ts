import * as ImagePicker from "expo-image-picker";

export async function pickImageFromLibrary(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    throw new Error("PERMISSION_DENIED");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.7,
    allowsEditing: false,
  });

  if (result.canceled || !result.assets?.length) return null;
  return result.assets[0].uri;
}

// ✅ new — lets the user select multiple images for a story at once
export async function pickMultipleImagesFromLibrary(
  maxImages = 10,
): Promise<string[]> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    throw new Error("PERMISSION_DENIED");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.7,
    allowsEditing: false,
    allowsMultipleSelection: true,
    selectionLimit: maxImages, // 0 = unlimited on iOS; Android respects this too on recent versions
  });

  if (result.canceled || !result.assets?.length) return [];
  return result.assets.map((asset) => asset.uri);
}
