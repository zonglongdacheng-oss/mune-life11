# MUNE LIFE RPG — iPhone PWA化

このプロジェクトはiPhoneのSafariから開いて「ホーム画面に追加」できるPWA構成です。

## 重要
ChatGPTの実行環境から、あなたのVercel等のアカウントへログインして公開URLを発行することはできません。
そのため、このファイルを「公開サーバーに置けばホーム画面アプリになる」状態まで整えています。

### 推奨
Vercelにこのプロジェクトを接続して公開。
公開後、iPhoneのSafariで
`https://公開URL/install`
を開き、
共有 → ホーム画面に追加
を一度だけ行います。

### 本番機能
OpenAI / Supabase / Google Calendar / Web Pushは環境変数を設定すると有効化できます。
