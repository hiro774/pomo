"use client";

import { BGMPlayer } from "@/components/features/BGMPlayer";
import Header from "@/components/layout/Header";
import TimerCard from "@/components/layout/TimerCard";
import SessionStatus from "@/components/layout/SessionStatus";
import SettingsCard from "@/components/layout/SettingsCard";
import useSettings from "@/hooks/useSettings";
import usePomodoro from "@/hooks/usePomodoro";

export default function Home() {
  // 設定関連のフックを使用
  const {
    workMinutes,
    setWorkMinutes,
    breakMinutes,
    setBreakMinutes,
    videoUrl,
    setVideoUrl,
    isLoaded,
    isDark,
    toggleTheme,
    session,
  } = useSettings();

  // タイマー関連のフックを使用
  const {
    seconds,
    isRunning,
    isWorkSession,
    handleStart,
    handleStop,
    handleReset,
    handleSkip,
    formatTime,
    progress,
  } = usePomodoro({ workMinutes, breakMinutes });

  if (!isLoaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-light-100 dark:bg-dark-200">
        <div className="animate-pulse-slow flex flex-col items-center">
          <div className="h-32 w-32 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 animate-spin opacity-70"></div>
          <p className="mt-4 ml-3 text-base font-bold text-gray-600 dark:text-gray-300">
            loading...
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Header
        toggleTheme={toggleTheme}
        isDark={isDark}
        session={
          session && session.user.email
            ? { user: { email: session.user.email } }
            : null
        }
        workMinutes={workMinutes}
        setWorkMinutes={setWorkMinutes}
        breakMinutes={breakMinutes}
        setBreakMinutes={setBreakMinutes}
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
      />
      {/* メインコンテンツ */}
      <main className="flex flex-col items-center justify-center min-h-screen pt-16 pb-8 px-4 bg-gradient-to-br from-light-100 via-light-200 to-light-300 dark:from-dark-200 dark:via-dark-100 dark:to-dark-300 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto animate-slide-up">
          <div className="relative">
            {/* 背景の装飾要素 */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-primary-300/20 to-primary-500/20 dark:from-primary-500/10 dark:to-primary-700/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-10 w-60 h-60 bg-gradient-to-tr from-secondary-300/20 to-secondary-500/20 dark:from-secondary-500/10 dark:to-secondary-700/10 rounded-full blur-3xl"></div>

            {/* セッションステータス */}
            <SessionStatus isWorkSession={isWorkSession} />

            {/* タイマーカード */}
            <TimerCard
              isWorkSession={isWorkSession}
              progress={progress}
              formatTime={formatTime}
              seconds={seconds}
              handleStart={handleStart}
              isRunning={isRunning}
              handleStop={handleStop}
              handleReset={handleReset}
              handleSkip={handleSkip}
            />

            {/* 設定カード */}
            <div className="mb-[100px] mt-8">
              <SettingsCard
                workMinutes={workMinutes}
                setWorkMinutes={setWorkMinutes}
                breakMinutes={breakMinutes}
                setBreakMinutes={setBreakMinutes}
              />
            </div>
          </div>
        </div>
      </main>
      <BGMPlayer videoUrl={videoUrl} />
    </>
  );
}
