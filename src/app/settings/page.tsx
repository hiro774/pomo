"use client";

import { useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  // const [volume, setVolume] = useState(30);
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!session) return;

      const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setWorkMinutes(data.work_minutes ?? 25);
        setBreakMinutes(data.break_minutes ?? 5);
        // setVolume(data.volume ?? 30);
        setVideoUrl(data.video_url ?? "");
      }

      setIsLoaded(true);
    };

    fetchSettings();
  }, [session]);

  const handleSave = async () => {
    if (!session) return;

    const { error } = await supabase.from("settings").upsert({
      id: session.user.id,
      work_minutes: workMinutes,
      break_minutes: breakMinutes,
      // volume: volume,
      video_url: videoUrl,
      updated_at: new Date().toISOString(),
    });

    if (!error) {
      alert("保存しました！");
      router.push("/"); // 保存後トップに戻る or stay
    } else {
      alert("保存に失敗しました");
    }
  };

  if (!isLoaded) return <main className="p-6">読み込み中...</main>;

  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="mb-6 text-sm bg-opacity-80 backdrop-blur-sm bg-gray-200 dark:bg-gray-800 px-3 py-1.5 rounded-full text-black dark:text-white hover:shadow-md transition-all flex items-center gap-1"
        >
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          ホームに戻る
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
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
            ポモドーロ設定
          </h1>

          <div className="flex flex-col gap-5">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <label className="flex flex-col gap-2">
                <span className="font-medium flex items-center gap-1">
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
                  value={workMinutes}
                  min={1}
                  onChange={(e) => setWorkMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
              </label>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <label className="flex flex-col gap-2">
                <span className="font-medium flex items-center gap-1">
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
                  value={breakMinutes}
                  min={1}
                  onChange={(e) => setBreakMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                />
              </label>
            </div>

            {/* <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <label className="flex flex-col gap-2">
                <span className="font-medium flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 010-7.072m12.728 0l-3.536 3.536m-12.728 0l3.536-3.536"
                    />
                  </svg>
                  音量（0〜100）:
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                  <span className="text-lg font-semibold bg-white dark:bg-gray-800 px-2 py-1 rounded-md min-w-[40px] text-center">
                    {volume}
                  </span>
                </div>
              </label>
            </div> */}

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <label className="flex flex-col gap-2">
                <span className="font-medium flex items-center gap-1">
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
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
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
        </div>
      </div>
    </main>
  );
}
