import { useState, useEffect, useRef } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import useTheme from "./useTheme";

const useSettings = () => {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const settingsLoadedRef = useRef(false);

  const { isDark, toggleTheme } = useTheme();
  const supabase = useSupabaseClient();
  const session = useSession();

  useEffect(() => {
    const fetchSettings = async () => {
      // すでに設定を読み込んでいる場合は再読み込みしない
      if (settingsLoadedRef.current) {
        return;
      }

      // ローディング開始時間を記録
      const startTime = Date.now();

      if (!session) {
        // 最低1秒間のローディングを確保
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
        setWorkMinutes(data.work_minutes ?? 25);
        setBreakMinutes(data.break_minutes ?? 5);
        setVideoUrl(data.video_url ?? "");
      }

      const elapsed = Date.now() - startTime;
      const wait = Math.max(0, 500 - elapsed);
      setTimeout(() => setIsLoaded(true), wait);

      settingsLoadedRef.current = true;
    };

    fetchSettings();
  }, [session, supabase]);

  return {
    workMinutes,
    setWorkMinutes,
    breakMinutes,
    setBreakMinutes,
    videoUrl,
    setVideoUrl,
    isLoaded,
    isDark,
    toggleTheme,
    session,
  };
};

export default useSettings;
