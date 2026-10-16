# tabot

旅行の予定を作成・編集・管理するWebアプリ(個人開発)。

行きたい場所を選んで並べると、移動時間と各地点の到着・出発時刻を自動で計算してタイムラインを作る。営業時間外の到着や終了時刻の超過は警告する。Phase 2からはOpenAI APIで「フィレンツェを追加して」のように自然言語でプランを編集できるようにする。

AIは「何をしたいか」を理解し、時間・距離・金額の計算と検証は通常プログラムが行う。**AIの柔軟さと数値の正確さを両立した旅行プランナー**を目指す。

## ドキュメント

| ファイル | 内容 |
|---|---|
| [docs/design.md](docs/design.md) | 設計書。背景・提供価値・フェーズ・DB設計・機能仕様・開発手順 |
| [docs/value-hypothesis.md](docs/value-hypothesis.md) | 価値仮説シート。対象者・課題・提供価値 |
| [docs/value-proposition-canvas.md](docs/value-proposition-canvas.md) | Value Proposition Canvas |

## 現在の状態

Phase 1a(最小構成)の途中。

- backend: 土台とDBの4テーブル(users / trips / places / trip_places)まで作成済み。APIは `/health` のみ
- frontend: サンプルデータをメモリ上で編集するモック。サイドバー付きのダッシュボード構成で、予算(支出との比較)・行程・注意のカードと、タイムライン(移動時間の仮計算と営業時間の警告つき)を表示する。旅行の編集、場所の追加・削除・並び替え、滞在時間と予算の変更ができる。バックエンドとは未接続

| Phase | 内容 |
|---|---|
| 1a | 旅行・場所のCRUD、訪問順、滞在時間、移動時間(仮)、タイムライン ← 今ここ |
| 1b | 制約チェック(営業時間・時間制約) |
| 2 | AIによる自然言語でのプラン編集 |
| 3 | 割り勘・経費管理・共有・認証・AWSデプロイ |

## 技術スタック

| 分類 | 技術 |
|---|---|
| Frontend | React / Vite / Tailwind CSS v4 / lucide-react |
| Backend | Python / FastAPI / SQLAlchemy / Alembic |
| Database | PostgreSQL(ローカルにインストールして直接使う。Dockerは使わない) |
| AI | OpenAI API(Phase 2から) |

## ディレクトリ構成

```
tabot/
├── backend/
│   ├── app/
│   │   ├── main.py      # FastAPIアプリ(/health)
│   │   ├── config.py    # .env から DATABASE_URL を読む
│   │   ├── db.py        # SQLAlchemy engine / session / Base
│   │   └── models.py    # テーブル定義(正はここ)
│   ├── alembic/         # マイグレーション
│   ├── data/
│   │   └── sample.json  # 4テーブルと同じ構造のサンプルデータ(イタリア周遊)
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   └── src/
│       ├── App.tsx            # 画面全体。サンプルデータをstateとして持つ
│       ├── components/ui/     # Button / Field / Badge / ShellCard / Dialog
│       ├── index.css          # Tailwind の読み込みとカラーパレット(@theme)
│       ├── components/layout/ # Sidebar / TopBar
│       ├── components/trip/   # BudgetCard / ItineraryCard / WarningsCard / Timeline / 各フォーム
│       ├── lib/schedule.ts    # タイムライン計算(update_scheduleの仮置き)
│       ├── lib/format.ts      # 日時・金額の表示
│       └── data/sample.ts     # backend/data/sample.json を読み込む
└── docs/
```

## サンプルデータ

`backend/data/sample.json` に、DBの4テーブルと同じ構造でヴェネツィア・フィレンツェ・ローマを回る旅程のサンプルを置いている。DBを立てずにCRUDやタイムラインのロジックを作るときの入力に使う。`start_time` / `end_time` は update_schedule が計算して埋める想定なので null にしている。

`expenses` は Phase 3 の案(支払った人 / 金額 / 内容)に沿ったモック用のデータで、予算カードの表示にだけ使う。DBにはまだ無い。

## セットアップ(backend)

前提: Python 3.10以上、PostgreSQL がローカルで起動していること。

1. データベースを作る

   ```bash
   createdb tabot
   ```

2. 仮想環境を作って依存を入れる

   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate   # Windows は .venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. 接続先を設定する。`.env` はコミットされない

   ```bash
   cp .env.example .env
   # .env の DATABASE_URL のパスワード等を自分の環境に合わせて書き換える
   ```

4. マイグレーションを適用する

   ```bash
   alembic upgrade head
   ```

5. 開発サーバーを起動する

   ```bash
   uvicorn app.main:app --reload
   ```

   `http://127.0.0.1:8000/health` が `{"status":"ok"}` を返せば動いている。APIドキュメントは `http://127.0.0.1:8000/docs`。

## セットアップ(frontend)

前提: Node.js 20以上。

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:5173/` でモックが開く。データは `backend/data/sample.json` を直接読み込んでおり、画面上の編集はリロードで元に戻る。

### デザイン

カラーパレットは `frontend/src/index.css` の `@theme` で定義し、`bg-primary` `text-secondary-dark` のように Tailwind のクラスとして使う。

| トークン | 値 | 用途 |
|---|---|---|
| `primary` | `#fb8500` | CTAボタン、予算の進捗バー、警告の文字など「今ここ」を示す |
| `primary-light` | `#ffb703` | 警告アイコン、primary の淡い地 |
| `secondary-dark` | `#023047` | 本文の文字(`ink`)、ロゴ |
| `secondary` | `#219ebc` | カード見出しのアイコン、選択中のナビ、フォーカス、行程バー(移動) |
| `secondary-light` | `#8ecae6` | 選択中・ホバーの淡い地、行程バー(滞在) |

アイコンは [lucide-react](https://lucide.dev/) を使う。自前のSVGは持たない。

タイムラインの計算(移動時間・到着時刻・営業時間チェック)は、バックエンドの update_schedule ができるまでの仮置きとして `frontend/src/lib/schedule.ts` に置いている。接続時にはAPIの結果に置き換える。

### モデルを変えたとき

`backend/` で以下を実行してマイグレーションを作り、内容を確認してから適用する。

```bash
alembic revision --autogenerate -m "変更内容"
alembic upgrade head
```

## 開発の進め方

人間が目的・要件・DB設計・責務分担・Tool仕様・計算ルールを決め、CLI Coding Agentがコード実装・テスト・リファクタリングを担当する。機能単位で進め、一度にすべてを実装させない。詳細は [docs/design.md](docs/design.md) の「開発方針」「開発手順」を参照。
