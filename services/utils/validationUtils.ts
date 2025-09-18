// Validation utility functions for form inputs and data validation

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
        return { isValid: false, error: 'Email is required' };
    }

    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;

    if (!phone.trim()) {
        return { isValid: false, error: 'Phone number is required' };
    }

    if (!phoneRegex.test(phone)) {
        return { isValid: false, error: 'Please enter a valid phone number' };
    }

    return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string): ValidationResult => {
    if (!value || !value.trim()) {
        return { isValid: false, error: `${fieldName} is required` };
    }

    return { isValid: true };
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): ValidationResult => {
    if (value.length < minLength) {
        return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
    }

    return { isValid: true };
};

export const validateMaxLength = (value: string, maxLength: number, fieldName: string): ValidationResult => {
    if (value.length > maxLength) {
        return { isValid: false, error: `${fieldName} must be no more than ${maxLength} characters` };
    }

    return { isValid: true };
};

export const validateNumber = (value: string, fieldName: string): ValidationResult => {
    const num = parseFloat(value);

    if (isNaN(num)) {
        return { isValid: false, error: `${fieldName} must be a valid number` };
    }

    return { isValid: true };
};

export const validatePositiveNumber = (value: string, fieldName: string): ValidationResult => {
    const numberValidation = validateNumber(value, fieldName);
    if (!numberValidation.isValid) return numberValidation;

    const num = parseFloat(value);
    if (num <= 0) {
        return { isValid: false, error: `${fieldName} must be greater than 0` };
    }

    return { isValid: true };
};

export const validateDate = (date: Date, fieldName: string): ValidationResult => {
    if (!date || isNaN(date.getTime())) {
        return { isValid: false, error: `${fieldName} is required` };
    }

    return { isValid: true };
};

export const validateFutureDate = (date: Date, fieldName: string): ValidationResult => {
    const dateValidation = validateDate(date, fieldName);
    if (!dateValidation.isValid) return dateValidation;

    const now = new Date();
    if (date <= now) {
        return { isValid: false, error: `${fieldName} must be in the future` };
    }

    return { isValid: true };
};

// Composite validation function
export const validateForm = (validations: ValidationResult[]): ValidationResult => {
    const firstError = validations.find(v => !v.isValid);

    if (firstError) {
        return firstError;
    }

    return { isValid: true };
};