# tabot

旅行の予定を作成・編集・管理するWebアプリ(個人開発)。

行きたい場所を選んで並べると、移動時間と各地点の到着・出発時刻を自動で計算してタイムラインを作る。営業時間外の到着や終了時刻の超過は警告する。Phase 2からはOpenAI APIで「フィレンツェを追加して」のように自然言語でプランを編集できるようにする。

AIは「何をしたいか」を理解し、時間・距離・金額の計算と検証は通常プログラムが行う。**AIの柔軟さと数値の正確さを両立した旅行プランナー**を目指す。

## ドキュメント

| ファイル | 内容 |
|---|---|
| [docs/design.md](docs/design.md) | 要件定義。概要・背景と課題・対象ユーザー・提供価値 |
| [docs/value-hypothesis.md](docs/value-hypothesis.md) | 価値仮説シート。対象者・課題・提供価値 |
| [docs/value-proposition-canvas.md](docs/value-proposition-canvas.md) | Value Proposition Canvas |
| [docs/ui.md](docs/ui.md) | UI のルール。色・文字サイズ・余白・アイコン・部品の一覧 |

DB設計や開発手順などの技術的な設計は、要件定義に絞った際に分離した。必要になったら別ファイルに起こす(過去の版は git 履歴の `docs/design.md` v2.0 にある)。

## 現在の状態

Phase 1a(最小構成)の途中。

- backend: 土台とDBの4テーブル(users / trips / places / trip_places)まで作成済み。APIは `/health` のみ
- frontend: サンプルデータをメモリ上で編集するモック。バックエンドとは未接続
  - サイドバー + 上部バーのダッシュボード構成
  - 予算(支出との比較と進捗バー)・行程(移動と滞在の内訳)・注意(警告の一覧)のカード
  - 縦のレールに沿ったタイムライン。移動時間の仮計算、営業時間と終了時刻の警告
  - 旅行の編集と場所の追加は右から出るサイドビューで行う。並び替え・削除・滞在時間・予算はその場で変更できる

| Phase | 内容 |
|---|---|
| 1a | 旅行・場所のCRUD、訪問順、滞在時間、移動時間(仮)、タイムライン ← 今ここ |
| 1b | 制約チェック(営業時間・時間制約) |
| 2 | AIによる自然言語でのプラン編集 |
| 3 | 割り勘・経費管理・共有・認証・AWSデプロイ |

次にやること: backend に旅行CRUDのAPIを作り、frontend のサンプルデータ読み込みをAPI呼び出しに置き換える。

## 技術スタック

| 分類 | 技術 |
|---|---|
| Frontend | React / TypeScript / Vite / Tailwind CSS v4 / lucide-react |
| Backend | Python / FastAPI / SQLAlchemy / Alembic |
| Database | PostgreSQL(ローカルにインストールして直接使う。Dockerは使わない) |
| AI | OpenAI API(Phase 2から) |

## ディレクトリ構成

```
tabot/
├── .github/                 # PR / Issue テンプレート、マージ時コメントの workflow
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPIアプリ(/health)
│   │   ├── config.py        # .env から DATABASE_URL を読む
│   │   ├── db.py            # SQLAlchemy engine / session / Base
│   │   └── models.py        # テーブル定義(正はここ)
│   ├── alembic/             # マイグレーション
│   ├── data/
│   │   └── sample.json      # 4テーブルと同じ構造のサンプルデータ(イタリア周遊)
│   ├── alembic.ini
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # 画面。部品を組み合わせ、サンプルデータを state として持つ
│   │   ├── index.css            # Tailwind の読み込みとデザイントークン(@theme)
│   │   ├── components/ui/       # Button / IconButton / Badge / Card / SideView / Field / SegmentedControl / Stat / SegmentBar
│   │   ├── components/layout/   # AppShell / Sidebar / TopBar / PageHeader
│   │   ├── components/trip/     # BudgetCard / ItineraryCard / WarningsCard / Timeline / TripEditForm / AddPlaceForm
│   │   ├── lib/schedule.ts      # タイムライン計算(update_schedule の仮置き)
│   │   ├── lib/format.ts        # 日時・金額の表示
│   │   ├── lib/categories.ts    # 場所のカテゴリ(表示名・色・アイコン)
│   │   ├── lib/ui.ts            # アイコンサイズの定数
│   │   ├── types/               # 4テーブルに対応する型
│   │   └── data/sample.ts       # backend/data/sample.json を読み込む
│   └── vite.config.ts           # @ と @data のエイリアス
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

### モデルを変えたとき

`backend/` で以下を実行してマイグレーションを作り、内容を確認してから適用する。

```bash
alembic revision --autogenerate -m "変更内容"
alembic upgrade head
```

## セットアップ(frontend)

前提: Node.js 20以上。

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173/
npm run build    # 型チェックとビルド
npm run lint     # oxlint
```

データは `backend/data/sample.json` を直接読み込んでおり、画面上の編集はリロードで元に戻る。

タイムラインの計算(移動時間・到着時刻・営業時間チェック)は、バックエンドの update_schedule ができるまでの仮置きとして `frontend/src/lib/schedule.ts` に置いている。接続時にはAPIの結果に置き換える。

### デザイン

色・文字サイズ・余白・アイコン・部品のルールは [docs/ui.md](docs/ui.md) にまとめている。値の正は `frontend/src/index.css` の `@theme` と `frontend/src/lib/ui.ts`。画面を作るときは `components/ui` と `components/layout` の部品を組み合わせ、画面側で見た目のクラスを書かない。

## 開発の進め方

人間が目的・要件・DB設計・責務分担・Tool仕様・計算ルールを決め、CLI Coding Agentがコード実装・テスト・リファクタリングを担当する。機能単位で進め、一度にすべてを実装させない。

AIと通常プログラムの責務は分ける。AIは自然言語の理解・候補の選択・提案・説明を担当し、DB操作・金額や時間や距離の計算・制約チェック・入力検証は通常プログラムが担当する。重要な値をAIに推測させない。
