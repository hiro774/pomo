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
    <div className="relative">
      {/* 背景装飾 */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent-400/10 dark:bg-accent-600/10 rounded-full blur-xl"></div>

      {/* カスタム設定 */}
      <div
        className="
        card p-8 w-full transition-all duration-300 
        border-2 border-accent-400/20 dark:border-accent-600/20
        bg-gradient-to-br from-white/90 to-white/70
        dark:from-dark-100/90 dark:to-dark-100/70
        backdrop-blur-md relative z-10
      "
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-accent-600 dark:text-accent-400">
          <div
            className="
            flex items-center justify-center w-10 h-10 
            bg-accent-100 dark:bg-accent-900/30 
            rounded-xl shadow-md
          "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-accent-500"
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
          </div>
          タイマー設定
        </h2>

        <div className="flex flex-col gap-6">
          {/* 作業時間設定 */}
          <div
            className="
            bg-gradient-to-r from-secondary-50 to-secondary-100 
            dark:from-dark-200 dark:to-dark-200
            p-5 rounded-2xl shadow-md border border-secondary-200 dark:border-secondary-800/30
            transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1
          "
          >
            <label className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="
                  flex items-center justify-center w-10 h-10 
                  bg-secondary-500/20 dark:bg-secondary-500/10 
                  rounded-xl shadow-inner-soft
                "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-secondary-600 dark:text-secondary-400"
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
                </div>
                <div>
                  <p className="font-bold text-lg text-secondary-700 dark:text-secondary-300">
                    作業時間
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    集中して作業する時間を設定
                  </p>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={999}
                  value={workMinutes}
                  onChange={(e) => {
                    setWorkMinutes(Number(e.target.value));
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="
                    input-field w-24 text-center text-xl font-bold
                    bg-white dark:bg-dark-100 
                    border-2 border-secondary-300 dark:border-secondary-700
                    focus:border-secondary-500 dark:focus:border-secondary-500
                    text-secondary-700 dark:text-secondary-300
                    shadow-inner-soft
                  "
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                  分
                </span>
              </div>
            </label>
          </div>

          {/* 休憩時間設定 */}
          <div
            className="
            bg-gradient-to-r from-primary-50 to-primary-100 
            dark:from-dark-200 dark:to-dark-200
            p-5 rounded-2xl shadow-md border border-primary-200 dark:border-primary-800/30
            transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1
          "
          >
            <label className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="
                  flex items-center justify-center w-10 h-10 
                  bg-primary-500/20 dark:bg-primary-500/10 
                  rounded-xl shadow-inner-soft
                "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary-600 dark:text-primary-400"
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
                </div>
                <div>
                  <p className="font-bold text-lg text-primary-700 dark:text-primary-300">
                    休憩時間
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    リフレッシュする時間を設定
                  </p>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={999}
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Number(e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                  className="
                    input-field w-24 text-center text-xl font-bold
                    bg-white dark:bg-dark-100 
                    border-2 border-primary-300 dark:border-primary-700
                    focus:border-primary-500 dark:focus:border-primary-500
                    text-primary-700 dark:text-primary-300
                    shadow-inner-soft
                  "
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                  分
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* ヒント */}
        <div className="mt-6 p-4 bg-gray-100/70 dark:bg-dark-200/70 rounded-xl border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 flex-shrink-0 mt-0.5 text-accent-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              一般的なポモドーロテクニックでは、25分の作業と5分の休憩を推奨しています。あなたの集中力に合わせて調整してください。
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
