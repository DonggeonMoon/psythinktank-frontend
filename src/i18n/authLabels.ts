import type {Lang} from "./stockLabels";

type Dict = Record<Lang, string>;

export const commentLabels = {
    heading: {ko: "댓글", en: "Comments", ja: "コメント", zh: "评论"},
    placeholder: {ko: "댓글을 입력하세요", en: "Write a comment", ja: "コメントを入力してください", zh: "请输入评论"},
    submit: {ko: "등록", en: "Post", ja: "投稿", zh: "发布"},
    loginLink: {ko: "로그인", en: "Log in", ja: "ログイン", zh: "登录"},
    loginSuffix: {
        ko: " 후 댓글을 작성할 수 있습니다.",
        en: " to write a comment.",
        ja: "するとコメントを書き込めます。",
        zh: "后即可发表评论。",
    },
    loading: {ko: "불러오는 중...", en: "Loading...", ja: "読み込み中...", zh: "加载中..."},
    deletedByPolicy: {
        ko: "사이트 정책 위반으로 삭제된 댓글입니다.",
        en: "This comment was removed for violating site policy.",
        ja: "サイトポリシー違反により削除されたコメントです。",
        zh: "该评论因违反网站政策已被删除。",
    },
    deleted: {ko: "삭제된 댓글입니다.", en: "This comment has been deleted.", ja: "削除されたコメントです。", zh: "该评论已被删除。"},
    edit: {ko: "수정", en: "Edit", ja: "編集", zh: "编辑"},
    delete: {ko: "삭제", en: "Delete", ja: "削除", zh: "删除"},
    cancel: {ko: "취소", en: "Cancel", ja: "キャンセル", zh: "取消"},
    save: {ko: "저장", en: "Save", ja: "保存", zh: "保存"},
    confirmDelete: {
        ko: "이 댓글을 삭제하시겠습니까?",
        en: "Delete this comment?",
        ja: "このコメントを削除しますか？",
        zh: "确定要删除这条评论吗？",
    },
    unknownAuthor: {ko: "알 수 없음", en: "Unknown", ja: "不明", zh: "未知"},
} satisfies Record<string, Dict>;

export const signupBannerLabels = {
    title: {
        ko: "PSYThinktank 회원이 되어주세요",
        en: "Become a PSYThinktank member",
        ja: "PSYThinktankの会員になりませんか",
        zh: "成为PSYThinktank会员吧",
    },
    close: {ko: "닫기", en: "Close", ja: "閉じる", zh: "关闭"},
    signup: {ko: "회원 가입", en: "Sign up", ja: "会員登録", zh: "注册"},
    login: {ko: "로그인", en: "Log in", ja: "ログイン", zh: "登录"},
} satisfies Record<string, Dict>;

export const consentLabels = {
    title: {ko: "개인정보 수집 및 이용 동의", en: "Consent to Collection and Use of Personal Information", ja: "個人情報の収集・利用への同意", zh: "个人信息收集及使用同意"},
    reconsentNotice: {
        ko: "이용 약관이 변경되어 계속 이용하시려면 다시 동의가 필요합니다.",
        en: "Our terms have changed. Please agree again to continue using the service.",
        ja: "利用規約が変更されたため、引き続きご利用いただくには再度同意が必要です。",
        zh: "使用条款已变更，如需继续使用，请重新同意。",
    },
    agreeCheckbox: {
        ko: "위 개인정보 수집 및 이용에 동의합니다. (필수)",
        en: "I agree to the collection and use of personal information above. (Required)",
        ja: "上記の個人情報の収集・利用に同意します。（必須）",
        zh: "我同意上述个人信息的收集及使用。（必选）",
    },
    agreeAndContinue: {ko: "동의하고 계속하기", en: "Agree and Continue", ja: "同意して続ける", zh: "同意并继续"},
    processing: {ko: "처리 중...", en: "Processing...", ja: "処理中...", zh: "处理中..."},
    declineAndLogout: {ko: "동의하지 않고 로그아웃", en: "Decline and Log out", ja: "同意せずにログアウト", zh: "不同意并退出登录"},
} satisfies Record<string, Dict>;
