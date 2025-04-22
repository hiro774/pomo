# MLB AI

## 目次
1. [概要](#1-概要)
2. [システム概要](#2-システム概要)
3. [デモ](#3-デモ)
4. [使用技術](#4-使用技術)
5. [ローカルでの動かし方](#5-ローカルでの動かし方)
6. [外部URL](#6-外部url)
7. [ライセンス](#7-ライセンス)
<br><br>

## 1. アプリ概要
本アプリは、MLB選手・大谷翔平の情報を自動で収集・要約し、LINE上で会話できるRAGチャットボットです。  
実装している主な機能は以下のとおりです。
- 大谷選手に関する最新ニュース記事、YouTube動画、試合成績を自動収集
- 収集したデータをLLM（大規模言語モデル）で要約し、データベースに保存
- 保存したデータをもとに、LINE上で大谷選手に関する質問に答えるRAGチャットボット
- 「ラグ子」という萌えキャラクターとして、大谷選手の熱狂的ファンの設定で会話
<br><br>

## 2. システム詳細
本アプリは、大きく分けると2つのシステムで動いています。  
大谷翔平選手の情報を自動で集めて整理する**情報収集機能**と、ユーザーからの質問に答える**質問応答機能**です。

### ★情報収集システム（定期実行）
毎日決まった時間に、以下のフローで大谷選手の最新情報をDBに保存します。

**1. 情報収集**
　Web上から大谷選手の情報を自動で収集  
　① 試合の成績データ（ホームラン、安打、打点など）  
　② ニュース記事（怪我は？契約は？チームの状況は？）  
　③ YouTube動画（試合のハイライトなど）  

**2. 情報整理**  
　集めた情報をAI（GPTモデル）に渡して、読みやすいレポートに要約
   
**3. 検索準備**  
　AIが作ったレポートを、あとで簡単に検索できるように特殊な形式で保存  
　➡︎ テキストの意味を数値に変換する「埋め込みベクトル」という技術を使って、「意味で検索」できるようにしています。  
 
### ★質問応答システム（オンデマンド）  
ユーザーがLINEで質問すると、以下のフローで回答を生成します。  

**1. 質問理解**  
　ユーザーの質問を検索用の特殊な形式（埋め込みベクトル）に変換  

**2. 関連情報検索**  
　質問に関連のあるレポートをデータベースから検索  
　➡︎「コサイン類似度」という計算方法で意味の近いレポートを探します。  

**3. 回答生成**  
　見つけた関連情報と質問をセットでAIに渡して、回答を作成
<br><br>

## 3. デモ画像

<img src=https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3577272/1e43dc60-cc02-4dd3-b087-22caf6f276a3.jpeg width=50%>
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3577272/bab255bb-4eb1-4d87-90d4-e5a42b3e29ac.png" width=50%>
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3577272/c4f3d572-36f6-4906-a217-3992ad3610fd.png" width=50%>
<br>

## 4. 使用技術

### バックエンド
- **フレームワーク**: Django (Python 3.13)
- **データベース**: PostgreSQL
- **コンテナ化**: Docker

### 外部API
- **LLM**: OpenAI API
- **メッセージング**: LINE Messaging API
- **動画検索**: YouTube Data API

### 主要ライブラリ
- **LLM連携**: langchain_openai
- **ベクトル検索**: numpy
- **YouTube連携**: googleapiclient
- **LINE連携**: line-bot-sdk
- **Webスクレイピング**: BeautifulSoup4
<br><br>

## 5. ローカルでの動かし方

### 初回環境構築

```bash
# リポジトリのクローン
git clone https://github.com/ユーザー名/mlbai.git
cd mlbai

# 環境変数ファイルの作成
cp app/.env.example app/.env
# .envファイルを編集して必要なAPI鍵などを設定

# Dockerコンテナの起動
docker-compose up -d

# マイグレーションの実行（初回のみ）
docker-compose exec app python manage.py migrate

# 管理者ユーザーの作成（初回のみ）
docker-compose exec app python manage.py createsuperuser
```

### 環境変数の設定

以下の環境変数を`app/.env`ファイルに設定する必要があります。

```
DEBUG=True
SECRET_KEY="your_secret_key"
ALLOWED_HOSTS=localhost,127.0.0.1  # 本番では適切なドメインに変更してください
CSRF_TRUSTED_ORIGINS=http://localhost,http://127.0.0.1  # 本番では https://yourdomain.com などに変更してください

# データベース設定（ローカル開発用）
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
DB_PORT=5432

# OpenAI API設定
OPENAI_API_KEY="your_openai_api_key"
OPENAI_MODEL=gpt-4o-mini

# LINE設定
LINE_USER_ID="your_line_user_id"
LINE_ACCESS_TOKEN="your_line_access_token"

# YouTube API設定
YOUTUBE_API_KEY="your_youtube_api_key"

# 記事スクレイピング設定
ENDPOINT_URL=https://news.yahoo.co.jp/search?p=大谷翔平
```

### 管理画面へのアクセス

ブラウザで http://localhost:8000/admin にアクセスし、作成した管理者ユーザーでログインすることで、保存されたレポートを確認できます。
<br><br>

## 6. 外部URL

本アプリに関するより詳細な技術記事をQiitaにて公開しています。  
https://example.com
<br><br>

## 7. ライセンス

このプロジェクトはMITライセンスの下で公開されています。
