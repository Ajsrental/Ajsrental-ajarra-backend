// Utility functions
export const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidPhone = (phone: string): boolean =>
    /^\+?[0-9]{7,15}$/.test(phone); // Optional if you include phone later