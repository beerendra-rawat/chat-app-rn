// src/utils/validation.ts
export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): ValidationError | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return { field: "email", message: "Email is required" };
  }
  if (!emailRegex.test(email)) {
    return { field: "email", message: "Please enter a valid email address" };
  }
  return null;
};

export const validatePassword = (password: string): ValidationError | null => {
  if (!password) {
    return { field: "password", message: "Password is required" };
  }
  if (password.length < 6) {
    return {
      field: "password",
      message: "Password must be at least 6 characters",
    };
  }
  return null;
};

export const validateLoginForm = (
  email: string,
  password: string,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(email);
  if (emailError) errors.push(emailError);

  const passwordError = validatePassword(password);
  if (passwordError) errors.push(passwordError);

  return errors;
};
