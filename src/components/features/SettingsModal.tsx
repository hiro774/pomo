"use client";

import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Modal from "../common/Modal";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workMinutes: number;
  setWorkMinutes: (value: number) => void;
  breakMinutes: number;
  setBreakMinutes: (value: number) => void;
  videoUrl: string;
  setVideoUrl: (value: string) => void;
  restVideoUrl: string;
  setRestVideoUrl: (value: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  workMinutes,
  setWorkMinutes,
  breakMinutes,
  setBreakMinutes,
  videoUrl,
  setVideoUrl,
  restVideoUrl,
  setRestVideoUrl,
}) => {
  const session = useSession();
  const supabase = useSupabaseClient();

  const [localWorkMinutes, setLocalWorkMinutes] = useState(workMinutes);
  const [localBreakMinutes, setLocalBreakMinutes] = useState(breakMinutes);
  const [localVideoUrl, setLocalVideoUrl] = useState(videoUrl);
  const [isLoaded, setIsLoaded] = useState(false);

  // 入力フィールド用の文字列ステート
  const [workInput, setWorkInput] = useState(localWorkMinutes.toString());
  const [breakInput, setBreakInput] = useState(localBreakMinutes.toString());

  const [localRestVideoUrl, setLocalRestVideoUrl] = useState("");

  // 設定の読み込み
  useEffect(() => {
    const fetchSettings = async () => {
      // ローディング開始時間を記録
      const startTime = Date.now();

      if (!session) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 500 - elapsedTime);

        setTimeout(() => {
          setIsLoaded(true);
        }, remainingTime);
        return;
      }

      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) {
        console.log("fetchするよ");
        console.log(data);
        setLocalWorkMinutes(data.work_minutes ?? workMinutes);
        setLocalBreakMinutes(data.break_minutes ?? breakMinutes);
        setLocalVideoUrl(data.video_url ?? "");
        setLocalRestVideoUrl(data.rest_video_url ?? "");
      }

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 500 - elapsedTime);
      setTimeout(() => {
        setIsLoaded(true);
      }, remainingTime);
    };

    if (isOpen) {
      console.log("生きてる？");
      setIsLoaded(false); // モーダルが開かれるたびにローディング状態にリセット
      // setLocalWorkMinutes(workMinutes);
      // setLocalBreakMinutes(breakMinutes);
      // setWorkInput(workMinutes.toString());
      // setBreakInput(breakMinutes.toString());
      // setLocalVideoUrl(videoUrl);
      // setLocalRestVideoUrl(restVideoUrl);
      fetchSettings();
    }
  }, [
    isOpen,
    session,
    supabase,
    workMinutes,
    breakMinutes,
    videoUrl,
    restVideoUrl,
  ]);

  // 入力値の検証と更新
  const handleWorkChange = (value: string) => {
    setWorkInput(value);

    // 空文字列でない場合のみ値を更新
    if (value !== "") {
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 999) {
        setLocalWorkMinutes(numValue);
      }
    }
  };

  const handleBreakChange = (value: string) => {
    setBreakInput(value);

    // 空文字列でない場合のみ値を更新
    if (value !== "") {
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue >= 0 && numValue <= 999) {
        setLocalBreakMinutes(numValue);
      }
    }
  };

  // フォーカスが外れた時に空の場合は0に設定
  const handleBlur = (
    value: string,
    setter: (value: number) => void,
    inputSetter: (value: string) => void
  ) => {
    if (value === "") {
      setter(0);
      inputSetter("0");
    }
  };

  const handleSave = async () => {
    // 親コンポーネントの状態を更新
    setWorkMinutes(localWorkMinutes);
    setBreakMinutes(localBreakMinutes);
    setVideoUrl(localVideoUrl);
    setRestVideoUrl(localRestVideoUrl);

    // Supabaseに保存（ログインしている場合）
    if (session) {
      const { error } = await supabase.from("settings").upsert({
        id: session.user.id,
        work_minutes: localWorkMinutes,
        break_minutes: localBreakMinutes,
        video_url: localVideoUrl,
        rest_video_url: localRestVideoUrl,
        updated_at: new Date().toISOString(),
      });

      if (!error) {
        toast.success("保存しました！");
      } else {
        toast.error("保存に失敗しました…");
      }
    }

    onClose();
  };

  if (!isLoaded && isOpen) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse-slow flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 animate-spin opacity-70"></div>
            <p className="mt-4 ml-2 text-md font-medium text-gray-600 dark:text-gray-300">
              loading...
            </p>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            設定
          </span>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* 作業時間設定 */}
        <div
          className="bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-dark-200/50 dark:to-dark-200/80 
        p-5 rounded-xl shadow-md border border-secondary-200 dark:border-secondary-800/30
         transform transition-all duration-300 hover:shadow-lg hover:-translate-y-0.3"
        >
          <label className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-secondary-500/20 dark:bg-secondary-500/10 rounded-xl shadow-inner-soft">
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
                {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                  集中して作業する時間を設定
                </p> */}
              </div>
            </div>
            <div className="relative mt-1">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={workInput}
                onChange={(e) => handleWorkChange(e.target.value)}
                onBlur={() =>
                  handleBlur(workInput, setLocalWorkMinutes, setWorkInput)
                }
                className="w-full px-4 py-3 text-center text-xl font-bold bg-white dark:bg-dark-100 border-2 border-secondary-300 dark:border-secondary-700 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 outline-none transition-all shadow-inner-soft"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                分
              </span>
            </div>
          </label>
        </div>

        {/* 休憩時間設定 */}
        <div
          className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-dark-200/50 dark:to-dark-200/80
         p-5 rounded-xl shadow-md border border-primary-200 dark:border-primary-800/30
          transform transition-all duration-300 hover:shadow-lg hover:-translate-y-0.3"
        >
          <label className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-500/20 dark:bg-primary-500/10 rounded-xl shadow-inner-soft">
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
                {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                  リフレッシュする時間を設定
                </p> */}
              </div>
            </div>
            <div className="relative mt-1">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={breakInput}
                onChange={(e) => handleBreakChange(e.target.value)}
                onBlur={() =>
                  handleBlur(breakInput, setLocalBreakMinutes, setBreakInput)
                }
                className="w-full px-4 py-3 text-center text-xl font-bold bg-white dark:bg-dark-100 border-2 border-primary-300 dark:border-primary-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-inner-soft"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                分
              </span>
            </div>
          </label>
        </div>

        {/* YouTube URL（作業中）入力フィールド - 新デザイン */}
        <div
          className="bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-dark-200/50 dark:to-dark-200/80
         p-5 rounded-xl shadow-md border border-secondary-200 dark:border-secondary-800/30
          transform transition-all duration-300 hover:shadow-lg hover:-translate-y-0.3 overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-secondary-400/10 dark:bg-secondary-600/10 rounded-full blur-xl"></div>
          <label className="flex flex-col gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
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
                </svg>
              </div>
              <div>
                <p className="font-bold text-lg text-secondary-700 dark:text-secondary-300">
                  作業中のBGM
                </p>
                {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                  集中力を高める音楽のURLを入力
                </p> */}
              </div>
            </div>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </div>
              <input
                type="text"
                value={localVideoUrl}
                onChange={(e) => setLocalVideoUrl(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-100 border-2 border-secondary-300 dark:border-secondary-700 rounded-lg shadow-inner-soft focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 outline-none transition-all text-gray-700 dark:text-gray-200"
                placeholder="https://youtu.be/abc123..."
              />
            </div>
          </label>
        </div>

        {/* YouTube URL（休憩中）入力フィールド - 新デザイン */}
        <div
          className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-dark-200/50 dark:to-dark-200/80
         p-5 rounded-xl shadow-md border border-primary-200 dark:border-primary-800/30
          transform transition-all duration-300 hover:shadow-lg hover:-translate-y-0.3 overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary-400/10 dark:bg-primary-600/10 rounded-full blur-xl"></div>
          <label className="flex flex-col gap-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
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
                  休憩中のBGM
                </p>
                {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                  リラックスできる音楽のURLを入力
                </p> */}
              </div>
            </div>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </div>
              <input
                type="text"
                value={localRestVideoUrl}
                onChange={(e) => setLocalRestVideoUrl(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-100 border-2 border-primary-300 dark:border-primary-700 rounded-lg shadow-inner-soft focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-700 dark:text-gray-200"
                placeholder="https://youtu.be/abc123..."
              />
            </div>
          </label>
        </div>

        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 mt-2"
        >
          <div className="flex items-center justify-center gap-2">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            保存
          </div>
        </button>
      </div>
    </Modal>
  );
};

export default SettingsModal;
