"use client";

import { Toaster } from "react-hot-toast";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="ポモドーロタイマーアプリ - 作業と休憩を効率的に管理"
        />
        <link
          rel="icon"
          href="/images/pomo.png"
          type="image/png"
          sizes="512x512"
        />
        <title>Pomo - ポモドーロタイマー</title>
      </head>
      <body className="antialiased min-h-screen bg-light-100 dark:bg-dark-200 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        <SessionContextProvider supabaseClient={supabase}>
          <div className="relative">
            {/* 背景デザイン要素 */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/20 dark:bg-primary-900/10 rounded-full blur-3xl"></div>
              <div className="absolute top-1/3 -left-40 w-96 h-96 bg-secondary-200/20 dark:bg-secondary-900/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-accent-200/20 dark:bg-accent-900/10 rounded-full blur-3xl"></div>
            </div>

            {/* メインコンテンツ */}
            <main className="relative z-10">
              <Toaster position="top-right" />
              {children}
            </main>
          </div>
        </SessionContextProvider>
      </body>
    </html>
  );
}
