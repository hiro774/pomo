import React from "react";

interface TimerCardHandlers {
  handleStart: () => void;
  handleStop: () => void;
  handleReset: () => void;
  handleSkip: () => void;
}

interface TimerCardState {
  isWorkSession: boolean;
  progress: number;
  seconds: number;
  isRunning: boolean;
}

interface TimerCardUtils {
  formatTime: (seconds: number) => string;
}

type TimerCardProps = TimerCardState & TimerCardHandlers & TimerCardUtils;

const TimerCard: React.FC<TimerCardProps> = ({
  isWorkSession,
  progress,
  formatTime,
  seconds,
  handleStart,
  isRunning,
  handleStop,
  handleReset,
  handleSkip,
}) => {
  return (
    <div>
      {" "}
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
        <div className="text-5xl sm:text-6xl md:text-7xl font-mono font-bold mb-8 gradient-text from-secondary-500 to-accent-500 dark:from-secondary-400 dark:to-accent-400">
          {formatTime(seconds)}
        </div>

        {/* タイマー操作ボタン */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
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
    </div>
  );
};

export default TimerCard;
