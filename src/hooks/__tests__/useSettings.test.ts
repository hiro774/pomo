import { renderHook, act } from "@testing-library/react";
import useSettings from "../useSettings";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

// モック
jest.mock("@supabase/auth-helpers-react", () => ({
  useSession: jest.fn(),
  useSupabaseClient: jest.fn(),
}));

jest.mock("../useTheme", () => ({
  __esModule: true,
  default: () => ({
    isDark: false,
    toggleTheme: jest.fn(),
  }),
}));

describe("useSettings", () => {
  // モックのセットアップ
  const mockSupabaseSelect = jest.fn();
  const mockSupabaseEq = jest.fn();
  const mockSupabaseSingle = jest.fn();
  const mockSupabaseFrom = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Supabaseクライアントのモック
    mockSupabaseSelect.mockReturnValue({ eq: mockSupabaseEq });
    mockSupabaseEq.mockReturnValue({ single: mockSupabaseSingle });
    mockSupabaseSingle.mockResolvedValue({ data: null });
    mockSupabaseFrom.mockReturnValue({ select: mockSupabaseSelect });

    (useSupabaseClient as jest.Mock).mockReturnValue({
      from: mockSupabaseFrom,
    });

    // セッションのモック（未ログイン状態）
    (useSession as jest.Mock).mockReturnValue(null);

    // タイマーのモック
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("初期状態が正しく設定されること", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.workMinutes).toBe(25);
    expect(result.current.breakMinutes).toBe(5);
    expect(result.current.videoUrl).toBe("");
    expect(result.current.restVideoUrl).toBe("");
    expect(result.current.isLoaded).toBe(false);
  });

  test("未ログイン状態では設定がデフォルト値になること", async () => {
    const { result } = renderHook(() => useSettings());

    // ローディング完了を待つ
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.workMinutes).toBe(25);
    expect(result.current.breakMinutes).toBe(5);
    expect(result.current.videoUrl).toBe("");
    expect(result.current.restVideoUrl).toBe("");
    expect(result.current.isLoaded).toBe(true);
    expect(useSupabaseClient).toHaveBeenCalled();
    expect(mockSupabaseFrom).not.toHaveBeenCalled(); // ログインしていないのでAPIは呼ばれない
  });

  test("ログイン状態では設定がSupabaseから取得されること", async () => {
    // ログイン状態のモック
    (useSession as jest.Mock).mockReturnValue({
      user: { id: "test-user-id" },
    });

    // Supabaseからのレスポンスをモック
    mockSupabaseSingle.mockResolvedValue({
      data: {
        work_minutes: 30,
        break_minutes: 10,
        video_url: "https://example.com/video",
        rest_video_url: "https://example.com/rest-video",
      },
    });

    const { result, rerender } = renderHook(() => useSettings());

    // APIリクエストの完了を待つ
    await act(async () => {
      await Promise.resolve();
    });
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // 再レンダリングして最新の状態を取得
    rerender();

    expect(result.current.workMinutes).toBe(30);
    expect(result.current.breakMinutes).toBe(10);
    expect(result.current.videoUrl).toBe("https://example.com/video");
    expect(result.current.restVideoUrl).toBe("https://example.com/rest-video");
    expect(result.current.isLoaded).toBe(true);
    expect(mockSupabaseFrom).toHaveBeenCalledWith("settings");
    expect(mockSupabaseSelect).toHaveBeenCalledWith("*");
    expect(mockSupabaseEq).toHaveBeenCalledWith("id", "test-user-id");
  });

  test("Supabaseからデータが取得できない場合はデフォルト値が使用されること", async () => {
    // ログイン状態のモック
    (useSession as jest.Mock).mockReturnValue({
      user: { id: "test-user-id" },
    });

    // データがnullの場合
    mockSupabaseSingle.mockResolvedValue({ data: null });

    const { result, rerender } = renderHook(() => useSettings());

    // APIリクエストの完了を待つ
    await act(async () => {
      await Promise.resolve();
    });
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // 再レンダリングして最新の状態を取得
    rerender();

    expect(result.current.workMinutes).toBe(25);
    expect(result.current.breakMinutes).toBe(5);
    expect(result.current.videoUrl).toBe("");
    expect(result.current.restVideoUrl).toBe("");
    expect(result.current.isLoaded).toBe(true);
  });

  test("設定値を変更できること", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.setWorkMinutes(40);
      result.current.setBreakMinutes(15);
      result.current.setVideoUrl("https://example.com/new-video");
      result.current.setRestVideoUrl("https://example.com/new-rest-video");
    });

    expect(result.current.workMinutes).toBe(40);
    expect(result.current.breakMinutes).toBe(15);
    expect(result.current.videoUrl).toBe("https://example.com/new-video");
    expect(result.current.restVideoUrl).toBe(
      "https://example.com/new-rest-video"
    );
  });
});
