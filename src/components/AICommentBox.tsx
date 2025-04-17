// components/features/AICommentBox.tsx
"use client";

type Props = {
  message: string;
  imageUrl: string; // キャラ画像URLを渡す
};

export const AICommentBox = ({ message, imageUrl }: Props) => {
  return (
    <div className="fixed top-4 right-4 flex items-start gap-2 bg-white/90 dark:bg-gray-800 text-black dark:text-white px-4 py-3 rounded-xl shadow-lg max-w-xs">
      <img
        src={imageUrl}
        alt="AIキャラ"
        className="w-10 h-10 rounded-full object-cover border border-gray-300"
      />
      <div className="text-sm leading-snug">
        <p>
          🤖 <span>{message}</span>
        </p>
      </div>
    </div>
  );
};
