"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { BGMPlayer } from "@/components/features/BGMPlayer";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Header from "@/components/layout/Header";
import TimerCard from "@/components/layout/TimerCard";
import SessionStatus from "@/components/layout/SessionStatus";
import SettingsCard from "@/components/layout/SettingsCard";

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const supabase = useSupabaseClient();
  const session = useSession();

  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  // const [volume, setVolume] = useState(30);
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
        // setVolume(data.volume ?? 30);
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

  // 作業時間または休憩時間が変更されたときにタイマーを更新
  useEffect(() => {
    if (!isRunning) {
      const newTime = isWorkSession ? workMinutes * 60 : breakMinutes * 60;
      setSeconds(newTime);
    }
  }, [workMinutes, breakMinutes, isWorkSession, isRunning]);

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

  // ✅ 設定の保存（将来的にSupabaseへの保存機能を実装する可能性があるため残しておく）
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleApplySettings = async () => {
    setIsRunning(false);

    // if (!session) return;

    // await supabase.from("settings").upsert({
    //   id: session.user.id,
    //   work_minutes: workMinutes,
    //   break_minutes: breakMinutes,
    //   volume: volume,
    //   updated_at: new Date().toISOString(),
    // });
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
      />
      {/* メインコンテンツ */}
      <main className="flex flex-col items-center justify-center min-h-screen pt-16 pb-8 px-4 bg-gradient-to-b from-light-100 to-light-300 dark:from-dark-200 dark:to-dark-300 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <div className="w-full max-w-md mx-auto animate-slide-up">
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

          <SettingsCard
            workMinutes={workMinutes}
            setWorkMinutes={setWorkMinutes}
            breakMinutes={breakMinutes}
            setBreakMinutes={setBreakMinutes}
          />
        </div>
      </main>
      <BGMPlayer videoUrl={videoUrl} />
    </>
  );
}
