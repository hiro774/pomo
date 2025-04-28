import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // next.config.js と .env ファイルを読み込むために、Next.js アプリのパスを指定
  dir: "./",
});

// Jest に渡すカスタム設定
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // src/ ディレクトリのエイリアス設定（tsconfig.json と一致させる）
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

// createJestConfig は、next/jest が非同期で Next.js の設定を読み込むために
// 非同期関数を返します
export default createJestConfig(customJestConfig);
