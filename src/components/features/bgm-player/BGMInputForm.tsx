"use client";

import React from "react";
import { BGMInputFormProps } from "./types";

const BGMInputForm: React.FC<BGMInputFormProps> = ({
  workUrl,
  setWorkUrl,
  restUrl,
  setRestUrl,
  setCurrentWorkTime,
  setCurrentRestTime,
}) => {
  return (
    <div className="flex flex-col gap-4">
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
                value={workUrl}
                onChange={(e) => {
                  setWorkUrl(String(e.target.value));
                  setCurrentWorkTime(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                placeholder="https://youtu.be/abc123..."
                className="w-full pl-9 pr-2 py-2.5 bg-white dark:bg-dark-100 border-2 border-secondary-300 dark:border-secondary-700 rounded-lg shadow-inner-soft focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 outline-none transition-all text-gray-700 dark:text-gray-200 text-sm"
              />
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
                onChange={(e) => {
                  setRestUrl(String(e.target.value));
                  setCurrentRestTime(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                placeholder="https://youtu.be/abc123..."
                className="w-full pl-9 pr-2 py-2.5 bg-white dark:bg-dark-100 border-2 border-primary-300 dark:border-primary-700 rounded-lg shadow-inner-soft focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-gray-700 dark:text-gray-200 text-sm"
              />
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default BGMInputForm;
