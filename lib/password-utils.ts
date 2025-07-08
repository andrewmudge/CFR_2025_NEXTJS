// Password validation utilities for Cognito requirements

export interface PasswordRequirement {
  met: boolean;
  text: string;
}

export const validatePassword = (password: string): PasswordRequirement[] => {
  return [
    {
      met: password.length >= 8,
      text: 'At least 8 characters'
    },
    {
      met: /[A-Z]/.test(password),
      text: 'At least one uppercase letter'
    },
    {
      met: /[a-z]/.test(password),
      text: 'At least one lowercase letter'
    },
    {
      met: /[0-9]/.test(password),
      text: 'At least one number'
    },
    {
      met: /[^A-Za-z0-9]/.test(password),
      text: 'At least one special character'
    }
  ];
};

export const isPasswordValid = (password: string): boolean => {
  return validatePassword(password).every(req => req.met);
};