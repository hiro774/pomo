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
          <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">
            読み込み中...
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
      <main className="flex flex-col items-center justify-center min-h-screen pt-16 pb-8 px-4 bg-gradient-to-b from-light-100 to-light-300 dark:from-dark-200 dark:to-dark-300 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto animate-slide-up">
          <SessionStatus isWorkSession={isWorkSession} />

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
          <div className="mb-[100px]">
            <SettingsCard
              workMinutes={workMinutes}
              setWorkMinutes={setWorkMinutes}
              breakMinutes={breakMinutes}
              setBreakMinutes={setBreakMinutes}
            />
          </div>
        </div>
      </main>
      <BGMPlayer videoUrl={videoUrl} />
    </>
  );
}
