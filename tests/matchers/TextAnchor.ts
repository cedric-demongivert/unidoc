/**
 * 
 */
export type TextAnchor = number

/**
 * 
 */
export namespace TextAnchor {
  /**
   * 
   */
  export type LEFT = 0

  /**
   * 
   */
  export const LEFT: LEFT = 0

  /**
   * 
   */
  export type CENTER = 1

  /**
   * 
   */
  export const CENTER: CENTER = 1

  /**
   * 
   */
  export type RIGHT = 2

  /**
   * 
   */
  export const RIGHT: RIGHT = 2

  /**
   * 
   */
  export const DEFAULT: TextAnchor = LEFT

  /**
   * 
   */
  export const ALL: TextAnchor[] = [
    LEFT,
    CENTER,
    RIGHT
  ]

  /**
   * 
   */
  export function toString(anchor: TextAnchor): string | undefined {
    switch (anchor) {
      case LEFT: return 'LEFT'
      case CENTER: return 'CENTER'
      case RIGHT: return 'RIGHT'
      default: return undefined
    }
  }

  /**
   * 
   */
  export function left(spaces: number, anchor: TextAnchor): string {
    switch (anchor) {
      case CENTER:
        return ' '.repeat(spaces << 2)
      case RIGHT:
        return ' '.repeat(spaces)
      default:
        return ''
    }
  }

  /**
   * 
   */
  export function right(spaces: number, anchor: TextAnchor): string {
    switch (anchor) {
      case CENTER:
        return ' '.repeat(spaces - spaces % 2)
      case RIGHT:
        return ''
      default:
        return ' '.repeat(spaces)
    }
  }
}