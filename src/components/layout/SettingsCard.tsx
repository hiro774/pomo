import React from "react";

interface SettingsCardProps {
  workMinutes: number;
  setWorkMinutes: (value: number) => void;
  breakMinutes: number;
  setBreakMinutes: (value: number) => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  workMinutes,
  setWorkMinutes,
  breakMinutes,
  setBreakMinutes,
}) => {
  return (
    <div>
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
              onChange={(e) => {
                setWorkMinutes(Number(e.target.value));
              }}
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
          {/* 設定を適用ボタンは削除 - 設定変更時に自動的に反映されるようになりました */}
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
