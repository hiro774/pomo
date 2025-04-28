"use client";

import React, { useMemo } from "react";
import YouTube from "react-youtube";
import { YouTubePlayerProps } from "./types";

// React.memoを使用して不要な再レンダリングを防止
const YouTubePlayer: React.FC<YouTubePlayerProps> = React.memo(
  ({
    videoId,
    playerSize,
    isWorkSession,
    startWorkMinutes,
    startRestMinutes,
    shouldAutoPlay,
    onReady,
    onStateChange,
  }) => {
    // optsをメモ化して不要な再計算を防止
    // Hooksは条件付きで呼び出せないため、常に呼び出す
    const opts = useMemo(
      () => ({
        width: String(playerSize.width),
        height: String(playerSize.height),
        playerVars: {
          autoplay: shouldAutoPlay ? 1 : 0,
          controls: 1,
          // 小数点以下を切り捨てて整数に変換（より安定した動作のため）
          start: Math.floor(
            isWorkSession ? startWorkMinutes : startRestMinutes
          ),
        },
      }),
      [
        playerSize.width,
        playerSize.height,
        shouldAutoPlay,
        isWorkSession,
        // 小数点以下を無視して整数部分だけ比較（細かい変更で再レンダリングしないように）
        Math.floor(startWorkMinutes),
        Math.floor(startRestMinutes),
      ]
    );

    // videoIdがない場合は何も表示しない
    if (!videoId) return null;

    return (
      <div className="mt-6 relative overflow-hidden rounded-lg shadow-md">
        <div
          className={`${typeof playerSize.width === "string" ? "w-full" : ""}`}
        >
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={onReady}
            onStateChange={onStateChange}
            className="w-full"
          />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // カスタム比較関数で、重要な変更がない場合は再レンダリングしない
    return (
      prevProps.videoId === nextProps.videoId &&
      prevProps.shouldAutoPlay === nextProps.shouldAutoPlay &&
      prevProps.isWorkSession === nextProps.isWorkSession &&
      // 小数点以下を無視して整数部分だけ比較
      Math.floor(prevProps.startWorkMinutes) ===
        Math.floor(nextProps.startWorkMinutes) &&
      Math.floor(prevProps.startRestMinutes) ===
        Math.floor(nextProps.startRestMinutes) &&
      prevProps.playerSize.width === nextProps.playerSize.width &&
      prevProps.playerSize.height === nextProps.playerSize.height
    );
  }
);

// コンポーネント名を設定（デバッグ用）
YouTubePlayer.displayName = "YouTubePlayer";

export default YouTubePlayer;
