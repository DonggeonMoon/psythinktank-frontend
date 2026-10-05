import type {Lang} from "./stockLabels";

type Dict = Record<Lang, string>;

export const commonAuthLabels = {
    email: {ko: "이메일", en: "Email", ja: "メールアドレス", zh: "电子邮箱"},
    nickname: {ko: "닉네임", en: "Nickname", ja: "ニックネーム", zh: "昵称"},
    password: {ko: "비밀번호", en: "Password", ja: "パスワード", zh: "密码"},
    passwordConfirm: {ko: "비밀번호 확인", en: "Confirm Password", ja: "パスワード（確認）", zh: "确认密码"},
    checkDuplicate: {ko: "중복확인", en: "Check", ja: "重複確認", zh: "查重"},
    login: {ko: "로그인", en: "Log in", ja: "ログイン", zh: "登录"},
    signup: {ko: "회원가입", en: "Sign up", ja: "会員登録", zh: "注册"},
    cancel: {ko: "취소", en: "Cancel", ja: "キャンセル", zh: "取消"},
    passwordRequirement: {
        ko: "비밀번호는 8자 이상이며 영문, 숫자, 특수문자를 각각 1자 이상 포함해야 합니다.",
        en: "Password must be at least 8 characters and include at least one letter, one number, and one special character.",
        ja: "パスワードは8文字以上で、英字・数字・記号をそれぞれ1文字以上含める必要があります。",
        zh: "密码须至少8位，且至少包含一个字母、一个数字和一个特殊字符。",
    },
    invalidEmail: {
        ko: "올바른 이메일 형식이 아닙니다.",
        en: "Please enter a valid email address.",
        ja: "正しいメールアドレスの形式ではありません。",
        zh: "邮箱格式不正确。",
    },
    emailAvailable: {ko: "사용 가능한 이메일입니다.", en: "This email is available.", ja: "使用可能なメールアドレスです。", zh: "该邮箱可以使用。"},
    emailTaken: {ko: "이미 가입된 이메일입니다.", en: "This email is already registered.", ja: "既に登録されているメールアドレスです。", zh: "该邮箱已被注册。"},
    nicknameAvailable: {ko: "사용 가능한 닉네임입니다.", en: "This nickname is available.", ja: "使用可能なニックネームです。", zh: "该昵称可以使用。"},
    nicknameTaken: {ko: "이미 사용 중인 닉네임입니다.", en: "This nickname is already taken.", ja: "既に使用されているニックネームです。", zh: "该昵称已被使用。"},
    nicknameCheckRequired: {
        ko: "닉네임 중복 확인을 완료해주세요.",
        en: "Please check whether the nickname is available.",
        ja: "ニックネームの重複確認を完了してください。",
        zh: "请先完成昵称查重。",
    },
    spamNotice: {
        ko: "메일이 스팸함으로 분류되었을 수 있으니, 받은 메일함에 안 보이면 스팸함도 꼭 확인해주세요.",
        en: "The email may have been filtered as spam. If you don't see it in your inbox, please check your spam folder.",
        ja: "メールが迷惑メールに分類されている可能性があります。受信トレイに見当たらない場合は、迷惑メールフォルダもご確認ください。",
        zh: "邮件可能被归入垃圾邮件，如果收件箱中没有看到，请务必检查垃圾邮件文件夹。",
    },
} satisfies Record<string, Dict>;

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

