import React from "react";

interface SessionStatusProps {
  isWorkSession: boolean;
}

const SessionStatus = ({ isWorkSession }: SessionStatusProps) => {
  return (
    <div>
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
    </div>
  );
};

export default SessionStatus;
