const Colors = {
  // Brand
  primary: "#007AFF",
  primaryDark: "#0056B3",

  // Backgrounds
  background: "#F2F2F7",
  card: "#FFFFFF",
  border: "#E5E5EA",

  // Text
  text: "#1C1C1E",
  textSecondary: "#8E8E93",
  textMuted: "#AEAEB2",

  // Status
  success: "#34C759",
  danger: "#FF3B30",
  warning: "#FFCC00",

  // UI Elements
  tabActive: "#007AFF",
  tabInactive: "#8E8E93",

  // Chat
  chatBubbleMe: "#007AFF",
  chatBubbleOther: "#E5E5EA",

  // ✅ new — used for text/icons rendered on top of images (e.g. timestamp + read ticks on photo bubbles)
  onImage: "#FFFFFF",
  onImageMuted: "rgba(255, 255, 255, 0.75)",
  onImageOverlay: "rgba(0, 0, 0, 0.35)",

  // Extras (good to have)
  overlay: "rgba(0, 0, 0, 0.5)",
  disabled: "#C7C7CC",
  placeholder: "#AEAEB2",
} as const;

export default Colors;

// Optional: Type export for better TypeScript support
export type ColorKeys = keyof typeof Colors;
