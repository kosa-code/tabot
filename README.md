# tabot

旅行の予定を作成・編集・管理するWebアプリケーション。
AIの柔軟さと通常プログラムの正確性を組み合わせた旅行プランナーを目指す。

詳細は [docs/design.md](docs/design.md)。

## 技術スタック

| 分類 | 技術 | 備考 |
|---|---|---|
| Frontend | React / TypeScript / Vite | Next.jsは採用しない。サーバー側描画・SEOが不要で、概念が増える分だけ不利なため |
| Backend | Python / FastAPI | |
| Database | PostgreSQL | 開発初期から本番までPostgres。移行作業を発生させない。開発中はWindowsにインストールしたPostgresを直接使う(Dockerは使わない)。アクセスはORM(SQLAlchemy)経由 |
| AI | OpenAI API | Phase 2から |
| 移動時間計算 | 直線距離×係数(仮実装) | OSMnx / Routing APIは必要になってから |
| Version Control | Git / GitHub | |
| 開発 | CLI Coding Agent | |
| コンテナ | Docker | 後回し。デプロイ前に導入 |
| Deploy | AWS | Phase 3 |

## 開発環境の起動

### 前提

- Python 3.12
- PostgreSQL 18（Windowsに直接インストール）
- Node.js 24

### 初回のみ

```
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
```

`.env` の `PASSWORD_HERE` を postgres ユーザーのパスワードに書き換えてから:

```
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -U postgres -h localhost -c "CREATE DATABASE tabot;"
alembic upgrade head
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -U postgres -h localhost -d tabot -c "INSERT INTO users (id, name, email) VALUES (gen_random_uuid(), 'dev', 'dev@example.com');"
```

最後の行は開発用ユーザー。認証を入れるまでは、旅行はこのユーザーのものとして作られる。

### 毎回

```
cd backend
.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

http://127.0.0.1:8000/docs でAPIを試せる。

### フロント

初回のみ:

```
cd frontend
npm install
```

毎回（バックエンドとは別のターミナルで）:

```
cd frontend
npm run dev
```

http://localhost:5173 で画面が見られる。バックエンドも起動しておくこと。

### テーブルを変更したとき

```
alembic revision --autogenerate -m "説明"
alembic upgrade head
```

生成された `alembic/versions/` の手順書は、適用前に中身を確認する。

## ドキュメント

- [docs/design.md](docs/design.md) — 概要・機能仕様・開発手順
- [docs/database.md](docs/database.md) — DB設計
- [docs/scheduling.md](docs/scheduling.md) — 時刻計算・制約チェック
- [AGENTS.md](AGENTS.md) — AIエージェント向けの作業ルール
