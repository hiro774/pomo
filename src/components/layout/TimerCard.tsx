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
    <div className="relative">
      {/* タイマーカード */}
      <div
        className={`
        card p-8 mb-8 transition-all duration-500 
        border-2 ${
          isWorkSession
            ? "border-secondary-400/30 dark:border-secondary-600/30"
            : "border-primary-400/30 dark:border-primary-600/30"
        }
        bg-gradient-to-br from-white/90 to-white/70
        dark:from-dark-100/90 dark:to-dark-100/70
        backdrop-blur-md
      `}
      >
        {/* 進捗バーコンテナ */}
        <div className="relative w-full h-4 bg-gray-200/50 dark:bg-gray-700/50 rounded-full mb-10 overflow-hidden shadow-inner-soft">
          {/* 進捗バー */}
          <div
            className={`
              absolute top-0 left-0 h-full rounded-full 
              transition-all duration-1000 ease-linear
              ${
                isWorkSession
                  ? "bg-gradient-to-r from-secondary-400 via-secondary-500 to-secondary-600"
                  : "bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600"
              }
              shadow-md
            `}
            style={{ width: `${progress}%` }}
          ></div>

          {/* 進捗パーセント表示 */}
          <div className="absolute top-0 right-2 text-xs font-bold h-full flex items-center text-gray-600 dark:text-gray-300">
            {Math.round(progress)}%
          </div>
        </div>

        {/* タイマー表示 */}
        <div
          className={`
          relative text-6xl sm:text-7xl md:text-8xl font-mono font-bold mb-10 
          text-center py-6 
          ${
            isWorkSession
              ? "text-secondary-600 dark:text-secondary-400"
              : "text-primary-600 dark:text-primary-400"
          }
        `}
        >
          {/* 背景円 */}
          <div
            className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-40 h-40 md:w-48 md:h-48 rounded-full opacity-10
            ${
              isWorkSession
                ? "bg-secondary-200 dark:bg-secondary-800 animate-pulse-slow"
                : "bg-primary-200 dark:bg-primary-800 animate-pulse-slow"
            }
          `}
          ></div>

          {/* 時間表示 */}
          <span className="relative z-10">{formatTime(seconds)}</span>
        </div>

        {/* タイマー操作ボタン */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          {/* スタートボタン */}
          <button
            onClick={handleStart}
            disabled={isRunning}
            className={`
              rounded-xl font-bold text-white shadow-lg px-6 py-2 text-lg
              transition-all duration-300 transform
              ${
                isRunning
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:-translate-y-1 hover:shadow-xl"
              }
              ${
                isWorkSession
                  ? "bg-gradient-to-r from-secondary-500 to-secondary-600"
                  : "bg-gradient-to-r from-primary-500 to-primary-600"
              }
            `}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
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
              {/* <span className="text-lg">Start</span> */}
            </span>
          </button>

          {/* ストップボタン */}
          <button
            onClick={handleStop}
            disabled={!isRunning}
            className={`
              rounded-xl font-bold text-white shadow-lg px-6 py-2 text-lg
              transition-all duration-300 transform
              ${
                !isRunning
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:-translate-y-1 hover:shadow-xl hover:from-gray-700 hover:to-gray-800"
              }
              bg-gradient-to-r from-gray-600 to-gray-700
            `}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-9 w-9"
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
              {/* <span className="text-lg">Stop</span> */}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* リセットボタン */}
          <button
            onClick={handleReset}
            className={`
              btn rounded-xl font-bold px-6 py-2 text-lg
              bg-white dark:bg-dark-200
              border-2 border-gray-300 dark:border-gray-600
              text-gray-700 dark:text-gray-200
              hover:bg-gray-100 dark:hover:bg-dark-100
              transition-all duration-300 transform hover:-translate-y-1
            `}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
              {/* <span className="text-lg">Reset</span> */}
            </span>
          </button>

          {/* スキップボタン */}
          <button
            onClick={handleSkip}
            className={`
              btn rounded-xl font-bold text-white px-6 py-2 text-lg
              bg-gradient-to-r from-accent-500 to-accent-600
              hover:from-accent-600 hover:to-accent-700
              transition-all duration-300 transform hover:-translate-y-1
              shadow-md hover:shadow-lg
            `}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
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
              {/* <span className="text-lg">Skip</span> */}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimerCard;
