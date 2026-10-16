# UI のルール

フロントの見た目の決まりごと。値の正は `frontend/src/index.css`(`@theme`)と `frontend/src/lib/ui.ts`。この文書と食い違ったらコードに合わせて直す。

## 基本の考え方

- 文字は **黒 → グレー → 白** のグレースケールで強弱をつける。色で意味を持たせるのは primary / secondary だけ
- 文字サイズ・余白・アイコンは **決めた段階だけ** を使う。任意の px 指定(`text-[13px]` など)は書かない
- 部品(`components/ui`)にスタイルを集め、画面側でクラスを足さない

## 色

### 文字色(`text-fg-*`)

| トークン | 値 | 用途 |
|---|---|---|
| `fg-strong` | `#15181d` | 見出し、KPI の数字、場所名、時刻 |
| `fg` | `#343a40` | 本文(既定) |
| `fg-muted` | `#6b7280` | 補足、ラベル、日付、サブタイトル |
| `fg-subtle` | `#9ca3af` | 出発時刻、移動時間、未選択のアイコン、区切り |
| `fg-inverse` | `#ffffff` | primary / secondary-dark の上の文字 |

### ブランド色

| トークン | 値 | 用途 |
|---|---|---|
| `primary` | `#fb8500` | CTA ボタン、予算の進捗バー、警告の文字と丸 |
| `primary-light` | `#ffb703` | 警告アイコン、primary の淡い地 |
| `secondary-dark` | `#023047` | ロゴ |
| `secondary` | `#219ebc` | カード見出しのアイコン、選択中、フォーカス、行程バー(移動)、完了の丸 |
| `secondary-light` | `#8ecae6` | 選択中・ホバーの淡い地、行程バー(滞在) |

地と枠線は Tailwind の `neutral`(`bg-neutral-50` / `border-neutral-200`)を使う。状態の色(成功 `emerald`、エラー `red`)は意味があるときだけ。

## 文字サイズ(`text-*`)

| トークン | サイズ / 行送り | 太さ | 用途 |
|---|---|---|---|
| `display` | 28 / 32 | semibold | KPI の数字(`tabular-nums`) |
| `heading` | 22 / 28 | semibold | 画面の見出し(h1) |
| `title` | 16 / 24 | semibold | カードの見出し、日付の区切り、ダイアログの見出し |
| `body` | 14 / 20 | regular / medium | 本文(既定)、入力欄、ボタン、ナビ |
| `small` | 12 / 16 | regular / medium | 補足、ラベル、バッジ(md)、sm ボタン |
| `caption` | 11 / 14 | semibold | バッジ(sm)、サイドバーのグループ見出し |

- 強調は太さ(`font-medium` / `font-semibold`)と `fg-strong` で行い、サイズを上げない
- 数字は `tabular-nums` で桁を揃える

## 余白

4px 刻み。使う段階は次の6つ。

| クラス | px | 用途 |
|---|---|---|
| `1` | 4 | small / caption の文字とアイコンの間 |
| `2` | 8 | body の文字とアイコンの間、バッジ同士、インラインの要素同士 |
| `3` | 12 | フォームの項目同士、関連する行同士、ボタンの横 padding |
| `4` | 16 | カードの内側 padding、カード内のブロック同士 |
| `5` | 20 | カード同士、画面のセクション同士 |
| `6` | 24 | 画面の左右 padding |

`.5` の段階(`gap-1.5` など)は使わない。例外はバッジ(sm)の縦 padding `py-0.5` だけ。

## アイコン

[lucide-react](https://lucide.dev/) を使い、サイズは `ICON` 定数(`frontend/src/lib/ui.ts`)で指定する。数値を直接書かない。

| 定数 | px | 用途 |
|---|---|---|
| `ICON.xs` | 12 | caption / バッジ(sm)の中 |
| `ICON.sm` | 14 | small の文字に並べる、sm ボタン、バッジ(md) |
| `ICON.md` | 16 | body の文字に並べる、ナビ、ボタン、アイコンボタン |
| `ICON.lg` | 20 | カード見出し、上部バー |

アイコンの色は並ぶ文字と同じトークンにする(文字が `fg-muted` ならアイコンも `fg-muted`)。

## 角丸と影

| 用途 | クラス |
|---|---|
| ボタン、入力欄、ナビの項目 | `rounded-xl` |
| カードの内側、ダイアログ | `rounded-2xl` |
| カードの外枠 | `rounded-[22px]` |
| バッジ、進捗バーの丸 | `rounded-full` |

影は薄く(`shadow-[0_1px_2px_rgba(0,0,0,0.04)]`)。浮かせるのはダイアログだけ(`shadow-xl`)。

## 部品

画面は `components/ui` と `components/layout` の部品を組み合わせて作る。画面側(`App.tsx` や `components/trip`)で見た目のクラスを直接書かない。

### ui

| 部品 | 役割 | サイズ・種類 |
|---|---|---|
| `Button` | 文字のボタン。`icon` で左にアイコン | size `sm`(28px, small 文字, ICON.sm) / `md`(36px, body 文字, ICON.md)。variant `primary` / `secondary`(既定) / `ghost` / `danger` |
| `IconButton` | アイコンだけのボタン。`label` 必須 | size `sm`(28px) / `md`(36px)。variant `ghost` / `danger` |
| `Badge` | 淡い地のピル。`icon` で左にアイコン | size `sm`(caption 文字, ICON.xs) / `md`(small 文字, ICON.sm)。tone `neutral` / `primary` / `secondary` / `mint` / `sky` / `brown` / `orange` |
| `Card` / `CardHeader` / `CardBody` | 白い一重のカード。見出しはタイトルと右側の操作だけ。アイコンは付けない | 本文の padding は `4`。カードの中にカードを置かない |
| `SideView` | 右から出るパネル。フォームや詳細に使う。モーダルは使わない | 幅 448px(`max-w-md`)。Esc と背景クリックで閉じる |
| `Field` / `Input` / `Select` | ラベル付きの入力欄 | 高さ 36px、body 文字 |
| `SegmentedControl` | 少数の選択肢の切り替え | small 文字 |
| `Stat` | KPI の数字。`unit` で単位、`note` で右の補足 | display 文字 |
| `SegmentBar` | 割合のバー。`HATCHED` で斜線の塗り | height `sm`(12px) / `md`(28px) |

### layout

| 部品 | 役割 |
|---|---|
| `AppShell` | サイドバー + 上部バー + 本文の枠。本文は `max-w-6xl`、左右 padding `6`、セクション間 `5` |
| `Sidebar` | 左の固定ナビゲーション。項目は `NavItem` |
| `TopBar` | 上部バー。パンくずと通知・ユーザー |
| `PageHeader` | 画面の見出し。タイトル、バッジ、`meta`(アイコン + 文字)、右側の操作 |

### 新しい部品を作るとき

- 同じ見た目が2箇所に出たら部品にする
- サイズは `sm` / `md` の2段階から始める。3段階目が要るまで増やさない
- 色・サイズ・余白はこの文書のトークンだけを使う
