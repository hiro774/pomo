"use client";

import YouTube, { YouTubePlayer } from "react-youtube";
import { useState, useEffect, useRef } from "react";

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

function extractVideoId(url: string): string | null {
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}

type BGMPlayerProps = {
  videoUrl?: string;
  restVideoUrl?: string;
  isWorkSession: boolean;
};

export const BGMPlayer = ({
  videoUrl,
  restVideoUrl,
  isWorkSession,
}: BGMPlayerProps) => {
  const [url, setUrl] = useState(videoUrl ?? "");
  const [restUrl, setResrUrl] = useState(restVideoUrl ?? "");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isExpanded, setIsExpanded] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);

  // レスポンシブ対応のためのサイズ設定
  const getPlayerSize = () => {
    // 画面幅に応じてプレイヤーサイズを調整
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
  };

  const [playerSize, setPlayerSize] = useState(getPlayerSize());

  // 画面サイズ変更時にプレイヤーサイズを更新
  useEffect(() => {
    const handleResize = () => {
      setPlayerSize(getPlayerSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const opts = {
    width: String(playerSize.width),
    height: String(playerSize.height),
    playerVars: {
      autoplay: 1,
      controls: 1,
    },
  };

  // videoUrlが変更されたらurlも更新
  useEffect(() => {
    setUrl(videoUrl ?? "");
  }, [videoUrl]);

  useEffect(() => {
    setResrUrl(restVideoUrl ?? "");
  }, [restVideoUrl]);

  // 初期URLから videoId を抽出して再生準備
  useEffect(() => {
    if (videoUrl) {
      const id = extractVideoId(videoUrl);
      if (id) {
        setVideoId(id);
        setIsPlaying(false);
      }
    }
  }, [videoUrl]);

  // ワークセッションが変更されたらyoutubeの動画も変更
  useEffect(() => {
    if (!isPlaying) return;
    const id = isWorkSession ? extractVideoId(url) : extractVideoId(restUrl);
    if (id) {
      setVideoId(id);
    }
  }, [isWorkSession, isPlaying, url, restUrl]);

  const onReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    event.target.setVolume(volume);
    if (!isPlaying) {
      event.target.pauseVideo();
    }
  };

  const onStateChange = (event: { data: number }) => {
    const YT = window.YT;
    if (!YT) return;

    switch (event.data) {
      case YT.PlayerState.PLAYING:
        setIsPlaying(true);
        break;
      case YT.PlayerState.PAUSED:
      case YT.PlayerState.ENDED:
        setIsPlaying(false);
        break;
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => {
      const next = !prev;
      const player = playerRef.current;
      if (player) {
        if (next) {
          player.playVideo();
        } else {
          player.pauseVideo();
        }
      }
      return next;
    });
  };

  const handleSetVideo = (paramUrl: string) => {
    const id = extractVideoId(paramUrl);
    if (id) {
      setVideoId(id);
      // setIsPlaying(true);
    } else {
      alert("無効なYouTube URLです！");
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
  };

  return (
    <div
      className={`fixed z-30 bg-white/95 dark:bg-dark-100/95 backdrop-blur-md text-gray-800 dark:text-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 
        ${isExpanded ? "w-full sm:w-96" : "w-auto sm:w-auto"}
        bottom-0 left-0 right-0 sm:bottom-4 sm:left-4 sm:right-auto rounded-t-xl sm:rounded-xl border border-gray-200 dark:border-gray-700/50`}
    >
      {/* ヘッダー部分 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-secondary-500"
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
          <h3 className="font-bold text-base ml-2 mr-3">BGM Player</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200 transition-colors"
            aria-label={isExpanded ? "プレーヤーを最小化" : "プレーヤーを展開"}
          >
            {isExpanded ? (
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
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
                  d="M5 15l7-7 7 7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* コントロール部分 - 展開時のみ表示、非表示時もDOMに存在 */}
      <div className={`p-5 ${isExpanded ? "block" : "hidden"}`}>
        <div className="flex flex-col gap-4 mb-4">
          {/* 作業中BGM入力フィールド */}
          <div className="bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-dark-200/50 dark:to-dark-200/80 p-4 rounded-xl shadow-md border border-secondary-200 dark:border-secondary-800/30 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-secondary-400/10 dark:bg-secondary-600/10 rounded-full blur-xl"></div>
            <label className="flex flex-col gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-secondary-700 dark:text-secondary-300">
                    作業中のBGM
                  </p>
                </div>
              </div>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-red-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(String(e.target.value))}
                    placeholder="https://youtu.be/abc123..."
                    className="w-full pl-9 pr-2 py-2.5 bg-white dark:bg-dark-100 border-2 border-secondary-300 dark:border-secondary-700 rounded-lg shadow-inner-soft focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 outline-none transition-all text-gray-700 dark:text-gray-200 text-sm"
                  />
                  <div className="hidden">
                    <button
                      onClick={() => handleSetVideo(url)}
                      className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                      設定
                    </button>
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* 休憩中BGM入力フィールド */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-dark-200/50 dark:to-dark-200/80 p-4 rounded-xl shadow-md border border-primary-200 dark:border-primary-800/30 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary-400/10 dark:bg-primary-600/10 rounded-full blur-xl"></div>
            <label className="flex flex-col gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
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
                </div>
                <div>
                  <p className="font-bold text-primary-700 dark:text-primary-300">
                    休憩中のBGM
                  </p>
                  {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                    リラックスできる音楽のURLを入力
                  </p> */}
                </div>
              </div>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={restUrl}
                    onChange={(e) => setResrUrl(String(e.target.value))}
                    placeholder="https://youtu.be/abc123..."
                    className="w-full pl-9 pr-2 py-2.5 bg-white dark:bg-dark-100 border-2 border-primary-300 dark:border-primary-700 rounded-lg shadow-inner-soft focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-700 dark:text-gray-200 text-sm"
                  />
                  <div className="hidden">
                    <button
                      onClick={() => handleSetVideo(restUrl)}
                      className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                    >
                      設定
                    </button>
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* 再生コントロールと音量スライダー */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-dark-200/50 dark:to-dark-200/80 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700/30 transform transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-shrink-0">
                <button
                  onClick={togglePlay}
                  disabled={!videoId}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                    !videoId
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : isPlaying
                      ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                      : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  }`}
                >
                  {isPlaying ? (
                    <>
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
                          d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>停止</span>
                    </>
                  ) : (
                    <>
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
                          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>再生</span>
                    </>
                  )}
                </button>
              </div>
              <div className="flex-1">
                <label className="flex flex-col gap-1.5 w-full">
                  <span className="text-sm font-medium flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-accent-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
                    </svg>
                    <span>音量: {volume}</span>
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-accent-500"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 動画プレイヤー（音声のみ時は非表示） */}
        <div className="mt-6 relative overflow-hidden rounded-lg shadow-md">
          <div
            className={`${
              typeof playerSize.width === "string" ? "w-full" : ""
            }`}
          >
            {videoId && (
              <YouTube
                videoId={videoId}
                opts={opts}
                onReady={onReady}
                onStateChange={onStateChange}
                className="w-full"
              />
            )}
          </div>
        </div>
      </div>

      {/* 最小化時のミニコントロール */}
      {!isExpanded && videoId && (
        <div className="px-4 py-2 flex items-center gap-3 justify-between sm:justify-start border-t border-gray-200 dark:border-gray-700/50">
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-dark-200 hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors shadow-sm border border-gray-200 dark:border-gray-700/50"
            aria-label={isPlaying ? "停止" : "再生"}
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </button>

          <div className="flex-1 flex items-center gap-2 max-w-[200px] sm:max-w-none">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full sm:w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-accent-500"
            />
            <span className="text-xs whitespace-nowrap">{volume}</span>
          </div>
        </div>
      )}
    </div>
  );
};
