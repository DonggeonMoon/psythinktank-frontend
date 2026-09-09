// 동의 문구가 바뀌면 이 값을 올려서 기존에 이전 버전으로 동의했던 계정도 다시 동의를 받는다.
export const PRIVACY_CONSENT_VERSION = "2026-09-09";

// 동의 문구 자체는 콘텐츠라 로직과 분리해 프로젝트 루트 agreement-statement에서 관리한다.
export { PRIVACY_CONSENT_TEXT } from "../../agreement-statement/privacyConsentText";

const AGREED_KEY = "psythinktank:signupPrivacyAgreed";

export const hasAgreedToPrivacyConsent = () => {
    try {
        return sessionStorage.getItem(AGREED_KEY) === "true";
    } catch {
        return false;
    }
};

export const setAgreedToPrivacyConsent = () => {
    try {
        sessionStorage.setItem(AGREED_KEY, "true");
    } catch {
        // 세션 스토리지를 못 쓰는 환경이면 그냥 무시 (다음에 다시 동의 화면을 보게 됨)
    }
};

// 공용 컴퓨터에서 이어서 다른 사람이 가입할 수 있으므로, 동의는 /signup 진입 한 번에만
// 유효하도록 읽는 즉시 소모한다 (탭이 열려있는 내내 유효한 플래그로 두지 않는다).
export const consumeAgreedToPrivacyConsent = () => {
    const agreed = hasAgreedToPrivacyConsent();
    try {
        sessionStorage.removeItem(AGREED_KEY);
    } catch {
        // 무시
    }
    return agreed;
};
