"use client";

import YouTube from "react-youtube";
import { useState, useEffect, useRef } from "react";

function extractVideoId(url: string): string | null {
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}

type BGMPlayerProps = {
  videoUrl?: string;
};

export const BGMPlayer = ({ videoUrl = "" }: BGMPlayerProps) => {
  const [url, setUrl] = useState(videoUrl);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [width, setWidth] = useState(320);
  const [height, setHeight] = useState(180);
  const [audioOnly, setAudioOnly] = useState(false);
  const [volume, setVolume] = useState(30);
  const [isExpanded, setIsExpanded] = useState(false);
  const playerRef = useRef<any>(null);

  const opts = {
    width: audioOnly ? "0" : String(width),
    height: audioOnly ? "0" : String(height),
    playerVars: {
      autoplay: 1,
      controls: 1,
    },
  };

  // 初期URLから videoId を抽出して再生準備
  useEffect(() => {
    if (videoUrl) {
      const id = extractVideoId(videoUrl);
      if (id) {
        setVideoId(id);
        setIsPlaying(true);
      }
    }
  }, [videoUrl]);

  const onReady = (event: any) => {
    playerRef.current = event.target;
    event.target.setVolume(volume);
    if (!isPlaying) {
      event.target.pauseVideo();
    }
  };

  const togglePlay = () => {
    setIsPlaying((prev) => {
      const next = !prev;
      const player = playerRef.current;
      if (player) {
        next ? player.playVideo() : player.pauseVideo();
      }
      return next;
    });
  };

  const handleSetVideo = () => {
    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
      setIsPlaying(true);
    } else {
      alert("無効なYouTube URLです！");
    }
  };

  const setPresetSize = (size: "small" | "medium" | "large") => {
    if (size === "small") {
      setWidth(320);
      setHeight(180);
    } else if (size === "medium") {
      setWidth(480);
      setHeight(270);
    } else {
      setWidth(640);
      setHeight(360);
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
      className={`fixed bottom-4 left-4 z-30 bg-white/95 dark:bg-dark-100/95 backdrop-blur-md text-gray-800 dark:text-gray-100 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 max-w-md ${
        isExpanded ? "w-full sm:w-96" : "w-auto"
      }`}
    >
      {/* ヘッダー部分 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-secondary-500"
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
          <h3 className="font-medium">BGM Player</h3>
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

      {/* コントロール部分 - 展開時のみ表示 */}
      {isExpanded && (
        <div className="p-4">
          <div className="flex flex-col gap-3 mb-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-primary-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                YouTube URL
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtu.be/abc123..."
                  className="input-field text-sm flex-1"
                />
                <button
                  onClick={handleSetVideo}
                  className="btn-primary text-sm px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600"
                >
                  設定
                </button>
              </div>
            </label>

            {/* 再生コントロール */}
            <div className="flex items-center justify-between">
              <button
                onClick={togglePlay}
                disabled={!videoId}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  !videoId
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : isPlaying
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {isPlaying ? (
                  <>
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
                        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>停止</span>
                  </>
                ) : (
                  <>
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

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={audioOnly}
                  onChange={(e) => setAudioOnly(e.target.checked)}
                  className="rounded text-primary-500 focus:ring-primary-500"
                />
                <span>音声のみ</span>
              </label>
            </div>

            {/* 音量スライダー */}
            <div className="mt-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-secondary-500"
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
                  音量: {volume}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-secondary-500"
                />
              </label>
            </div>

            {/* サイズプリセット - 音声のみモードでない場合のみ表示 */}
            {!audioOnly && (
              <div className="mt-2">
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-medium">サイズ:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPresetSize("small")}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        width === 320
                          ? "bg-secondary-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      小
                    </button>
                    <button
                      onClick={() => setPresetSize("medium")}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        width === 480
                          ? "bg-secondary-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      中
                    </button>
                    <button
                      onClick={() => setPresetSize("large")}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        width === 640
                          ? "bg-secondary-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      大
                    </button>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* 動画プレイヤー（音声のみ時は非表示） */}
          {videoId && !audioOnly && (
            <div className="rounded-lg overflow-hidden bg-black">
              <YouTube videoId={videoId} opts={opts} onReady={onReady} />
            </div>
          )}
        </div>
      )}

      {/* 最小化時のミニコントロール */}
      {!isExpanded && videoId && (
        <div className="px-4 py-2 flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="p-1.5 rounded-full bg-gray-100 dark:bg-dark-200 hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors"
            aria-label={isPlaying ? "停止" : "再生"}
          >
            {isPlaying ? (
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
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
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

          <div className="flex-1 flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-secondary-500"
            />
            <span className="text-xs">{volume}</span>
          </div>
        </div>
      )}

      {/* 非表示プレーヤー（音声のみモード用） */}
      {videoId && audioOnly && (
        <div className="hidden">
          <YouTube videoId={videoId} opts={opts} onReady={onReady} />
        </div>
      )}
    </div>
  );
};
