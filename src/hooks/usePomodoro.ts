import { useEffect, useRef, useState } from "react";

interface PomodoroProps {
  workMinutes: number;
  breakMinutes: number;
}

const usePomodoro = ({ workMinutes, breakMinutes }: PomodoroProps) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(workMinutes * 60);
  const [seconds, setSeconds] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [progress, setProgress] = useState(100);
  const [elapsedBeforePause, setElapsedBeforePause] = useState(0);

  const isRunningRef = useRef(isRunning);

  // タイマー操作関数
  const handleStart = () => {
    const now = Date.now();
    const newStartTime = now - elapsedBeforePause * 1000;
    setStartTime(newStartTime);
    setDuration(isWorkSession ? workMinutes * 60 : breakMinutes * 60);
    setIsRunning(true);
    setElapsedBeforePause(0);
  };

  const handleStop = () => {
    if (startTime !== null) {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedBeforePause((prev) => prev + elapsed);
      setStartTime(null);
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(isWorkSession ? workMinutes * 60 : breakMinutes * 60);
    setElapsedBeforePause(0);
  };

  const handleSkip = () => {
    const next = !isWorkSession;
    setIsWorkSession(next);
    setSeconds(next ? workMinutes * 60 : breakMinutes * 60);
    setIsRunning(false);
    setElapsedBeforePause(0);
  };

  // 時間フォーマット関数
  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

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
          setElapsedBeforePause(0);

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

  // isRunningRefの更新
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

  return {
    seconds,
    isRunning,
    isWorkSession,
    handleStart,
    handleStop,
    handleReset,
    handleSkip,
    formatTime,
    progress,
  };
};

export default usePomodoro;
