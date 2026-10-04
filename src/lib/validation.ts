const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const isValidPassword = (password: string) => PASSWORD_PATTERN.test(password);
