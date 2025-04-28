"use client";

import { useState, useEffect, useRef } from "react";
import { YouTubePlayer } from "react-youtube";
import { BGMPlayerProps, extractVideoId, getPlayerSize } from "./types";
import YouTubePlayerComponent from "./YouTubePlayer";
import BGMInputForm from "./BGMInputForm";
import PlayerControls from "./PlayerControls";
import PlayerHeader from "./PlayerHeader";
import MiniControls from "./MiniControls";

export const BGMPlayer = ({
  videoUrl,
  restVideoUrl,
  isWorkSession,
}: BGMPlayerProps) => {
  // URL状態
  const [url, setUrl] = useState(videoUrl ?? "");
  const [restUrl, setRestUrl] = useState(restVideoUrl ?? "");

  // プレーヤー状態
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  // 再生時間管理
  const [currentWorkTime, setCurrentWorkTime] = useState(0);
  const [currentRestTime, setCurrentRestTime] = useState(0);
  const [startWorkMinutes, setStartWorkMinutes] = useState(0);
  const [startRestMinutes, setStartRestMinutes] = useState(0);

  // プレーヤー参照
  const playerRef = useRef<YouTubePlayer | null>(null);

  // レスポンシブ対応
  const [playerSize, setPlayerSize] = useState(getPlayerSize());

  // 作業/休憩セッション切り替え時の時間記録
  // isWorkSessionが変わったときだけ実行するように修正
  useEffect(() => {
    if (isWorkSession) {
      setStartWorkMinutes(currentWorkTime);
    } else {
      setStartRestMinutes(currentRestTime);
    }
    // 依存配列からcurrentWorkTimeとcurrentRestTimeを削除
  }, [isWorkSession]);

  // playerRefが更新されたことを追跡するための状態
  const [playerReady, setPlayerReady] = useState(false);

  // onReadyハンドラを拡張して、playerRefが設定されたことを追跡
  const handlePlayerReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    event.target.setVolume(volume);
    if (!isPlaying) {
      event.target.pauseVideo();
    }
    // playerRefが設定されたことを記録
    setPlayerReady(true);
  };

  // 経過時間の記録
  // playerReadyとisWorkSessionが変わったときに再設定
  useEffect(() => {
    // playerRefが存在しない場合は何もしない
    if (!playerRef.current || !playerReady) return;

    // 現在の再生時間を取得するための変数
    let isMounted = true;

    // 1秒ごとに実行するinterval
    const interval = setInterval(() => {
      // コンポーネントがアンマウントされていないか確認
      if (isMounted && playerRef.current) {
        try {
          const time = playerRef.current.getCurrentTime();
          // 状態更新を最小限に抑える
          if (isWorkSession) {
            // 前回の値と大きく異なる場合のみ更新
            setCurrentWorkTime((prevTime) => {
              return Math.abs(prevTime - time) > 0.5 ? time : prevTime;
            });
          } else {
            setCurrentRestTime((prevTime) => {
              return Math.abs(prevTime - time) > 0.5 ? time : prevTime;
            });
          }
        } catch (error) {
          // YouTube APIのエラーを無視
          console.error("YouTube API error:", error);
        }
      }
    }, 1000);

    // クリーンアップ関数
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isWorkSession, playerReady]);

  // 画面サイズ変更時にプレーヤーサイズを更新
  useEffect(() => {
    const handleResize = () => {
      setPlayerSize(getPlayerSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // videoUrlが変更されたらurlも更新
  useEffect(() => {
    if (videoUrl !== undefined) {
      setUrl(videoUrl);
      setCurrentWorkTime(0);
    }
  }, [videoUrl]);

  useEffect(() => {
    if (restVideoUrl !== undefined) {
      setRestUrl(restVideoUrl);
      setCurrentRestTime(0);
    }
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
  // メモ化して不要な再レンダリングを防止
  useEffect(() => {
    // 現在のセッションに基づいて適切なURLを選択
    const currentUrl = isWorkSession ? url : restUrl;
    // URLからビデオIDを抽出
    const id = extractVideoId(currentUrl);

    // 前回と同じIDなら更新しない（不要な再レンダリングを防止）
    if (id && id !== videoId) {
      // 再生状態に基づいて自動再生を設定
      setShouldAutoPlay(isPlaying);
      // ビデオIDを更新
      setVideoId(id);
    }
  }, [isWorkSession, url, restUrl, videoId, isPlaying]);

  const onStateChange = (event: { data: number; target: YouTubePlayer }) => {
    const YT = window.YT;
    if (!YT) return;

    switch (event.data) {
      case YT.PlayerState.ENDED:
        event.target.playVideo();
        break;
      case YT.PlayerState.PLAYING:
        setIsPlaying(true);
        break;
      case YT.PlayerState.PAUSED:
        setIsPlaying(false);
        break;
    }
  };

  // 再生/停止の切り替え
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

  // 音量変更ハンドラ
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
  };

  // 展開/折りたたみの切り替え
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`fixed z-30 bg-white/95 dark:bg-dark-100/95 backdrop-blur-md text-gray-800 dark:text-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 
        ${isExpanded ? "w-full sm:w-96" : "w-auto sm:w-auto"}
        bottom-0 left-0 right-0 sm:bottom-4 sm:left-4 sm:right-auto rounded-t-xl sm:rounded-xl border border-gray-200 dark:border-gray-700/50`}
    >
      {/* ヘッダー部分 */}
      <PlayerHeader isExpanded={isExpanded} toggleExpanded={toggleExpanded} />

      {/* コントロール部分 - 展開時のみ表示 */}
      <div className={`p-5 ${isExpanded ? "block" : "hidden"}`}>
        <div className="flex flex-col gap-4 mb-4">
          {/* BGM入力フォーム */}
          <BGMInputForm
            workUrl={url}
            setWorkUrl={setUrl}
            restUrl={restUrl}
            setRestUrl={setRestUrl}
            setCurrentWorkTime={setCurrentWorkTime}
            setCurrentRestTime={setCurrentRestTime}
          />

          {/* 再生コントロールと音量スライダー */}
          <PlayerControls
            videoId={videoId}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            volume={volume}
            onVolumeChange={handleVolumeChange}
          />
        </div>

        {/* YouTube プレーヤー */}
        <YouTubePlayerComponent
          videoId={videoId}
          playerSize={playerSize}
          isWorkSession={isWorkSession}
          startWorkMinutes={startWorkMinutes}
          startRestMinutes={startRestMinutes}
          shouldAutoPlay={shouldAutoPlay}
          onReady={handlePlayerReady}
          onStateChange={onStateChange}
        />
      </div>

      {/* 最小化時のミニコントロール */}
      {!isExpanded && (
        <MiniControls
          videoId={videoId}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          volume={volume}
          onVolumeChange={handleVolumeChange}
        />
      )}
    </div>
  );
};

export default BGMPlayer;
