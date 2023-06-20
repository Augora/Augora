declare namespace Color {
  interface RGB {
    /** Format "rgb(100, 100, 100)" ou rgba(...m 100%) */
    Full?: string
    R: number
    G: number
    B: number
    A?: number | undefined
  }

  interface HSL {
    /** Format "hsl(255, 100%, 100%)" ou hsla(...) */
    Full?: string
    H: number
    S: number
    L: number
    A?: number | undefined
  }

  type HEX = string

  interface All {
    HSL: HSL
    RGB: RGB
    HEX: HEX
  }

  type Any = HSL | HEX | RGB
}
