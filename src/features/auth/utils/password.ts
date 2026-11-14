// Mirrors the API's rule: 8+ characters with upper case, lower case and a number.
export const PASSWORD_PATTERN = "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}";

export const PASSWORD_HINT =
  "At least 8 characters, with upper case, lower case and a number.";
