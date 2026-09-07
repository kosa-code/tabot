# tabot 設計書

Version: 1.2
更新日: 2026-09-07

---

## 概要

旅行の予定を作成・編集・管理できるWebアプリケーション。

旅行先、訪問場所、滞在時間、移動時間、予算などを管理し、制約を考慮した旅行プランを作成する。Phase 2ではOpenAI APIを利用し、自然言語で旅行プランを編集できるようにする。

単に「旅行プランを考えて」とLLMに頼むサービスではなく、

- AIがユーザーの希望を理解し、プランを提案・編集する
- 実際のデータ(場所・移動時間)を取得する
- 通常プログラムで計算・検証する

という構成で、**AIの柔軟さと通常プログラムの正確性を組み合わせた旅行プランナー**を目指す。

---

## 開発方針

### AIと通常プログラムの責務分離

AIが担当:

- 自然言語の理解、ユーザーの希望の解釈
- 場所の候補選択
- 旅行プラン変更の提案
- 必要なToolの選択
- ユーザーへの説明

通常プログラムが担当:

- DB操作
- 金額計算・割り勘計算
- 移動時間・距離計算
- 営業時間チェック、予算チェック、時間制約チェック
- 入力値のバリデーション

原則: **AIは「何をしたいか」を理解し、プログラムは「正確に実行する」。**
金額・時間・距離などの重要な値をAIに推測させない。

### 開発原則

1. AIと通常プログラムの責務を分離する
2. 金額・時間・距離など重要な値は構造化して扱う
3. LLMにDBへの直接アクセスを許可しない
4. AIの出力をそのまま正しい情報として扱わない
5. 重要な変更は検証・確認できるようにする
6. 最初から過剰設計しない
7. CLI Coding Agentを実装担当として利用し、人間は設計・仕様・レビューを担当する
8. 一度にすべてを実装させず、機能単位で進める

---

## 技術スタック

| 分類 | 技術 | 備考 |
|---|---|---|
| Frontend | Next.js / React | |
| Backend | Python / FastAPI | |
| Database | PostgreSQL | 開発初期から本番までPostgres。移行作業を発生させない。アクセスはORM(SQLAlchemy)経由 |
| AI | OpenAI API | Phase 2から |
| 移動時間計算 | 直線距離×係数(仮実装) | OSMnx / Routing APIは必要になってから |
| Version Control | Git / GitHub | |
| 開発 | CLI Coding Agent | |
| コンテナ | Docker | 開発用PostgreSQLはdocker composeで起動。アプリ自体のコンテナ化はデプロイ前 |
| Deploy | AWS | Phase 3 |

---

## データベース設計

PostgreSQLの型をそのまま使う。以下の表記は下記に対応する。

| 表記 | PostgreSQLの型 | 備考 |
|---|---|---|
| UUID | `uuid` | 生成はアプリ側(`uuid4`)で行う |
| JSON | `jsonb` | 検索・部分更新ができる |
| TIMESTAMP | `timestamptz` | UTCで保存し、表示時にJSTへ変換 |

Migrationツールは Alembic を使う。

### users

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | ユーザーID |
| name | VARCHAR | 名前 |
| email | VARCHAR | メールアドレス |
| created_at | TIMESTAMP | 作成日時 |

### trips

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | 旅行ID |
| user_id | UUID | 作成者 |
| name | VARCHAR | 旅行名 |
| start_at | TIMESTAMP | 開始日時 |
| end_at | TIMESTAMP | 終了日時 |
| budget | INTEGER | 予算 |

### places

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | 場所ID |
| name | VARCHAR | 場所名 |
| latitude | DOUBLE | 緯度 |
| longitude | DOUBLE | 経度 |
| category | VARCHAR | カテゴリ |
| opening_hours | JSON | 営業時間 |
| stay_minutes | INTEGER | 想定滞在時間 |

場所データはPhase 1では手入力前提。

### trip_places

| カラム | 型 | 説明 |
|---|---|---|
| trip_id | UUID | 旅行ID |
| place_id | UUID | 場所ID |
| visit_order | INTEGER | 訪問順 |
| start_time | TIMESTAMP | 開始時刻 |
| end_time | TIMESTAMP | 終了時刻 |

start_time / end_time はTIMESTAMP(日時)で持つ。日をまたぐ旅行にそのまま対応できる。値はupdate_scheduleが計算して埋める。

### expenses

| カラム | 型 | 説明 |
|---|---|---|
| id | UUID | 支出ID |
| trip_id | UUID | 旅行ID |
| payer_id | UUID | 支払った人 |
| amount | INTEGER | 金額 |
| description | VARCHAR | 内容 |

### expense_participants

| カラム | 型 | 説明 |
|---|---|---|
| expense_id | UUID | 支出ID |
| user_id | UUID | 負担者 |

---

## 機能仕様

### Phase 1a: 最小構成 ← 今ここ

- 旅行の作成・編集・削除
- 場所の登録・削除
- 訪問順の変更
- 滞在時間の設定
- 移動時間の計算(直線距離×係数の仮実装)
- タイムライン表示

