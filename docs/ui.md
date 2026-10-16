# UI のルール

フロントの見た目の決まりごと。値の正は `frontend/src/index.css`(`@theme`)と `frontend/src/lib/ui.ts`。この文書と食い違ったらコードに合わせて直す。

## 基本の考え方

- **面は一つ。** 地は白で、領域を枠線・影・背景色の違いで作らない。区切りは余白、次に水平の罫線(`border-t border-neutral-200`)。例外は SideView(影)と行のホバー地(`bg-neutral-50`)だけ
- **階層はサイズ・色・字間で作る。** 游ゴシックは macOS では Medium / Bold の2ウェイトしか無いため、太さで強弱をつけない。`font-medium` / `font-semibold` は使わない。`font-bold` は行内で1語を強調するときだけ
- **主役は一つ。** 画面で最大の文字は h1(旅行名)だけ。数字を大きく見せる用途(KPI)は無い。primary の塗りは画面に1つの主ボタンだけ
- **文字で言えることにアイコンを添えない。** カレンダー + 日付、時計 + 時刻は禁止。アイコンは操作(ボタン)と状態(警告・完了)にだけ使う
- **開発者向けの文言を UI に出さない。** モック・Phase・未登録・タイムゾーン ID・サンプル注記は画面の主要部に置かない(画面最下部の caption 1行まで)
- **同じ情報・同じ操作を1画面に2回出さない。** 0 や未設定は行ごと出さない
- **入力欄を常時表示しない。** 表示 → クリックで編集(`InlineEdit`)を標準にする
- **決めた段階だけを使う。** 任意の px 指定(`text-[13px]` など)、`.5` の余白、数値直書きのアイコンサイズは書かない
- **部品にスタイルを集める。** 画面側(`App.tsx`、`components/trip`)で見た目のクラスを書かない。同じ見た目が2箇所に出たら部品にする

## 色

### 文字色(`text-fg-*`)

黒 → グレー → 白のグレースケール。

| トークン | 値 | 用途 |
|---|---|---|
| `fg-strong` | `#15181d` | 場所名、ファクト行の値、入力した文字 |
| `fg` | `#343a40` | 本文(既定) |
| `fg-muted` | `#6b7280` | 補足、ラベル、時刻、カテゴリ、ghost ボタン |
| `fg-subtle` | `#9ca3af` | 出発時刻、移動時間、placeholder、未選択のアイコン |
| `fg-inverse` | `#ffffff` | primary / secondary の塗りの上 |

### ブランド色

| トークン | 値 | 用途 |
|---|---|---|
| `primary` | `#fb8500` | 画面に1つの主ボタン。警告の文字とレールの丸。予算の超過 |
| `primary-light` | `#ffb703` | primary の淡い地(Badge `primary`) |
| `secondary-dark` | `#023047` | 見出し(h1・日付・SideView)、ワードマーク、選択中のナビ、入力のフォーカス線、日のマーカー |
| `secondary` | `#219ebc` | 完了の丸、予算バー |
| `secondary-light` | `#8ecae6` | 選択中・ホバーの淡い地(Badge `secondary`) |

- 地と罫線は Tailwind の `neutral`。罫線は `neutral-200`、入力の下線は `neutral-300`、ホバー地は `neutral-50`、無効の塗りは `neutral-300`
- 透過は `/20` と `/30` の2段階だけ(`primary-light/20`、`secondary-light/30`、暗幕 `fg-strong/20`)
- 状態の色(エラー `red-600`)は意味があるときだけ。カテゴリは色で分けず、文字で示す

## 文字サイズ(`text-*`)

| トークン | サイズ / 行送り | 字間 | 用途 |
|---|---|---|---|
| `display` | 40 / 48 | -0.01em | 旅行名(h1)。画面に1つ |
| `heading` | 24 / 32 | 0 | 日付の区切り、SideView の見出し |
| `title` | 18 / 28 | 0 | ファクト行の値、場所名、md の入力欄、ワードマーク |
| `body` | 14 / 22 | 0.01em | 本文(既定)、時刻、ボタン、sm の入力欄 |
| `small` | 12 / 18 | 0.02em | 補足、ラベル、カテゴリ、移動時間、警告、ナビ、sm ボタン、Badge(md) |
| `caption` | 11 / 16 | 0.04em | 出発時刻、日のマーカーの数字、Badge(sm)、画面最下部の注記 |

- 数字は `tabular-nums` で桁を揃える
- 見出し(`display` / `heading`)の色は `secondary-dark`

## 余白

4px 刻み。使う段階は次のとおり。

| クラス | px | 用途 |
|---|---|---|
| `1` | 4 | small / caption の文字とアイコンの間、タイムライン行内の段落間 |
| `2` | 8 | body の文字とアイコンの間、インラインの要素同士、ラベルと入力の間 |
| `3` | 12 | 関連する行同士、ボタンの横 padding(sm) |
| `4` | 16 | タイムライン行の縦 padding、見出し下のメタ行 |
| `6` | 24 | 画面の左右 padding(〜lg)、ボタンの横 padding(md)、ナビの項目間 |
| `8` | 32 | セクション内のブロック同士(ファクト行の縦 padding、フォームの項目間、ヒーローの操作行) |
| `10` | 40 | SideView の内側 padding |
| `12` | 48 | セクション同士(ヒーロー / ファクト行 / タイムライン)、日付の区切りの上 |
| `16` | 64 | 画面の左右 padding(lg 以上)、本文の上 |
| `24` | 96 | 本文の下 |