export const signupPageLabels = {
    emailCheckRequired: {
        ko: "이메일 중복 확인을 완료해주세요.",
        en: "Please check whether the email is available.",
        ja: "メールアドレスの重複確認を完了してください。",
        zh: "请先完成邮箱查重。",
    },
    passwordMismatch: {ko: "비밀번호가 일치하지 않습니다.", en: "Passwords do not match.", ja: "パスワードが一致しません。", zh: "两次输入的密码不一致。"},
    duplicate: {
        ko: "닉네임 또는 이메일이 이미 사용 중입니다. 다시 확인해주세요.",
        en: "The nickname or email is already in use. Please check again.",
        ja: "ニックネームまたはメールアドレスが既に使用されています。もう一度確認してください。",
        zh: "昵称或邮箱已被使用，请重新确认。",
    },
    failed: {
        ko: "회원가입에 실패했습니다. 입력값을 확인해주세요.",
        en: "Sign-up failed. Please check your input.",
        ja: "会員登録に失敗しました。入力内容を確認してください。",
        zh: "注册失败，请检查输入内容。",
    },
    verifyTitle: {
        ko: "이메일 인증을 완료해주세요",
        en: "Please verify your email",
        ja: "メール認証を完了してください",
        zh: "请完成邮箱验证",
    },
    goToLogin: {ko: "로그인으로 이동", en: "Go to login", ja: "ログインへ", zh: "前往登录"},
    submitting: {ko: "가입 중...", en: "Signing up...", ja: "登録中...", zh: "注册中..."},
    haveAccount: {ko: "이미 계정이 있으신가요?", en: "Already have an account?", ja: "既にアカウントをお持ちですか？", zh: "已有账号？"},
} satisfies Record<string, Dict>;

export const verificationSentMessage = (lang: Lang): [string, string] => {
    switch (lang) {
        case "en":
            return ["A verification email has been sent to ", ". Click the link in the email to finish verifying, and then you can log in."];
        case "ja":
            return ["", " 宛てに認証メールを送信しました。メール内のリンクをクリックして認証を完了すると、ログインできます。"];
        case "zh":
            return ["验证邮件已发送至 ", "。点击邮件中的链接完成验证后即可登录。"];
        default:
            return ["", "으로 인증 메일을 보냈습니다. 메일의 링크를 눌러 인증을 마치면 로그인할 수 있습니다."];
    }
};

export const loginPageLabels = {
    emailNotVerified: {
        ko: "이메일 인증이 완료되지 않았습니다. 인증 메일을 다시 보냈으니 메일함을 확인해주세요. 받은 메일함에 안 보이면 스팸함도 꼭 확인해주세요.",
        en: "Your email has not been verified. We've sent the verification email again, so please check your inbox. If you don't see it, please check your spam folder.",
        ja: "メール認証が完了していません。認証メールを再送信しましたので、メールボックスをご確認ください。受信トレイに見当たらない場合は、迷惑メールフォルダもご確認ください。",
        zh: "邮箱尚未验证。我们已重新发送验证邮件，请查看邮箱。如果收件箱中没有看到，请务必检查垃圾邮件文件夹。",
    },
    invalidCredentials: {
        ko: "이메일 또는 비밀번호가 올바르지 않습니다.",
        en: "Incorrect email or password.",
        ja: "メールアドレスまたはパスワードが正しくありません。",
        zh: "邮箱或密码不正确。",
    },
    submitting: {ko: "로그인 중...", en: "Logging in...", ja: "ログイン中...", zh: "登录中..."},
    forgotPassword: {ko: "비밀번호를 잊으셨나요?", en: "Forgot your password?", ja: "パスワードをお忘れですか？", zh: "忘记密码？"},
} satisfies Record<string, Dict>;

