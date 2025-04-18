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

      if (!session) {
        setIsLoaded(true);
        return;
      }
      console.log("設定が読み込まれたよ");

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

      setIsLoaded(true);
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