- `.5` の段階は使わない。例外は Badge(sm)の縦 padding `py-0.5` と、レール・予算バーの線幅 `w-px` / `h-0.5` だけ
- 本文幅はページ `max-w-5xl`、読む領域(タイムライン・h1)は `max-w-3xl`

## アイコン

[lucide-react](https://lucide.dev/) を使い、サイズは `ICON` 定数(`frontend/src/lib/ui.ts`)で指定する。数値を直接書かない。

| 定数 | px | 用途 |
|---|---|---|
| `ICON.xs` | 12 | Badge(sm)の中、丸の中のチェック |
| `ICON.sm` | 14 | small の文字に並べる(警告)、sm の部品 |
| `ICON.md` | 16 | body の文字に並べる、md の部品、Select の矢印 |
| `ICON.lg` | 20 | SideView の閉じる、空状態 |

- 線幅は `STROKE` 定数。既定 2、Badge の中 2.5、丸の中のチェック 3
- アイコンの色は並ぶ文字と同じトークンにする

## 角丸と影

| 用途 | クラス |
|---|---|
| ボタン、アイコンボタン、行のホバー地、InlineEdit | `rounded-lg` |
| Badge、レールの丸、日のマーカー | `rounded-full` |
| 入力欄 | `rounded-none`(下線型) |

`rounded-lg` が最大。`xl` / `2xl` は使わない。影は SideView の `shadow-xl` だけ。

## フォーカス

フォーカス可能な部品はすべて `FOCUS_RING`(`focus-visible:outline-2 outline-offset-2 outline-secondary`)を使う。入力欄は下線が `secondary-dark` に変わる。`focus:outline-none` は書かない。

## 部品

画面は `components/ui` と `components/layout` の部品を組み合わせて作る。

### prop 名の規約

- 大きさは `size`(`'sm' | 'md'`、型は `lib/ui.ts` の `Size`)
- 構造・役割の違いは `variant`、色だけの違いは `tone`(型は `Tone`)
- アイコンは `icon: LucideIcon`。アイコンだけの部品は `label` 必須
- `Size` / `Tone` などトークン由来の型は `lib/ui.ts` に置く。`lib` から `components` を import しない

### ui

| 部品 | 役割 | サイズ・種類(既定) |
|---|---|---|
| `Button` | 文字のボタン。`icon` で左にアイコン | size `sm`(28px) / `md`(44px、既定)。variant `primary` / `secondary`(既定) / `ghost` / `danger`。影なし |
| `IconButton` | アイコンだけのボタン。`label` 必須 | size `sm`(28px、既定) / `md`(44px)。variant `ghost`(既定) / `danger` |
| `Badge` | 淡い地のピル | size `sm`(既定) / `md`。tone `neutral`(既定) / `primary` / `secondary` |
| `Field` / `Input` / `Select` / `FieldRow` | ラベル・補足・エラー付きの入力欄。下線型。`Field` が id と aria を結ぶ | Input / Select の size `sm`(28px, body) / `md`(44px, title、既定) |
| `Form` / `FormActions` | 項目を `8` で縦に並べるフォームと、下端の操作(左キャンセル・右送信) | |
| `SideView` | 右から出るパネル。ネイティブ `<dialog>` でフォーカス移動・戻し・閉じ込め・背景無効化・Esc を得る | 幅 512px(`max-w-lg`)。影を使う唯一の部品 |
| `SegmentedControl` | 少数の選択肢の切り替え(下線タブ)。`label` 必須 | |
| `InlineEdit` | 表示 → クリックで数値入力。Enter / blur 確定、Esc 取り消し | |
| `FactList` | 上下の罫線で挟んだ事実の並び(ラベル / 値 / 補足) | |

### layout

| 部品 | 役割 |
|---|---|
| `AppShell` | 1行の上部バー(ワードマークとテキストのナビ)と本文の枠。本文は `max-w-5xl`、`pt-16 pb-24 space-y-12` |
| `PageHeader` | ヒーロー。h1(`display`)、アイコン無しのメタ行、その下の操作(primary は1つ) |

### trip(画面固有)

| 部品 | 役割 |
|---|---|
| `TripFacts` | 期間 / 行程 / 予算 / 注意の `FactList`。注意の件数を押すと最初の警告行へ移動 |
| `Timeline` | レールに沿った旅程。日付は `heading`、場所名は `title`、滞在は `InlineEdit`、警告は `primary` の文字と丸 |
| `TripEditForm` / `AddPlaceForm` | SideView の中のフォーム |

### 新しい部品を作るとき

- 同じ見た目が2箇所に出たら部品にする
- サイズは `sm` / `md` の2段階から始める。3段階目が要るまで増やさない
- 色・サイズ・余白はこの文書のトークンだけを使う

## 状態と計算(frontend)

- `tripPlaces` は常に `visit_order` 昇順で、配列の index + 1 === `visit_order`。順序を変えるのは `lib/tripState.ts` の reducer だけで、変更後は必ず `reorder()` を通す。`buildTimeline` は配列順を信頼する
- `buildTimeline` の警告は種類(`Warning.kind`)で返し、文面は `lib/format.ts` の `warningLabel` で作る。表示文字列を計算層に持ち込まない
- 数値の入力は下書き state を持ち、確定は blur / Enter(`InlineEdit`)。空文字を 0 として書き戻さない
- 日時は表示タイムゾーン基準で変換し(`toLocalInputValue` / `fromLocalInputValue`)、オフセットを固定値で書かない
