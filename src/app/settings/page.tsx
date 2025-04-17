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
  const [volume, setVolume] = useState(30);
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
        setVolume(data.volume ?? 30);
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
      volume: volume,
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
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">設定</h1>
      <div className="flex flex-col gap-4">
        <label>
          作業時間（分）:
          <input
            type="number"
            value={workMinutes}
            min={1}
            onChange={(e) => setWorkMinutes(Number(e.target.value))}
            className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
          />
        </label>

        <label>
          休憩時間（分）:
          <input
            type="number"
            value={breakMinutes}
            min={1}
            onChange={(e) => setBreakMinutes(Number(e.target.value))}
            className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
          />
        </label>

        <label>
          音量（0〜100）:
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full"
          />
          <span className="ml-2">{volume}</span>
        </label>

        <label>
          YouTube動画URL:
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="w-full px-2 py-1 border rounded dark:bg-gray-800 dark:border-gray-600"
          />
        </label>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          保存
        </button>
      </div>
    </main>
  );
}