目標: 以下のような予定を作成できる状態。

```
10:00 名古屋駅
  ↓ 20分
10:20 名古屋城
  ↓ 90分
11:50 名古屋城 出発
  ↓ 25分
12:15 大須
```

### Phase 1b: 制約チェック

- 営業時間のチェック
- 時間制約のチェック(旅行の開始・終了時刻に収まるか)
- 制約違反は警告表示のみ(自動修正はしない)

### Phase 2: AIによる旅行プラン編集

OpenAI APIを導入し、自然言語による旅行プラン編集を可能にする。

フロー:

```
ユーザー「大須を追加して」
  ↓
OpenAI API (Tool選択)
  ↓
Backend
  ├ 場所検索
  ├ DB更新
  ├ 移動時間計算
  └ 制約チェック
  ↓
更新された旅行プラン表示
```

#### Tool一覧

- `search_places(keyword, area, category)`
- `add_place(trip_id, place_id)`
- `remove_place(trip_id, place_id)`
- `reorder_places(trip_id, ordered_place_ids)`
- `update_schedule(trip_id, constraints)`
- `calculate_route(origin, destination, mode)`
- `calculate_split(trip_id)`

#### Tool利用ルール

- 引数をサーバー側で検証する
- 存在しないIDを受け付けない
- 許可された操作のみ実行する
- AIに直接SQLを書かせない
- 必要に応じてユーザー確認を入れる

#### 曖昧性の解決

「大須」のように候補が複数ある場合、search_placesの結果をユーザーに提示して確認させるフローを基本とする。AIが勝手に決めない。

#### 変更の透明性

AIによるプラン変更は、変更前後の差分と変更理由を表示する。

```
変更前          変更後
10:00 名古屋城   10:00 名古屋城
12:00 大須      12:00 大須
14:00 栄        14:30 栄

理由: 大須を追加したため、移動時間を再計算しました。
```

### Phase 3: 実用アプリ

- 割り勘
- 経費管理
- 旅行の共有
- 認証
- テスト整備
- エラー処理
- AWSデプロイ

#### 割り勘

構造化された入力フォームを基本UIとする。チャットだけで完結させない。

入力: 支払った人 / 金額 / 内容 / 参加者 / 割り勘方法 / 端数処理

自然言語入力(「昨日の夕食12000円を4人で割り勘。僕が払った」)はAIが構造化データに変換し、ユーザー確認後に通常プログラムで計算する。

検証: 割り勘後、全員の受取額 − 全員の支払額 = 0 を確認する。

#### 経費管理

- 支出の登録・編集・削除
- カテゴリ別・人別集計
- 総額表示、予算との差額表示

---

## update_scheduleの仕様

Phase 1では以下の割り切りとする。

- 訪問順(visit_order)は変えない
- 旅行の開始時刻から、移動時間と滞在時間を前から順に足してstart_time / end_timeを埋める
- 制約違反(営業時間外、終了時刻超過)は警告表示のみ。自動修正・並び替え最適化はしない

順序最適化(移動を少なくする等)はPhase 2以降で検討する。

---

## 開発手順

1. プロジェクト初期化(Next.js / FastAPI / PostgreSQL / Git)
2. DB設計・Migration
3. 旅行CRUD
4. 旅行プラン(場所追加・削除・順番変更・タイムライン表示)
5. 移動時間(仮実装)・update_schedule
6. 制約チェック(Phase 1b)
7. OpenAI API接続・Function Calling(Phase 2)
8. AIによる旅行プラン変更・再計算
9. 割り勘・経費管理(Phase 3)
10. テスト
11. Docker化・AWSデプロイ

### CLI Coding Agentとの分担

人間が決める: 目的 / 要件 / DB設計 / 責務分担 / Tool仕様 / 計算ルール / テスト方針

Agentに任せる: コード実装 / テストコード / リファクタリング / エラー修正 / ドキュメント

フロー: 設計 → Agentに実装方針を確認 → 人間が承認 → Agentが実装 → テスト → 人間がレビュー

---

## メモ(将来的な拡張)

- 複数人による共同編集
- レシート画像からの経費登録
- 天気に応じたプラン変更
- 予約サービス連携
- 公共交通機関を含む経路検索(専用Routing API)
- OSMnxによる徒歩・自転車・自動車の経路計算
- ユーザーの好みに合わせたプラン生成
- LLM Providerの抽象化、ローカルLLM対応
- RAGによる独自データ活用

### AWS構成案(Phase 3で再検討)

```
Next.js → API Gateway → Lambda
                          ├ PostgreSQL
                          ├ OpenAI API
                          └ CloudWatch
```

- OpenAI APIキー等はSecret管理機能を利用し、コードやGitHubに保存しない
- 初期はサービスを増やしすぎずシンプルな構成を優先
- 注意: OSMnxはメモリ消費が大きくLambdaと相性が悪い。導入する場合は構成を再検討する
