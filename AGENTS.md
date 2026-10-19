# AGENTS.md

AIコーディングエージェント向けの作業ルール。

## プロジェクト

旅行プランナー。設計は [docs/design.md](docs/design.md)、DBは [docs/database.md](docs/database.md)、時刻計算は [docs/scheduling.md](docs/scheduling.md)。
アプリ内のAI(OpenAI)と通常プログラムの責務分離は design.md の「開発方針」に従う。

## 分担

- 人間が決める: 目的 / 要件 / DB設計 / 責務分担 / Tool仕様 / 計算ルール / テスト方針
- エージェントに任せる: コード実装 / テストコード / リファクタリング / エラー修正 / ドキュメント

## 進め方

- 変更の前に「申請」を出し、承認を得てから実装する。「次はこれをやります」と書いたことを承認とみなさない
- 1回の申請は小さく。複数ファイルなら1ファイルずつ
- 申請にはコード全文を色付きのコードブロック(```python など)で示す。既存ファイルの部分変更は ```diff
- ファイル変更は Edit / Write ツールで行う(差分が表示されるため)。シェルで書き換えない
- 最初から過剰設計しない。一度にすべてを実装しない

## コマンド

- 環境構築・DB変更(CREATE / DROP / INSERT、migrationの適用)・git操作は人間が実行する。エージェントはコマンドと期待される表示を示す
- 読み取りだけの確認(git status、SELECT、ファイルの存在確認など)はエージェントが実行してよい
- backend のコマンドは `backend/` で venv を有効化して実行する。サーバーは `--port 8001`

## Git

- コミットメッセージは `種類: 内容する` (例: `feat: placesのAPIを追加する`)。種類は feat / fix / docs / refactor / chore
- 数コミットにまたがる作業はブランチを切る(`feature/xxx`)。1コミットで終わるものは main でよい

## 技術上の注意

- DBの構造を直接変えない。models.py → `alembic revision --autogenerate` → 手順書を確認 → `alembic upgrade head`
- `.ini` ファイルに日本語を書かない(Windowsでcp932として読まれ、壊れる)
- パスワード・APIキーは `.env` のみ。コミットされるファイルに書かない

## 回答

- 短く。聞かれたことに答える。背景説明は求められたら足す
