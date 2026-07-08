import * as FileSystem from "expo-file-system/legacy";

const CLOUDINARY_UPLOAD_PRESET = "chat-app";
const CLOUDINARY_CLOUD_NAME = "dbtjsq1pm";

export const uploadToCloudinary = async (imageUri: string): Promise<string> => {
  try {
    console.log("📤 Uploading image:", imageUri);
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const result = await FileSystem.uploadAsync(uploadUrl, imageUri, {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "file",
      mimeType: "image/jpeg",
      parameters: { upload_preset: CLOUDINARY_UPLOAD_PRESET },
    });

    if (result.status !== 200) {
      throw new Error(
        `Cloudinary upload failed (${result.status}): ${result.body}`,
      );
    }
    const data = JSON.parse(result.body);
    if (!data.secure_url) {
      throw new Error(
        data.error?.message || "Cloudinary did not return secure_url",
      );
    }
    console.log("✅ Upload Success:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    throw error;
  }
};
