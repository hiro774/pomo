"use client";

import React from "react";
import { PlayerHeaderProps } from "./types";

const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  isExpanded,
  toggleExpanded,
}) => {
  return (
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
          onClick={toggleExpanded}
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
  );
};

export default PlayerHeader;
