import React, { useState } from "react";
import { AuthButton } from "../common/AuthButton";
import SettingsModal from "../features/SettingsModal";

interface HeaderProps {
  toggleTheme: () => void;
  isDark: boolean;
  session: {
    user?: {
      email: string;
    };
  } | null;
  workMinutes: number;
  setWorkMinutes: (value: number) => void;
  breakMinutes: number;
  setBreakMinutes: (value: number) => void;
  videoUrl: string;
  setVideoUrl: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  toggleTheme,
  isDark,
  session,
  workMinutes,
  setWorkMinutes,
  breakMinutes,
  setBreakMinutes,
  videoUrl,
  setVideoUrl,
}) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);
  return (
    <div>
      {/* 設定モーダル */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
        workMinutes={workMinutes}
        setWorkMinutes={setWorkMinutes}
        breakMinutes={breakMinutes}
        setBreakMinutes={setBreakMinutes}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
      />

      {/* ヘッダーナビゲーション */}
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-dark-100/80 backdrop-blur-md shadow-soft">
        <div className="flex items-center gap-2">
          {session?.user && (
            <button
              onClick={openSettingsModal}
              className="btn-outline text-sm px-3 py-1.5 rounded-full flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              設定
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="btn-outline text-sm px-3 py-1.5 rounded-full flex items-center gap-1"
            aria-label={
              isDark ? "ライトモードに切り替え" : "ダークモードに切り替え"
            }
          >
            {isDark ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span>ライト</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
                <span>ダーク</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center">
          <AuthButton />
        </div>
      </header>

      {/* ユーザー情報 */}
      {session?.user && (
        <div className="fixed top-16 right-4 z-10 bg-white/90 dark:bg-dark-100/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-soft animate-fade-in">
          <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            {session.user.email} さん
          </p>
        </div>
      )}
    </div>
  );
};

export default Header;
