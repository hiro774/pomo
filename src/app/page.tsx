"use client";

import { useEffect, useRef, useState } from "react";
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
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(workMinutes * 60);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [progress, setProgress] = useState(100);

  const isRunningRef = useRef(isRunning);
  const settingsLoadedRef = useRef(false);

  useEffect(() => {
    // タブの可視性変更を監視
    const handleVisibilityChange = () => {
      // タブが表示状態に変わった時は何もしない（設定のリセットを防止）
      if (document.visibilityState === "visible") {
        console.log("タブがアクティブになりました");
      }
    };

    // visibilitychangeイベントリスナーを追加
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const fetchSettings = async () => {
      // すでに設定を読み込んでいる場合は再読み込みしない
      if (settingsLoadedRef.current) {
        return;
      }

      if (!session) {
        setIsLoaded(true);
        return;
      }
      console.log("設定が読み込まれたよ");

      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setWorkMinutes(data.work_minutes ?? 25);
        setBreakMinutes(data.break_minutes ?? 5);
        setSeconds((data.work_minutes ?? 25) * 60);
        setVideoUrl(data.video_url ?? "");
      }

      setIsLoaded(true);
      settingsLoadedRef.current = true;
    };

    fetchSettings();

    // クリーンアップ関数
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session, supabase]);

  // タイマー処理
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && startTime !== null) {
      timer = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = Math.max(duration - elapsed, 0);
        setSeconds(remaining);

        if (remaining <= 0) {
          clearInterval(timer);

          const next = !isWorkSession;
          setIsWorkSession(next);

          const nextDuration = next ? workMinutes * 60 : breakMinutes * 60;
          setDuration(nextDuration);
          setStartTime(Date.now());
          setIsRunning(true);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [
    isRunning,
    startTime,
    duration,
    isWorkSession,
    workMinutes,
    breakMinutes,
  ]);

  // 進捗バーの更新
  useEffect(() => {
    const totalSeconds = isWorkSession ? workMinutes * 60 : breakMinutes * 60;
    const percentage = (seconds / totalSeconds) * 100;
    setProgress(percentage);
  }, [seconds, isWorkSession, workMinutes, breakMinutes]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  // 作業時間または休憩時間が変更されたときにタイマーを更新
  useEffect(() => {
    if (!isRunningRef.current) {
      const newTime = isWorkSession ? workMinutes * 60 : breakMinutes * 60;
      setSeconds(newTime);
    }
  }, [workMinutes, breakMinutes, isWorkSession]);

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

  const handleStart = () => {
    setStartTime(Date.now());
    setDuration(isWorkSession ? workMinutes * 60 : breakMinutes * 60);
    setIsRunning(true);
  };
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    if (isWorkSession) {
      setIsRunning(false);
      setIsWorkSession(true);
      setSeconds(workMinutes * 60);
    } else {
      setIsRunning(false);
      setIsWorkSession(false);
      setSeconds(breakMinutes * 60);
    }
  };
  const handleSkip = () => {
    const next = !isWorkSession;
    setIsWorkSession(next);
    setSeconds(next ? workMinutes * 60 : breakMinutes * 60);
    setIsRunning(false);
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
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
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
