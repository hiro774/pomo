"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { BGMPlayer } from "@/components/BGMPlayer";
import { AICommentBox } from "@/components/AICommentBox";
import { useRouter } from "next/navigation";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { AuthButton } from "@/components/common/AuthButton";

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();

  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [volume, setVolume] = useState(30);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [aiMessage, setAiMessage] = useState("準備はいい？そろそろ始めるよ！");
  const [isLoaded, setIsLoaded] = useState(false);

  // 🔐 未ログインならログインページへ
  // useEffect(() => {
  //   if (!session) {
  //     router.push("/login");
  //   }
  // }, [session, router]);

  // 📥 設定の読み込み
  useEffect(() => {
    const fetchSettings = async () => {
      if (!session) {
        setIsLoaded(true); // ← これを追加！
        return;
      }

      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setWorkMinutes(data.work_minutes ?? 25);
        setBreakMinutes(data.break_minutes ?? 5);
        setVolume(data.volume ?? 30);
        setSeconds((data.work_minutes ?? 25) * 60);
      }

      setIsLoaded(true); // ← ここも忘れずに
    };

    fetchSettings();
  }, [session, supabase]);

  // 🧠 メッセージ更新
  useEffect(() => {
    if (seconds === 0) {
      setAiMessage(
        isWorkSession
          ? "お疲れさま！ちょっと休もう☕️"
          : "休憩終了！次のセットいってみよっか！"
      );
    } else {
      setAiMessage(
        isWorkSession
          ? "集中タイムだよ、見てるからね👀"
          : "リラックスして〜、深呼吸〜"
      );
    }
  }, [isWorkSession, seconds]);

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
      updated_at: new Date().toISOString(),
    });
  };

  if (!isLoaded) {
    return <main className="p-6">読み込み中...</main>;
  }

  return (
    <>
      <AuthButton />
      <main className="flex flex-col items-center justify-center min-h-screen text-center px-4 transition-colors bg-white text-black dark:bg-gray-900 dark:text-white">
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 text-sm bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded"
        >
          {isDark ? "ライトモード" : "ダークモード"}
        </button>

        <h1 className="text-4xl font-bold mb-4">🍅 ポモドーロタイマー</h1>
        <p className="mb-2 text-lg">
          {isWorkSession ? "作業中 ⏳" : "休憩中 ☕️"}
        </p>
        <div className="text-6xl font-mono mb-6">{formatTime(seconds)}</div>

        {/* タイマー操作 */}
        <div className="flex gap-4 flex-wrap justify-center mb-6">
          <button
            onClick={handleStart}
            className="bg-green-500 text-white px-6 py-2 rounded"
          >
            Start
          </button>
          <button
            onClick={handleStop}
            className="bg-red-500 text-white px-6 py-2 rounded"
          >
            Stop
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-400 text-white px-6 py-2 rounded"
          >
            Reset
          </button>
          <button
            onClick={handleSkip}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Skip
          </button>
        </div>

        {/* カスタム設定 */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-4 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">タイマー設定</h2>
          <div className="flex flex-col gap-4">
            <label className="flex justify-between items-center">
              作業時間（分）:
              <input
                type="number"
                min={1}
                value={workMinutes}
                onChange={(e) => setWorkMinutes(Number(e.target.value))}
                className="border px-2 py-1 rounded w-24 text-right dark:bg-gray-700 dark:border-gray-600"
              />
            </label>
            <label className="flex justify-between items-center">
              休憩時間（分）:
              <input
                type="number"
                min={1}
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(Number(e.target.value))}
                className="border px-2 py-1 rounded w-24 text-right dark:bg-gray-700 dark:border-gray-600"
              />
            </label>
            <button
              onClick={handleApplySettings}
              className="bg-indigo-600 text-white py-2 rounded mt-2"
            >
              Apply
            </button>
          </div>
        </div>
      </main>
      <AICommentBox message={aiMessage} />
      <BGMPlayer />
    </>
  );
}
