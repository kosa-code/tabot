/**
 * UI のトークン由来の定数と型。docs/ui.md のルールに従う。
 * lib は components を import しない。型はここに置き、部品側が参照する。
 */

/** 部品の大きさ。sm = 28px / md = 36px */
export type Size = 'sm' | 'md'

/** 色だけが違うときの区分。意味色は primary / secondary のみ */
export type Tone = 'neutral' | 'primary' | 'secondary'

/**
 * アイコンのサイズ。
 * xs: caption / バッジ(sm) の中
 * sm: small の文字に並べる、sm の部品
 * md: body の文字に並べる、ナビ、md の部品
 * lg: 上部バーなど単独で置くとき
 */
export const ICON = { xs: 12, sm: 14, md: 16, lg: 20 } as const

/** アイコンの線幅。既定 2、バッジの中 2.5、丸の中のチェック 3 */
export const STROKE = { default: 2, badge: 2.5, check: 3 } as const

/** フォーカス可能な部品はすべてこれを使う。focus:outline-none は書かない */
export const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary'

/** size に対応するアイコンサイズ */
export function iconSize(size: Size): number {
  return size === 'sm' ? ICON.sm : ICON.md
}
