import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TimerCard from "../TimerCard";

describe("TimerCard", () => {
  // モックハンドラー
  const mockHandlers = {
    handleStart: jest.fn(),
    handleStop: jest.fn(),
    handleReset: jest.fn(),
    handleSkip: jest.fn(),
  };

  // 基本的なプロップス
  const baseProps = {
    isWorkSession: true,
    progress: 75,
    seconds: 1500, // 25分
    isRunning: false,
    formatTime: (seconds: number) =>
      `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`,
    ...mockHandlers,
  };

  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();
  });

  test("作業セッション中に正しくレンダリングされること", () => {
    render(<TimerCard {...baseProps} />);

    // タイマーが表示されていることを確認
    expect(screen.getByText("25:00")).toBeInTheDocument();

    // 進捗バーが表示されていることを確認
    expect(screen.getByText("75%")).toBeInTheDocument();

    // スタートボタンが有効であることを確認
    const buttons = screen.getAllByRole("button");
    const startButton = buttons[0]; // 最初のボタンがスタートボタン
    expect(startButton).not.toBeDisabled();

    // ストップボタンが無効であることを確認
    const stopButton = buttons[1]; // 2番目のボタンがストップボタン
    expect(stopButton).toBeDisabled();
  });

  test("休憩セッション中に正しくレンダリングされること", () => {
    render(<TimerCard {...baseProps} isWorkSession={false} seconds={300} />);

    // タイマーが表示されていることを確認
    expect(screen.getByText("5:00")).toBeInTheDocument();

    // 進捗バーが表示されていることを確認
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  test("タイマー実行中に正しくレンダリングされること", () => {
    render(<TimerCard {...baseProps} isRunning={true} />);

    // スタートボタンが無効であることを確認
    const buttons = screen.getAllByRole("button");
    const startButton = buttons[0]; // 最初のボタンがスタートボタン
    expect(startButton).toBeDisabled();

    // ストップボタンが有効であることを確認
    const stopButton = buttons[1]; // 2番目のボタンがストップボタン
    expect(stopButton).not.toBeDisabled();
  });

  test("スタートボタンをクリックするとhandleStart関数が呼ばれること", () => {
    render(<TimerCard {...baseProps} />);

    // スタートボタンをクリック
    const buttons = screen.getAllByRole("button");
    const startButton = buttons[0]; // 最初のボタンがスタートボタン
    fireEvent.click(startButton);

    // handleStart関数が呼ばれたことを確認
    expect(mockHandlers.handleStart).toHaveBeenCalledTimes(1);
  });

  test("ストップボタンをクリックするとhandleStop関数が呼ばれること", () => {
    render(<TimerCard {...baseProps} isRunning={true} />);

    // ストップボタンをクリック
    const buttons = screen.getAllByRole("button");
    const stopButton = buttons[1]; // 2番目のボタンがストップボタン
    fireEvent.click(stopButton);

    // handleStop関数が呼ばれたことを確認
    expect(mockHandlers.handleStop).toHaveBeenCalledTimes(1);
  });

  test("リセットボタンをクリックするとhandleReset関数が呼ばれること", () => {
    render(<TimerCard {...baseProps} />);

    // リセットボタンをクリック
    const buttons = screen.getAllByRole("button");
    const resetButton = buttons[2]; // 3番目のボタンがリセットボタン
    fireEvent.click(resetButton);

    // handleReset関数が呼ばれたことを確認
    expect(mockHandlers.handleReset).toHaveBeenCalledTimes(1);
  });

  test("スキップボタンをクリックするとhandleSkip関数が呼ばれること", () => {
    render(<TimerCard {...baseProps} />);

    // スキップボタンをクリック
    const buttons = screen.getAllByRole("button");
    const skipButton = buttons[3]; // 4番目のボタンがスキップボタン
    fireEvent.click(skipButton);

    // handleSkip関数が呼ばれたことを確認
    expect(mockHandlers.handleSkip).toHaveBeenCalledTimes(1);
  });
});
