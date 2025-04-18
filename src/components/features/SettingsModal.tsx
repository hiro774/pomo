"use client";

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
}) => {
  const session = useSession();
  const supabase = useSupabaseClient();

  const [localWorkMinutes, setLocalWorkMinutes] = useState(workMinutes);
  const [localBreakMinutes, setLocalBreakMinutes] = useState(breakMinutes);
  const [localVideoUrl, setLocalVideoUrl] = useState(videoUrl);
  const [isLoaded, setIsLoaded] = useState(false);

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
        setLocalWorkMinutes(data.work_minutes ?? workMinutes);
        setLocalBreakMinutes(data.break_minutes ?? breakMinutes);
        setLocalVideoUrl(data.video_url ?? "");
      }

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 500 - elapsedTime);
      setTimeout(() => {
        setIsLoaded(true);
      }, remainingTime);
    };

    if (isOpen) {
      setIsLoaded(false); // モーダルが開かれるたびにローディング状態にリセット
      setLocalWorkMinutes(workMinutes);
      setLocalBreakMinutes(breakMinutes);
      setLocalVideoUrl(videoUrl);
      fetchSettings();
    }
  }, [isOpen, session, supabase, workMinutes, breakMinutes, videoUrl]);

  const handleSave = async () => {
    // 親コンポーネントの状態を更新
    setWorkMinutes(localWorkMinutes);
    setBreakMinutes(localBreakMinutes);
    setVideoUrl(localVideoUrl);

    // Supabaseに保存（ログインしている場合）
    if (session) {
      const { error } = await supabase.from("settings").upsert({
        id: session.user.id,
        work_minutes: localWorkMinutes,
        break_minutes: localBreakMinutes,
        video_url: localVideoUrl,
        updated_at: new Date().toISOString(),
      });

      if (!error) {
        alert("保存しました！");
      } else {
        alert("保存に失敗しました");
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
            <p className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-300">
              読み込み中...
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
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-orange-500"
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
          基本設定
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <label className="flex flex-col gap-2">
            <span className="font-medium flex items-center gap-1 text-sm sm:text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-red-500"
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
              作業時間（分）:
            </span>
            <input
              type="number"
              value={localWorkMinutes}
              min={1}
              onChange={(e) => setLocalWorkMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            />
          </label>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <label className="flex flex-col gap-2">
            <span className="font-medium flex items-center gap-1 text-sm sm:text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-500"
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
              休憩時間（分）:
            </span>
            <input
              type="number"
              value={localBreakMinutes}
              min={1}
              onChange={(e) => setLocalBreakMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            />
          </label>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <label className="flex flex-col gap-2">
            <span className="font-medium flex items-center gap-1 text-sm sm:text-base">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-purple-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              YouTube動画URL:
            </span>
            <input
              type="text"
              value={localVideoUrl}
              onChange={(e) => setLocalVideoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              placeholder="https://youtu.be/abc123..."
            />
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
