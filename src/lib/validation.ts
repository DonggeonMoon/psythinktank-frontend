export const PASSWORD_REQUIREMENT_MESSAGE =
    "비밀번호는 8자 이상이며 영문, 숫자, 특수문자를 각각 1자 이상 포함해야 합니다.";

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const isValidPassword = (password: string) => PASSWORD_PATTERN.test(password);
