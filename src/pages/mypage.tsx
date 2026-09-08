import * as React from "react";
import {useEffect, useState} from "react";
import type {HeadFC, PageProps} from "gatsby";
import {navigate} from "gatsby";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {useAuth} from "../contexts/AuthContext";

const inputClass =
    "w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700";
const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";
const sectionClass = "space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950";

const MyPage: React.FC<PageProps> = () => {
    const {user, profile, loading, updateNickname, changePassword, deleteAccount} = useAuth();

    const [nickname, setNickname] = useState("");
    const [nicknameMessage, setNicknameMessage] = useState<string | null>(null);
    const [nicknameSubmitting, setNicknameSubmitting] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
    const [passwordSubmitting, setPasswordSubmitting] = useState(false);

    const [showWithdraw, setShowWithdraw] = useState(false);
    const [withdrawPassword, setWithdrawPassword] = useState("");
    const [withdrawMessage, setWithdrawMessage] = useState<string | null>(null);
    const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [loading, user]);

    useEffect(() => {
        if (profile) setNickname(profile.nickname);
    }, [profile]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
                <Header/>
                <main className="flex-1"/>
                <Footer/>
            </div>
        );
    }

    const handleNicknameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setNicknameMessage(null);
        setNicknameSubmitting(true);
        try {
            await updateNickname(nickname);
            setNicknameMessage("닉네임이 변경되었습니다.");
        } catch {
            setNicknameMessage("닉네임 변경에 실패했습니다.");
        } finally {
            setNicknameSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (newPassword !== newPasswordConfirm) {
            setPasswordMessage("새 비밀번호가 일치하지 않습니다.");
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMessage("비밀번호는 6자 이상이어야 합니다.");
            return;
        }

        setPasswordSubmitting(true);
        try {
            await changePassword(currentPassword, newPassword);
            setPasswordMessage("비밀번호가 변경되었습니다.");
            setCurrentPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
        } catch {
            setPasswordMessage("현재 비밀번호가 올바르지 않습니다.");
        } finally {
            setPasswordSubmitting(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setWithdrawMessage(null);
        setWithdrawSubmitting(true);
        try {
            await deleteAccount(withdrawPassword);
            await navigate("/");
        } catch {
            setWithdrawMessage("비밀번호가 올바르지 않습니다.");
            setWithdrawSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
            <Header/>

            <main className="flex-1 mx-auto w-full max-w-lg px-4 py-10 space-y-6">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">내 정보</h1>

                <section className={sectionClass}>
                    <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">계정</h2>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{user.email}</p>
                </section>

                <form onSubmit={handleNicknameSubmit} className={sectionClass}>
                    <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">닉네임 변경</h2>
                    <div>
                        <label htmlFor="nickname" className={labelClass}>닉네임</label>
                        <input
                            id="nickname"
                            type="text"
                            required
                            maxLength={20}
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    {nicknameMessage && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">{nicknameMessage}</p>
                    )}
                    <button
                        type="submit"
                        disabled={nicknameSubmitting}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                    >
                        {nicknameSubmitting ? "저장 중..." : "닉네임 저장"}
                    </button>
                </form>

                <form onSubmit={handlePasswordSubmit} className={sectionClass}>
                    <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">비밀번호 변경</h2>
                    <div>
                        <label htmlFor="currentPassword" className={labelClass}>현재 비밀번호</label>
                        <input
                            id="currentPassword"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className={labelClass}>새 비밀번호</label>
                        <input
                            id="newPassword"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label htmlFor="newPasswordConfirm" className={labelClass}>새 비밀번호 확인</label>
                        <input
                            id="newPasswordConfirm"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={newPasswordConfirm}
                            onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    {passwordMessage && (
                        <p className="text-sm text-slate-600 dark:text-slate-400">{passwordMessage}</p>
                    )}
                    <button
                        type="submit"
                        disabled={passwordSubmitting}
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 transition-colors"
                    >
                        {passwordSubmitting ? "변경 중..." : "비밀번호 변경"}
                    </button>
                </form>

                <section className="space-y-4 rounded-xl border border-red-200 bg-red-50/30 p-6 dark:border-red-900/40 dark:bg-red-900/10">
                    <h2 className="text-sm font-semibold text-red-600 dark:text-red-400">회원 탈퇴</h2>

                    {!showWithdraw ? (
                        <button
                            type="button"
                            onClick={() => setShowWithdraw(true)}
                            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                        >
                            회원 탈퇴
                        </button>
                    ) : (
                        <form onSubmit={handleWithdraw} className="space-y-4">
                            <p className="text-sm text-red-600 dark:text-red-400">
                                탈퇴하면 계정과 프로필 정보가 삭제되며 복구할 수 없습니다.
                            </p>
                            <div>
                                <label htmlFor="withdrawPassword" className={labelClass}>비밀번호 확인</label>
                                <input
                                    id="withdrawPassword"
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={withdrawPassword}
                                    onChange={(e) => setWithdrawPassword(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            {withdrawMessage && (
                                <p className="text-sm text-red-600 dark:text-red-400">{withdrawMessage}</p>
                            )}
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={withdrawSubmitting}
                                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-colors"
                                >
                                    {withdrawSubmitting ? "탈퇴 처리 중..." : "탈퇴 확정"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowWithdraw(false)}
                                    className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300 transition-colors"
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    )}
                </section>
            </main>

            <Footer/>
        </div>
    );
};

export default MyPage;

export const Head: HeadFC = () => <title>내 정보</title>;
