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
  const [videoUrl, setVideoUrl] = useState(""); // ← 追加

  // 📥 設定の読み込み
  useEffect(() => {
    const fetchSettings = async () => {
      if (!session) {
        setIsLoaded(true); // ← これを追加！
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

      setIsLoaded(true); //
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
    }

    return () => clearInterval(timer);
  }, [isRunning, seconds, isWorkSession, workMinutes, breakMinutes]);

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
      // video_url: videoUrl,
      updated_at: new Date().toISOString(),
    });
  };

  if (!isLoaded) {
    return <main className="p-6">読み込み中...</main>;
  }

  return (
    <>
      <div className="fixed top-10 right-20 z-10 flex items-center gap-2">
        <AuthButton />
      </div>

      <div className="fixed top-4 left-4 z-10">
        <Link
          href="/settings"
          className="text-sm bg-opacity-80 backdrop-blur-sm bg-gray-200 dark:bg-gray-800 px-3 py-1.5 rounded-full text-black dark:text-white hover:shadow-md transition-all flex items-center gap-1"
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
          className="text-sm bg-opacity-80 backdrop-blur-sm bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-3 py-1.5 rounded-full flex items-center transition-all hover:shadow-md"
        >
          {isDark ? "🌞 ライト" : "🌙 ダーク"}
        </button>
      </div>

      <main className="flex flex-col items-center justify-center min-h-screen text-center px-4 transition-colors bg-gradient-to-b from-white to-gray-100 text-black dark:from-gray-900 dark:to-gray-800 dark:text-white">
        {session?.user && (
          <div className="absolute top-16 right-4 bg-opacity-80 backdrop-blur-sm bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
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

        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <div className="inline-block bg-opacity-70 backdrop-blur-sm bg-white dark:bg-gray-800 px-4 py-1 rounded-full shadow-sm">
              <p className="text-lg font-medium">
                {isWorkSession ? "作業中 ⏳" : "休憩中 ☕️"}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 transition-all hover:shadow-xl">
            <div className="text-7xl font-mono font-bold mb-8 bg-gradient-to-r from-red-500 to-orange-500 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
              {formatTime(seconds)}
            </div>

            {/* タイマー操作 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={handleStart}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Start
              </button>
              <button
                onClick={handleStop}
                className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Stop
              </button>
              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Reset
              </button>
              <button
                onClick={handleSkip}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Skip
              </button>
            </div>
          </div>

          {/* <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 transition-all">
            <label className="flex flex-col gap-2 mb-2">
              <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
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
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                BGM YouTube URL:
              </span>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg w-full text-sm dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                placeholder="https://youtu.be/abc123..."
              />
            </label>
          </div> */}

          {/* カスタム設定 */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 w-full transition-all">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-orange-500"
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
              <label className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <span className="font-medium flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-red-500"
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
                  作業時間（分）:
                </span>
                <input
                  type="number"
                  min={1}
                  value={workMinutes}
                  onChange={(e) => setWorkMinutes(Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg w-24 text-right dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
              </label>
              <label className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <span className="font-medium flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-500"
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
                  休憩時間（分）:
                </span>
                <input
                  type="number"
                  min={1}
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Number(e.target.value))}
                  className="border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg w-24 text-right dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
              </label>
              <button
                onClick={handleApplySettings}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 mt-2"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </main>
      <BGMPlayer videoUrl={videoUrl} />
    </>
  );
}