export const myPageLabels = {
    title: {ko: "내 정보", en: "My Account", ja: "会員情報", zh: "我的信息"},
    account: {ko: "계정", en: "Account", ja: "アカウント", zh: "账号"},
    changeNickname: {ko: "닉네임 변경", en: "Change Nickname", ja: "ニックネーム変更", zh: "修改昵称"},
    nicknameChanged: {ko: "닉네임이 변경되었습니다.", en: "Your nickname has been changed.", ja: "ニックネームを変更しました。", zh: "昵称已修改。"},
    nicknameTakenRetry: {
        ko: "이미 사용 중인 닉네임입니다. 다시 확인해주세요.",
        en: "This nickname is already taken. Please check again.",
        ja: "既に使用されているニックネームです。もう一度確認してください。",
        zh: "该昵称已被使用，请重新确认。",
    },
    nicknameChangeFailed: {ko: "닉네임 변경에 실패했습니다.", en: "Failed to change nickname.", ja: "ニックネームの変更に失敗しました。", zh: "修改昵称失败。"},
    saving: {ko: "저장 중...", en: "Saving...", ja: "保存中...", zh: "保存中..."},
    saveNickname: {ko: "닉네임 저장", en: "Save Nickname", ja: "ニックネームを保存", zh: "保存昵称"},
    changePassword: {ko: "비밀번호 변경", en: "Change Password", ja: "パスワード変更", zh: "修改密码"},
    currentPassword: {ko: "현재 비밀번호", en: "Current Password", ja: "現在のパスワード", zh: "当前密码"},
    newPassword: {ko: "새 비밀번호", en: "New Password", ja: "新しいパスワード", zh: "新密码"},
    newPasswordConfirm: {ko: "새 비밀번호 확인", en: "Confirm New Password", ja: "新しいパスワード（確認）", zh: "确认新密码"},
    newPasswordMismatch: {ko: "새 비밀번호가 일치하지 않습니다.", en: "New passwords do not match.", ja: "新しいパスワードが一致しません。", zh: "两次输入的新密码不一致。"},
    passwordChanged: {ko: "비밀번호가 변경되었습니다.", en: "Your password has been changed.", ja: "パスワードを変更しました。", zh: "密码已修改。"},
    currentPasswordWrong: {ko: "현재 비밀번호가 올바르지 않습니다.", en: "Current password is incorrect.", ja: "現在のパスワードが正しくありません。", zh: "当前密码不正确。"},
    changing: {ko: "변경 중...", en: "Changing...", ja: "変更中...", zh: "修改中..."},
    withdraw: {ko: "회원 탈퇴", en: "Delete Account", ja: "退会", zh: "注销账号"},
    withdrawWarning: {
        ko: "탈퇴하면 계정과 프로필 정보가 삭제되며 복구할 수 없습니다.",
        en: "Deleting your account will permanently remove your account and profile information. This cannot be undone.",
        ja: "退会するとアカウントとプロフィール情報が削除され、復元できません。",
        zh: "注销后，账号和个人资料将被删除且无法恢复。",
    },
    passwordWrong: {ko: "비밀번호가 올바르지 않습니다.", en: "Incorrect password.", ja: "パスワードが正しくありません。", zh: "密码不正确。"},
    withdrawing: {ko: "탈퇴 처리 중...", en: "Deleting...", ja: "退会処理中...", zh: "注销中..."},
    withdrawConfirm: {ko: "탈퇴 진행", en: "Delete Account", ja: "退会する", zh: "确认注销"},
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

export const findPasswordLabels = {
    title: {ko: "비밀번호 찾기", en: "Forgot Password", ja: "パスワードを忘れた場合", zh: "找回密码"},
    subtitle: {
        ko: "가입하신 이메일로 비밀번호 재설정 메일을 보내드립니다.",
        en: "We'll send a password reset email to the address you signed up with.",
        ja: "ご登録のメールアドレスにパスワード再設定メールをお送りします。",
        zh: "我们将向您注册时使用的邮箱发送密码重置邮件。",
    },
    invalidEmail: {
        ko: "올바른 이메일 형식이 아닙니다.",
        en: "Please enter a valid email address.",
        ja: "メールアドレスの形式が正しくありません。",
        zh: "邮箱格式不正确。",
    },
    sent: {
        ko: "입력하신 이메일 주소로 비밀번호 재설정 메일을 보냈습니다.",
        en: "A password reset email has been sent to the address you entered.",
        ja: "入力されたメールアドレスにパスワード再設定メールを送信しました。",
        zh: "密码重置邮件已发送至您输入的邮箱地址。",
    },
    backToLogin: {ko: "로그인으로 돌아가기", en: "Back to login", ja: "ログインに戻る", zh: "返回登录"},
    submitting: {ko: "전송 중...", en: "Sending...", ja: "送信中...", zh: "发送中..."},
    submit: {ko: "재설정 메일 보내기", en: "Send Reset Email", ja: "再設定メールを送信", zh: "发送重置邮件"},
} satisfies Record<string, Dict>;
