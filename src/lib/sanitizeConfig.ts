import type {Config} from "dompurify";

// DOMPurify 기본값은 inline style과 form/input을 통과시켜, 화면 전체를 덮는 가짜 로그인 폼 같은 피싱 본문을 만들 수 있다.
export const POST_SANITIZE_CONFIG: Config = {
    FORBID_TAGS: ["style", "form", "input", "button", "textarea", "select", "option", "iframe", "object", "embed"],
    FORBID_ATTR: ["style"],
};
