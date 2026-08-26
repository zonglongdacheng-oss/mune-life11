# MUNE LIFE RPG v2 — Cloud / AI Architecture

今回の版は「本格アプリ」にするための実運用構成を含むフルスタック版です。

## 実装済みの構造

- Next.js / React
- MUNE AI COACH → OpenAI Responses API
- Supabase → クラウドDB / 複数端末同期の土台
- Supabase Storage → 自動バックアップの土台
- Google Calendar OAuth → 読み取り連携の土台
- ICS → Apple Calendar等へ予定を書き出せる
- Web Push → 通知の土台
- Daily AI endpoint → 毎朝のAI分析
- Cron endpoint → 自動実行の土台
- G〜Sランク / XP / Level / Skill Tree / Quest / Achievement

## 最短セットアップ

1. Node.js 20+ を用意
2. Supabaseプロジェクトを作る
3. `supabase/schema.sql` をSQL Editorで実行
4. `.env.example` を `.env.local` にコピー
5. OpenAI API keyを設定
6. `npm install`
7. `npm run dev`
8. `http://localhost:3000`

OpenAI API keyはブラウザに直接置かず、Next.jsのサーバー側API routeから利用してください。

## 本番化

Vercel等にデプロイし、環境変数を設定。
Google Calendarを使う場合はGoogle Cloud ConsoleでOAuth Clientを作り、
`GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REDIRECT_URI`を設定。

Web PushはVAPID鍵を生成して
`NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY / VAPID_SUBJECT`
を設定。

Daily AI / BackupはVercel Cron等から `/api/cron/daily` と `/api/cron/backup` を認証付きで呼び出す構成にします。

## 重要

このzip単体だけで「あなた専用のクラウドサービス」が即時稼働するわけではありません。
クラウドDB・OpenAI・Google・Pushのアカウント/認証情報が必要です。

また、Supabaseの本番運用ではRLSを必ず設定し、ユーザーごとに自分のデータだけを読めるようにしてください。

## AIコーチの考え方

AIはToDoを増やすのではなく、
- 自由
- 挑戦
- 楽しさ
- CONNECTION
- 成長
- 身体
- 外見
- 収入/IP
- 退職までの資金
を総合して「今日の最短ルート」を提案することを目的にしています。
