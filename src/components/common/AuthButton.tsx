"use client";

import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

export const AuthButton = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (session) {
    return (
      <button
        onClick={handleLogout}
        className="text-sm bg-red-500 text-white px-4 py-1 rounded absolute top-4 left-4"
      >
        ログアウト
      </button>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="text-sm bg-blue-500 text-white px-4 py-1 rounded absolute top-4 left-4"
    >
      Googleでログイン
    </button>
  );
};
