const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export const isValidPassword = (password: string) => PASSWORD_PATTERN.test(password);

export const isValidEmail = (email: string) => EMAIL_PATTERN.test(email);
