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
