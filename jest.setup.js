// jest-dom は、DOM ノードのアサーションのためのカスタム jest マッチャーを追加します
// https://github.com/testing-library/jest-dom を参照
import "@testing-library/jest-dom";

// モックの設定
// Supabase クライアントのモック
jest.mock("@supabase/supabase-js", () => {
  return {
    createClient: jest.fn(() => ({
      auth: {
        getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
        signOut: jest.fn().mockResolvedValue({}),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null }),
      }),
    })),
  };
});

// Next.js の useRouter モック
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn(() => "/"),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// React YouTube モック
jest.mock("react-youtube", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return <div data-testid="youtube-player" />;
    }),
  };
});

// localStorage モック
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
});

// matchMedia モック
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
