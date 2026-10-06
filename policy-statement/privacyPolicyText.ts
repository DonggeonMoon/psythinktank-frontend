import type {Lang} from "../src/i18n/stockLabels";

export const PRIVACY_POLICY_TEXT: Record<Lang, string> = {
    ko: `PSY Thinktank(이하 "서비스")는 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 보호하기 위해 다음과 같이 개인정보 처리방침을 수립·공개합니다.

1. 처리하는 개인정보 항목
- 회원가입 시: 이메일 주소, 비밀번호(암호화되어 인증 서비스에 저장), 닉네임
- 서비스 이용 과정에서 자동 생성: 작성한 게시글·댓글, 개인정보 수집·이용 동의 일시
- 이용자의 브라우저 저장소(localStorage, sessionStorage)에는 언어·화면 테마 설정 등 편의 기능을 위한 값만 저장되며, 서버로 전송되지 않습니다. 쿠키는 8항을 참고해 주시기 바랍니다.

2. 개인정보의 처리 목적
- 회원 식별, 회원가입 및 로그인 처리, 계정 관리
- 게시판·댓글 등 커뮤니티 기능 제공
- 서비스 관련 공지사항 전달 및 문의 응대
- 부정 이용 방지 및 서비스 운영 관리

3. 개인정보의 보유 및 이용 기간
회원 탈퇴 시까지 보유하며, 탈퇴 시 지체 없이 파기합니다. 다만 관계 법령에 따라 보존할 필요가 있는 경우 해당 법령에서 정한 기간 동안 보관합니다.

4. 개인정보의 제3자 제공
서비스는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 이용자가 사전에 동의하거나 법령에 따라 요구되는 경우는 예외로 합니다.

5. 개인정보 처리의 위탁 및 국외 이전
서비스는 안정적인 운영을 위해 다음과 같이 개인정보 처리 업무를 위탁하고 있습니다.
- 수탁자: Google LLC (Firebase Authentication, Cloud Firestore)
- 위탁 업무: 회원 인증 및 회원·게시물 데이터 저장
- 이전 국가 및 방법: 미국 등 Google 데이터센터 소재 국가, 서비스 이용 시 네트워크를 통한 전송
- 이전 항목: 이메일 주소, 닉네임, 게시글·댓글 등 서비스 이용 기록
- 보유 기간: 회원 탈퇴 또는 위탁 계약 종료 시까지
이용자는 국외 이전을 거부할 수 있으나, 이 경우 회원가입 및 서비스 이용이 제한됩니다.

6. 개인정보의 파기 절차 및 방법
보유 기간이 끝나거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다. 전자적 파일 형태의 정보는 복구할 수 없는 방법으로 삭제합니다.

7. 이용자의 권리와 행사 방법
이용자는 언제든지 자신의 개인정보를 조회·수정할 수 있으며, 회원 탈퇴를 통해 처리 정지 및 삭제를 요청할 수 있습니다. 내 정보 페이지 또는 아래 문의처를 통해 요청하실 수 있습니다.

8. 쿠키, 이용 분석 및 광고
- 서비스는 이용 현황 분석을 위해 Google Analytics를 사용합니다. Google Analytics는 쿠키를 통해 방문 페이지, 체류 시간, 접속 기기·브라우저 정보 등을 개인을 식별할 수 없는 형태로 수집하며, 수집된 정보는 Google LLC(미국)에서 처리됩니다. Google Analytics 차단 브라우저 부가기능(https://tools.google.com/dlpage/gaoptout)으로 수집을 거부할 수 있습니다.
- 서비스는 Google AdSense 등 제3자 광고 서비스를 이용하며, Google을 포함한 제3자 공급업체는 쿠키를 사용해 이용자가 이 사이트나 다른 웹사이트를 방문한 기록을 바탕으로 광고를 게재합니다.
- Google은 광고 쿠키를 사용해 이용자의 이 사이트 및 다른 사이트 방문 기록에 기반한 광고를 이용자에게 게재할 수 있습니다. 자세한 내용은 Google의 파트너 사이트 데이터 사용 안내(https://policies.google.com/technologies/partner-sites)에서 확인할 수 있습니다.
- 이용자는 Google 광고 설정(https://adssettings.google.com)에서 맞춤 광고를 해제할 수 있으며, www.aboutads.info에서 제3자 공급업체의 맞춤 광고용 쿠키 사용을 거부할 수 있습니다.
- 이용자는 웹 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다. 다만 쿠키를 거부하면 일부 서비스 이용에 불편이 있을 수 있습니다.

9. 개인정보의 안전성 확보 조치
- 비밀번호는 인증 서비스에서 암호화되어 저장되며, 운영자도 확인할 수 없습니다.
- 데이터베이스 접근 권한을 보안 규칙으로 제한하고 있습니다.
- 회원 개인정보의 열람 권한은 운영진(관리자·매니저)으로 최소화하고 있습니다.
- 모든 통신은 HTTPS로 암호화됩니다.

10. 개인정보 보호책임자 및 문의처
- 담당: PSY Thinktank 운영팀
- 이메일: officialpsythinktank@gmail.com
개인정보 침해에 대한 신고나 상담이 필요한 경우 개인정보침해신고센터(privacy.kisa.or.kr, 국번 없이 118) 등에 문의하실 수 있습니다.

11. 개인정보 처리방침의 변경
내용이 변경되는 경우 시행 전 서비스 내 공지를 통해 안내합니다.`,
    en: `PSY Thinktank (the "Service") complies with the Personal Information Protection Act of Korea and other applicable laws, and establishes and discloses this Privacy Policy to protect users' personal information.

1. Personal information we process
- At registration: email address, password (stored encrypted by the authentication service), nickname
- Generated while using the Service: posts and comments you write, the date and time of your privacy consent
- Your browser storage (localStorage, sessionStorage) holds only convenience settings such as language and theme, and is never sent to our servers. For cookies, see Section 8.

2. Purposes of processing
- Member identification, registration, login, and account management
- Providing community features such as boards and comments
- Delivering service notices and responding to inquiries
- Preventing abuse and operating the Service

3. Retention period
We retain personal information until you delete your account and destroy it without delay upon deletion, except where applicable law requires us to keep it for a set period.

4. Provision to third parties
We do not provide your personal information to third parties, except with your prior consent or where required by law.

5. Outsourcing and overseas transfer
To operate the Service reliably, we outsource processing as follows.
- Processor: Google LLC (Firebase Authentication, Cloud Firestore)
- Tasks: member authentication and storage of member and post data
- Destination and method: the United States and other countries where Google data centers are located, transferred over the network when you use the Service
- Items transferred: email address, nickname, and usage records such as posts and comments
- Retention: until account deletion or the end of the outsourcing contract
You may refuse the overseas transfer, but you will then be unable to register or use the Service.

6. Destruction procedure and method
Personal information is destroyed without delay once its retention period ends or its purpose is fulfilled. Electronic files are deleted in a way that cannot be recovered.

7. Your rights and how to exercise them
You may view or correct your personal information at any time, and you may request suspension of processing and deletion by deleting your account. Requests can be made on the My Page screen or through the contact below.

8. Cookies, analytics, and advertising
- The Service uses Google Analytics to analyze usage. Google Analytics uses cookies to collect information such as pages visited, time on site, and device and browser details in a form that does not identify you personally, and this information is processed by Google LLC (United States). You can opt out with the Google Analytics Opt-out Browser Add-on (https://tools.google.com/dlpage/gaoptout).
- The Service uses third-party advertising services such as Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites.
- Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and/or other sites on the Internet. For details, see how Google uses information from sites that use its services (https://policies.google.com/technologies/partner-sites).
- You may opt out of personalized advertising in Google Ads Settings (https://adssettings.google.com), and you may opt out of third-party vendors' use of cookies for personalized advertising at www.aboutads.info.
- You can refuse or delete cookies through your web browser settings. However, refusing cookies may make some features of the Service harder to use.

9. Security measures
- Passwords are stored encrypted by the authentication service and cannot be viewed even by the operators.
- Database access is restricted by security rules.
- Access to members' personal information is limited to the minimum necessary staff (administrators and managers).
- All communication is encrypted over HTTPS.

10. Privacy officer and contact
- Contact: PSY Thinktank operations team
- Email: officialpsythinktank@gmail.com
For reports or consultations about privacy violations, you may also contact the Korean Personal Information Infringement Report Center (privacy.kisa.or.kr, 118 in Korea).

11. Changes to this policy
Any changes to this Privacy Policy will be announced within the Service before they take effect.`,
    ja: `PSY Thinktank（以下「本サービス」）は、韓国「個人情報保護法」その他関連法令を遵守し、利用者の個人情報を保護するため、以下のとおり個人情報処理方針を定めて公開します。

1. 処理する個人情報の項目
- 会員登録時：メールアドレス、パスワード（認証サービスにて暗号化して保存）、ニックネーム
- サービス利用過程で自動生成：作成した投稿・コメント、個人情報の収集・利用への同意日時
- 利用者のブラウザストレージ（localStorage、sessionStorage）には言語・画面テーマ設定など利便性のための値のみが保存され、サーバーには送信されません。Cookieについては第8項をご参照ください。

2. 個人情報の処理目的
- 会員の識別、会員登録およびログイン処理、アカウント管理
- 掲示板・コメントなどのコミュニティ機能の提供
- サービスに関するお知らせの配信およびお問い合わせへの対応
- 不正利用の防止およびサービス運営管理

3. 個人情報の保有および利用期間
退会時まで保有し、退会時に遅滞なく破棄します。ただし、関係法令により保存が必要な場合は、当該法令で定める期間保管します。

4. 個人情報の第三者提供
本サービスは利用者の個人情報を第三者に提供しません。ただし、利用者が事前に同意した場合または法令に基づき求められた場合は除きます。

5. 個人情報処理の委託および国外移転
本サービスは安定した運営のため、以下のとおり個人情報の処理業務を委託しています。
- 受託者：Google LLC（Firebase Authentication、Cloud Firestore）
- 委託業務：会員認証および会員・投稿データの保存
- 移転先の国および方法：米国などGoogleのデータセンター所在国、サービス利用時にネットワーク経由で送信
- 移転項目：メールアドレス、ニックネーム、投稿・コメントなどのサービス利用記録
- 保有期間：退会または委託契約終了時まで
利用者は国外移転を拒否できますが、その場合は会員登録およびサービスの利用が制限されます。

6. 個人情報の破棄手順および方法
保有期間が終了した、または処理目的が達成された個人情報は遅滞なく破棄します。電子ファイル形式の情報は復元できない方法で削除します。

7. 利用者の権利と行使方法
利用者はいつでも自身の個人情報を照会・修正でき、退会により処理の停止および削除を求めることができます。マイページまたは下記のお問い合わせ先からご請求いただけます。

8. Cookie、利用状況の分析および広告
- 本サービスは利用状況の分析のためにGoogle Analyticsを使用しています。Google AnalyticsはCookieにより、閲覧ページ、滞在時間、接続端末・ブラウザ情報などを個人を特定できない形で収集し、収集された情報はGoogle LLC（米国）で処理されます。Google Analyticsオプトアウトアドオン（https://tools.google.com/dlpage/gaoptout）により収集を拒否できます。
- 本サービスはGoogle AdSenseなどの第三者広告サービスを利用しており、Googleを含む第三者配信事業者は、Cookieを使用して利用者が本サイトや他のウェブサイトを訪問した履歴に基づいて広告を配信します。
- Googleは広告Cookieを使用することにより、利用者の本サイトおよび他のサイトへの訪問履歴に基づいた広告を利用者に配信できます。詳細は、Googleのパートナーサイトにおけるデータ使用についての案内（https://policies.google.com/technologies/partner-sites）をご覧ください。
- 利用者はGoogle広告設定（https://adssettings.google.com）でパーソナライズ広告を無効にでき、www.aboutads.infoで第三者配信事業者によるパーソナライズ広告用Cookieの使用を拒否できます。
- 利用者はウェブブラウザの設定によりCookieの保存を拒否し、または削除することができます。ただし、Cookieを拒否すると本サービスの一部がご利用しにくくなる場合があります。

9. 個人情報の安全性確保措置
- パスワードは認証サービスにて暗号化して保存され、運営者も確認できません。
- データベースへのアクセス権限をセキュリティルールで制限しています。
- 会員の個人情報を閲覧できる権限は、運営スタッフ（管理者・マネージャー）に最小限に限定しています。
- すべての通信はHTTPSで暗号化されます。

10. 個人情報保護責任者およびお問い合わせ先
- 担当：PSY Thinktank運営チーム
- メール：officialpsythinktank@gmail.com
個人情報侵害に関する申告や相談が必要な場合は、韓国個人情報侵害申告センター（privacy.kisa.or.kr、韓国内118）などにお問い合わせいただけます。

11. 個人情報処理方針の変更
本個人情報処理方針の内容が変更される場合は、施行前にサービス内のお知らせでご案内します。`,
    zh: `PSY Thinktank（以下简称"本服务"）遵守韩国《个人信息保护法》等相关法律法规，为保护用户的个人信息，制定并公开如下个人信息处理方针。

1. 处理的个人信息项目
- 注册会员时：电子邮箱地址、密码（由认证服务加密保存）、昵称
- 使用服务过程中自动生成：发布的帖子和评论、同意收集和使用个人信息的时间
- 用户浏览器存储（localStorage、sessionStorage）中仅保存语言、界面主题等便利设置，不会发送至服务器。关于Cookie，请参阅第8条。

2. 个人信息的处理目的
- 识别会员、办理注册和登录、管理账号
- 提供论坛、评论等社区功能
- 发送服务相关公告及答复咨询
- 防止不正当使用及服务运营管理

3. 个人信息的保留及使用期限
保留至会员注销账号为止，注销后立即销毁。但根据相关法律法规需要保存的，将在该法律法规规定的期限内保存。

4. 向第三方提供个人信息
本服务不会向第三方提供用户的个人信息。但用户事先同意或法律法规要求的情况除外。

5. 个人信息处理的委托及跨境转移
为稳定运营服务，本服务委托处理个人信息如下。
- 受托方：Google LLC（Firebase Authentication、Cloud Firestore）
- 委托业务：会员认证及会员、帖子数据的存储
- 转移国家及方式：美国等Google数据中心所在国家，在使用服务时通过网络传输
- 转移项目：电子邮箱地址、昵称、帖子和评论等服务使用记录
- 保留期限：至会员注销或委托合同终止为止
用户可以拒绝跨境转移，但此时将无法注册会员及使用服务。

6. 个人信息的销毁程序及方法
保留期限届满或处理目的达成的个人信息将立即销毁。电子文件形式的信息将以无法恢复的方式删除。

7. 用户的权利及行使方法
用户可随时查询、修改本人的个人信息，并可通过注销账号要求停止处理及删除。可通过"我的信息"页面或下列联系方式提出请求。

8. Cookie、使用情况分析及广告
- 本服务使用Google Analytics分析使用情况。Google Analytics通过Cookie以无法识别个人身份的形式收集访问页面、停留时间、设备及浏览器信息等，所收集的信息由Google LLC（美国）处理。用户可通过Google Analytics停用浏览器插件（https://tools.google.com/dlpage/gaoptout）拒绝收集。
- 本服务使用Google AdSense等第三方广告服务，包括Google在内的第三方供应商会使用Cookie，根据用户此前访问本网站或其他网站的记录投放广告。
- Google通过使用广告Cookie，可根据用户访问本网站及其他网站的记录向用户投放广告。详情请参阅Google关于合作伙伴网站数据使用的说明（https://policies.google.com/technologies/partner-sites）。
- 用户可在Google广告设置（https://adssettings.google.com）中停用个性化广告，也可在www.aboutads.info拒绝第三方供应商将Cookie用于个性化广告。
- 用户可通过网络浏览器设置拒绝保存或删除Cookie。但拒绝Cookie可能会给使用本服务的部分功能带来不便。

9. 确保个人信息安全的措施
- 密码由认证服务加密保存，运营者也无法查看。
- 通过安全规则限制数据库访问权限。
- 会员个人信息的查阅权限仅限于最少必要的运营人员（管理员、经理）。
- 所有通信均通过HTTPS加密。

10. 个人信息保护负责人及联系方式
- 负责：PSY Thinktank运营团队
- 电子邮箱：officialpsythinktank@gmail.com
如需举报或咨询个人信息侵害事宜，也可联系韩国个人信息侵害举报中心（privacy.kisa.or.kr，韩国境内拨打118）。

11. 个人信息处理方针的变更
本个人信息处理方针如有变更，将在施行前通过服务内公告进行通知。`,
};
