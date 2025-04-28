"use client";

import { YouTubePlayer } from "react-youtube";

// グローバルYouTube APIの型定義
declare global {
  interface Window {
    YT: {
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
  }
}

// YouTube動画IDを抽出する関数
export function extractVideoId(url: string): string | null {
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}

// プレーヤーサイズを取得する関数
export function getPlayerSize() {
  if (typeof window !== "undefined") {
    const screenWidth = window.innerWidth;
    if (screenWidth < 480) {
      // モバイル（小）
      return { width: "100%", height: 120 };
    } else if (screenWidth < 640) {
      // モバイル（大）
      return { width: "100%", height: "auto" };
    }
  }
  return { width: 320, height: 180 }; // デスクトップサイズ
}

// BGMPlayerのプロパティ
export interface BGMPlayerProps {
  videoUrl?: string;
  restVideoUrl?: string;
  isWorkSession: boolean;
}

// YouTubePlayerのプロパティ
export interface YouTubePlayerProps {
  videoId: string | null;
  playerSize: { width: string | number; height: string | number };
  isWorkSession: boolean;
  startWorkMinutes: number;
  startRestMinutes: number;
  shouldAutoPlay: boolean;
  onReady: (event: { target: YouTubePlayer }) => void;
  onStateChange: (event: { data: number; target: YouTubePlayer }) => void;
}

// BGM入力フォームのプロパティ
export interface BGMInputFormProps {
  workUrl: string;
  setWorkUrl: (url: string) => void;
  restUrl: string;
  setRestUrl: (url: string) => void;
  setCurrentWorkTime: (time: number) => void;
  setCurrentRestTime: (time: number) => void;
}

// プレーヤーコントロールのプロパティ
export interface PlayerControlsProps {
  videoId: string | null;
  isPlaying: boolean;
  togglePlay: () => void;
  volume: number;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// プレーヤーヘッダーのプロパティ
export interface PlayerHeaderProps {
  isExpanded: boolean;
  toggleExpanded: () => void;
}

// ミニコントロールのプロパティ
export interface MiniControlsProps {
  videoId: string | null;
  isPlaying: boolean;
  togglePlay: () => void;
  volume: number;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
