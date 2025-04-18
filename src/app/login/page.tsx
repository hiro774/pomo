"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function LoginPage() {
  const supabase = useSupabaseClient();
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/"); // ログイン済みならトップへ
    }
  }, [session, router]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <button
        onClick={handleLogin}
        className="bg-red-500 text-white px-6 py-3 rounded shadow"
      >
        Googleでログイン
      </button>
    </main>
  );
}
