import React from "react";

interface SessionStatusProps {
  isWorkSession: boolean;
}

const SessionStatus = ({ isWorkSession }: SessionStatusProps) => {
  return (
    <div>
      {/* セッションステータス */}
      <div className="mt-8 mb-8 flex justify-center">
        <div
          className={`
          inline-flex items-center gap-3 px-6 py-3 
          rounded-2xl shadow-soft transform transition-all duration-300
          ${
            isWorkSession
              ? "bg-gradient-to-r from-secondary-500/90 to-secondary-600/90 dark:from-secondary-600/90 dark:to-secondary-700/90"
              : "bg-gradient-to-r from-primary-500/90 to-primary-600/90 dark:from-primary-600/90 dark:to-primary-700/90"
          }
          backdrop-blur-md
        `}
        >
          <div
            className={`
            w-4 h-4 rounded-full animate-pulse-slow
            ${
              isWorkSession
                ? "bg-white shadow-glow-secondary"
                : "bg-white shadow-glow-primary"
            }
          `}
          ></div>
          <p className="text-xl md:text-2xl font-bold text-white">
            {isWorkSession ? "作業中" : "休憩中"}
          </p>
          <div
            className={`
            hidden sm:flex items-center gap-1 ml-1 px-2 py-1 
            bg-white/20 rounded-lg text-white text-sm font-medium
          `}
          >
            {isWorkSession ? (
              <>
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>集中タイム</span>
              </>
            ) : (
              <>
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
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <span>リフレッシュ</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionStatus;
