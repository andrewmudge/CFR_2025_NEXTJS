// Phone number utility functions for US numbers

export const cleanPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  return phone.replace(/\D/g, '');
};

export const isValidUSPhone = (phone: string): boolean => {
  const cleaned = cleanPhoneNumber(phone);
  // Must be exactly 10 digits for US numbers
  return cleaned.length === 10;
};

export const formatPhoneForDisplay = (phone: string): string => {
  const cleaned = cleanPhoneNumber(phone);
  
  if (cleaned.length === 0) return '';
  if (cleaned.length <= 3) return `(${cleaned}`;
  if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
};

export const formatPhoneForCognito = (phone: string): string => {
  const cleaned = cleanPhoneNumber(phone);
  
  if (!isValidUSPhone(phone)) {
    throw new Error('Invalid US phone number. Please enter 10 digits.');
  }
  
  // Convert to E.164 format with +1 prefix
  return `+1${cleaned}`;
};

export const formatPhoneInput = (value: string): string => {
  const cleaned = cleanPhoneNumber(value);
  
  // Limit to 10 digits
  const limited = cleaned.slice(0, 10);
  
  return formatPhoneForDisplay(limited);
};