"use client";

import YouTube from "react-youtube";
import { useState, useRef } from "react";

function extractVideoId(url: string): string | null {
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : null;
}

export const BGMPlayer = () => {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [width, setWidth] = useState(480);
  const [height, setHeight] = useState(270);
  const [audioOnly, setAudioOnly] = useState(false);
  const [volume, setVolume] = useState(30);
  const playerRef = useRef<any>(null);

  const opts = {
    width: audioOnly ? "0" : String(width),
    height: audioOnly ? "0" : String(height),
    playerVars: {
      autoplay: 1,
      controls: 1,
    },
  };

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
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 text-black dark:text-white rounded px-4 py-3 shadow max-w-full">
      <div className="flex flex-col gap-2 mb-4">
        <label className="font-semibold">YouTube動画URL:</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtu.be/abc123..."
          className="border px-2 py-1 rounded text-sm dark:bg-gray-700 dark:border-gray-600"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSetVideo}
            className="bg-indigo-500 text-white px-3 py-1 rounded"
          >
            Set
          </button>
          <button
            onClick={togglePlay}
            className="bg-gray-500 text-white px-3 py-1 rounded"
            disabled={!videoId}
          >
            {isPlaying ? "Stop" : "Play"}
          </button>
        </div>
      </div>

      {/* サイズプリセットと音声モード */}
      <div className="flex gap-4 flex-wrap items-center mb-4">
        <div className="flex gap-2">
          <span className="font-semibold">サイズ:</span>
          <button
            onClick={() => setPresetSize("small")}
            className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm"
          >
            小
          </button>
          <button
            onClick={() => setPresetSize("medium")}
            className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm"
          >
            中
          </button>
          <button
            onClick={() => setPresetSize("large")}
            className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm"
          >
            大
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={audioOnly}
            onChange={(e) => setAudioOnly(e.target.checked)}
          />
          音声のみ
        </label>
      </div>

      {/* 音量スライダー */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm">
          音量:
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-48"
          />
          <span>{volume}</span>
        </label>
      </div>

      {/* 動画プレイヤー（音声のみ時は非表示） */}
      {videoId && (
        <div>
          <YouTube videoId={videoId} opts={opts} onReady={onReady} />
        </div>
      )}
    </div>
  );
};
