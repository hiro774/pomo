"use client";

import React from "react";
import { MiniControlsProps } from "./types";

const MiniControls: React.FC<MiniControlsProps> = ({
  videoId,
  isPlaying,
  togglePlay,
  volume,
  onVolumeChange,
}) => {
  if (!videoId) return null;

  return (
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
          onChange={onVolumeChange}
          className="w-full sm:w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-accent-500"
        />
        <span className="text-xs whitespace-nowrap">{volume}</span>
      </div>
    </div>
  );
};

export default MiniControls;
