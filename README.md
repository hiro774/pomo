# Pomo - ポモドーロタイマーアプリ

## 目次
1. [概要](#1-概要)
2. [システム概要](#2-システム概要)
3. [デモ](#3-デモ)
4. [使用技術](#4-使用技術)
5. [ローカルでの動かし方](#5-ローカルでの動かし方)
6. [ライセンス](#6-ライセンス)
<br><br>

## 1. 概要
本アプリは、ポモドーロテクニックを実践するためのタイマーアプリです。  
実装している主な機能は以下のとおりです。
- 作業時間と休憩時間を設定できるポモドーロタイマー
- 作業中と休憩中で異なるBGMを設定できるYouTube BGMプレーヤー
- ダークモード/ライトモードの切り替え
- Google認証によるユーザー登録・ログイン
- ユーザーごとの設定保存（Supabase）
<br><br>

## 2. システム概要
本アプリは、Next.jsとSupabaseを使用した、モダンなポモドーロタイマーアプリケーションです。

### ★ポモドーロタイマー機能
- 作業時間と休憩時間を自由に設定可能（デフォルトは25分/5分）
- タイマーの開始、停止、リセット、スキップ機能
- 作業セッションと休憩セッションの自動切り替え
- 視覚的な進捗バーでセッションの残り時間を表示

### ★BGMプレーヤー機能
- YouTube URLを入力するだけで簡単にBGMを設定
- 作業中と休憩中で異なるBGMを設定可能
- 音量調整機能
- プレーヤーの展開/最小化機能

### ★設定保存機能
- Google認証によるユーザー登録・ログイン
- ユーザーごとの設定（作業時間、休憩時間、BGM）をSupabaseに保存
- 次回ログイン時に自動的に設定を読み込み
<br><br>

## 3. デモ
![Pomo home_dark](/public/images/home_dark.webp)
![Pomo home_light](/public/images/home_light.webp)
![Pomo mod_light](/public/images/mod_dark.webp)
![Pomo mod_dark](/public/images/mod_light.webp)

<br><br>

## 4. 使用技術

### フロントエンド
- **フレームワーク**: Next.js 15.1.7
- **UI ライブラリ**: React 19.0.0
- **スタイリング**: Tailwind CSS
- **言語**: TypeScript

### バックエンド
- **認証/データベース**: Supabase

### 主要ライブラリ
- **認証**: @supabase/auth-helpers-nextjs, @supabase/auth-helpers-react
- **動画プレーヤー**: react-youtube
- **通知**: react-hot-toast
<br><br>

## 5. ローカルでの動かし方

### 初回環境構築

```bash
# リポジトリのクローン
git clone https://github.com/ユーザー名/pomo.git
cd pomo

# 依存関係のインストール
npm install

# 環境変数ファイルの作成
cp .env.example .env.local
# .env.localファイルを編集して必要なAPI鍵などを設定
```

### 環境変数の設定

以下の環境変数を`.env.local`ファイルに設定する必要があります。

```
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセスすると、アプリケーションが表示されます。

### ビルドと本番環境での実行

```bash
# ビルド
npm run build

# 本番環境での実行
npm run start
```
<br><br>

## 6. ライセンス

このプロジェクトはMITライセンスの下で公開されています。
