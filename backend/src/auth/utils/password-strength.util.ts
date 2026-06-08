export type PasswordStrength = 'debil' | 'intermedia' | 'fuerte';

export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password || password.length < 8) {
    return 'debil';
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);

  // Only letters (no numbers or special chars) = debil
  if (!hasNumbers && !hasSpecialChars) {
    return 'debil';
  }

  // 8+ with upper + lower + numbers + special = fuerte
  if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
    return 'fuerte';
  }

  // 8+ with letters + numbers = intermedia
  if ((hasUpperCase || hasLowerCase) && hasNumbers) {
    return 'intermedia';
  }

  return 'debil';
}
