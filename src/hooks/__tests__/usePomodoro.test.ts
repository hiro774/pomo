import { renderHook, act } from "@testing-library/react";
import usePomodoro from "../usePomodoro";

// モック関数
jest.useFakeTimers();

describe("usePomodoro", () => {
  // テスト用のパラメータ
  const testProps = {
    workMinutes: 25,
    breakMinutes: 5,
  };

  beforeEach(() => {
    // 各テストの前にタイマーをリセット
    jest.clearAllTimers();
  });

  test("初期状態が正しく設定されること", () => {
    const { result } = renderHook(() => usePomodoro(testProps));

    expect(result.current.seconds).toBe(testProps.workMinutes * 60);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isWorkSession).toBe(true);
    expect(result.current.progress).toBe(100);
  });

  test("handleStart関数がタイマーを開始すること", () => {
    const { result } = renderHook(() => usePomodoro(testProps));

    act(() => {
      result.current.handleStart();
    });

    expect(result.current.isRunning).toBe(true);

    // 10秒進める
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // 10秒経過後、残り時間が10秒減少していることを確認
    expect(result.current.seconds).toBe(testProps.workMinutes * 60 - 10);

    // 進捗バーの値も更新されていることを確認
    const expectedProgress =
      ((testProps.workMinutes * 60 - 10) / (testProps.workMinutes * 60)) * 100;
    expect(result.current.progress).toBeCloseTo(expectedProgress);
  });

  test("handleStop関数がタイマーを停止すること", () => {
    const { result } = renderHook(() => usePomodoro(testProps));

    // タイマーを開始
    act(() => {
      result.current.handleStart();
    });

    // 10秒進める
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // タイマーを停止
    act(() => {
      result.current.handleStop();
    });

    expect(result.current.isRunning).toBe(false);

    // さらに10秒進めても値が変わらないことを確認
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    expect(result.current.seconds).toBe(testProps.workMinutes * 60 - 10);
  });

  test("handleReset関数がタイマーをリセットすること", () => {
    const { result } = renderHook(() => usePomodoro(testProps));

    // タイマーを開始して10秒進める
    act(() => {
      result.current.handleStart();
      jest.advanceTimersByTime(10000);
    });

    // タイマーをリセット
    act(() => {
      result.current.handleReset();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.seconds).toBe(testProps.workMinutes * 60);
    expect(result.current.progress).toBe(100);
  });

  test("handleSkip関数がセッションを切り替えること", () => {
    const { result } = renderHook(() => usePomodoro(testProps));

    // 作業セッションから休憩セッションに切り替え
    act(() => {
      result.current.handleSkip();
    });

    expect(result.current.isWorkSession).toBe(false);
    expect(result.current.seconds).toBe(testProps.breakMinutes * 60);

    // 休憩セッションから作業セッションに切り替え
    act(() => {
      result.current.handleSkip();
    });

    expect(result.current.isWorkSession).toBe(true);
    expect(result.current.seconds).toBe(testProps.workMinutes * 60);
  });

  test("formatTime関数が時間を正しくフォーマットすること", () => {
    const { result } = renderHook(() => usePomodoro(testProps));

    // 1分30秒
    expect(result.current.formatTime(90)).toBe("01:30");

    // 10分5秒
    expect(result.current.formatTime(605)).toBe("10:05");

    // 0分0秒
    expect(result.current.formatTime(0)).toBe("00:00");
  });

  test("タイマーが0になると自動的に次のセッションに切り替わること", () => {
    const { result } = renderHook(() =>
      usePomodoro({
        workMinutes: 1, // テストのために短い時間を設定
        breakMinutes: 1,
      })
    );

    // タイマーを開始
    act(() => {
      result.current.handleStart();
    });

    // 作業セッションの時間（1分）が経過
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    // 休憩セッションに切り替わっていることを確認
    expect(result.current.isWorkSession).toBe(false);
    expect(result.current.isRunning).toBe(true);

    // 休憩セッションの時間（1分）が経過
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    // 作業セッションに戻っていることを確認
    expect(result.current.isWorkSession).toBe(true);
    expect(result.current.isRunning).toBe(true);
  });
});
