"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { BGMPlayer } from "@/components/BGMPlayer";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { AuthButton } from "@/components/common/AuthButton";
import Link from "next/link";

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const supabase = useSupabaseClient();
  const session = useSession();

  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [volume, setVolume] = useState(30);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [progress, setProgress] = useState(100); // 進捗バーの状態を追加

  // 📥 設定の読み込み
  useEffect(() => {
    const fetchSettings = async () => {
      if (!session) {
        setIsLoaded(true);
        return;
      }

      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setWorkMinutes(data.work_minutes ?? 25);
        setBreakMinutes(data.break_minutes ?? 5);
        setVolume(data.volume ?? 30);
        setSeconds((data.work_minutes ?? 25) * 60);
        setVideoUrl(data.video_url ?? "");
      }

      setIsLoaded(true);
    };

    fetchSettings();
  }, [session, supabase]);

  // ⏱️ タイマー処理
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    }

    if (isRunning && seconds === 0) {
      setIsRunning(false);
      const next = !isWorkSession;
      setIsWorkSession(next);
      setSeconds(next ? workMinutes * 60 : breakMinutes * 60);
      setIsRunning(true);

      // 通知を表示
      if (Notification.permission === "granted") {
        new Notification(next ? "作業時間開始" : "休憩時間開始", {
          body: next
            ? `${workMinutes}分の作業を始めましょう`
            : `${breakMinutes}分の休憩をお楽しみください`,
          icon: "/vercel.svg",
        });
      }
    }

    return () => clearInterval(timer);
  }, [isRunning, seconds, isWorkSession, workMinutes, breakMinutes]);

  // 進捗バーの更新
  useEffect(() => {
    const totalSeconds = isWorkSession ? workMinutes * 60 : breakMinutes * 60;
    const percentage = (seconds / totalSeconds) * 100;
    setProgress(percentage);
  }, [seconds, isWorkSession, workMinutes, breakMinutes]);

  // 通知許可の確認
  useEffect(() => {
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }
  }, []);

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setIsWorkSession(true);
    setSeconds(workMinutes * 60);
  };
  const handleSkip = () => {
    const next = !isWorkSession;
    setIsWorkSession(next);
    setSeconds(next ? workMinutes * 60 : breakMinutes * 60);
    setIsRunning(false);
  };

  // ✅ Apply時にSupabaseに保存
  const handleApplySettings = async () => {
    const newTime = isWorkSession ? workMinutes * 60 : breakMinutes * 60;
    setSeconds(newTime);
    setIsRunning(false);

    if (!session) return;

    await supabase.from("settings").upsert({
      id: session.user.id,
      work_minutes: workMinutes,
      break_minutes: breakMinutes,
      volume: volume,
      updated_at: new Date().toISOString(),
    });
  };

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
      {/* ヘッダーナビゲーション */}
      <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-dark-100/80 backdrop-blur-md shadow-soft">
        <div className="flex items-center gap-2">
          <Link
            href="/settings"
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
          </Link>
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

      {/* メインコンテンツ */}
      <main className="flex flex-col items-center justify-center min-h-screen pt-16 pb-8 px-4 bg-gradient-to-b from-light-100 to-light-300 dark:from-dark-200 dark:to-dark-300 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <div className="w-full max-w-md mx-auto animate-slide-up">
          {/* セッションステータス */}
          <div className="mb-8 flex justify-center">
            <div className="inline-block bg-white/90 dark:bg-dark-100/90 backdrop-blur-md px-5 py-2 rounded-full shadow-soft">
              <p className="text-lg font-medium flex items-center gap-2">
                {isWorkSession ? (
                  <>
                    <span className="inline-block w-3 h-3 bg-secondary-500 rounded-full animate-pulse"></span>
                    <span className="gradient-text from-secondary-400 to-secondary-600">
                      作業中
                    </span>
                  </>
                ) : (
                  <>
                    <span className="inline-block w-3 h-3 bg-primary-500 rounded-full animate-pulse"></span>
                    <span className="gradient-text from-primary-400 to-primary-600">
                      休憩中
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* タイマーカード */}
          <div className="card p-8 mb-8 hover:transform hover:scale-[1.02] transition-all duration-300">
            {/* 進捗バー */}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                  isWorkSession
                    ? "bg-gradient-to-r from-secondary-400 to-secondary-600"
                    : "bg-gradient-to-r from-primary-400 to-primary-600"
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {/* タイマー表示 */}
            <div className="text-7xl font-mono font-bold mb-8 gradient-text from-secondary-500 to-accent-500 dark:from-secondary-400 dark:to-accent-400">
              {formatTime(seconds)}
            </div>

            {/* タイマー操作ボタン */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={handleStart}
                className="btn btn-primary bg-gradient-to-r from-primary-500 to-primary-600"
                disabled={isRunning}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  スタート
                </span>
              </button>
              <button
                onClick={handleStop}
                className="btn btn-secondary bg-gradient-to-r from-secondary-500 to-secondary-600"
                disabled={!isRunning}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  ストップ
                </span>
              </button>
              <button onClick={handleReset} className="btn btn-outline">
                <span className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  リセット
                </span>
              </button>
              <button
                onClick={handleSkip}
                className="btn btn-accent bg-gradient-to-r from-accent-500 to-accent-600"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"
                    />
                  </svg>
                  スキップ
                </span>
              </button>
            </div>
          </div>

          {/* カスタム設定 */}
          <div className="card p-6 w-full transition-all duration-300 hover:shadow-soft-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 gradient-text from-secondary-500 to-accent-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-secondary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              タイマー設定
            </h2>
            <div className="flex flex-col gap-4">
              <label className="flex justify-between items-center bg-light-200 dark:bg-dark-100 p-4 rounded-xl shadow-inner-soft">
                <span className="font-medium flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-secondary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  作業時間（分）
                </span>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={workMinutes}
                  onChange={(e) => setWorkMinutes(Number(e.target.value))}
                  className="input-field w-24 text-right"
                />
              </label>
              <label className="flex justify-between items-center bg-light-200 dark:bg-dark-100 p-4 rounded-xl shadow-inner-soft">
                <span className="font-medium flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  休憩時間（分）
                </span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Number(e.target.value))}
                  className="input-field w-24 text-right"
                />
              </label>
              <button
                onClick={handleApplySettings}
                className="btn btn-primary bg-gradient-to-r from-secondary-500 to-accent-500 mt-2 py-3"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  設定を適用
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <BGMPlayer videoUrl={videoUrl} />
    </>
  );
}
