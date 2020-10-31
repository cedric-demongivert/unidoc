export type CodePoint = number

export namespace CodePoint {
  export const MINUS           : CodePoint = '-'.codePointAt(0) as CodePoint
  export const SHARP           : CodePoint = '#'.codePointAt(0) as CodePoint
  export const DOT             : CodePoint = '.'.codePointAt(0) as CodePoint
  export const ANTISLASH       : CodePoint = '\\'.codePointAt(0) as CodePoint
  export const OPENING_BRACE   : CodePoint = '{'.codePointAt(0) as CodePoint
  export const CLOSING_BRACE   : CodePoint = '}'.codePointAt(0) as CodePoint
  export const ZERO            : CodePoint = '0'.codePointAt(0) as CodePoint
  export const ONE             : CodePoint = '1'.codePointAt(0) as CodePoint
  export const TWO             : CodePoint = '2'.codePointAt(0) as CodePoint
  export const THREE           : CodePoint = '3'.codePointAt(0) as CodePoint
  export const FOUR            : CodePoint = '4'.codePointAt(0) as CodePoint
  export const FIVE            : CodePoint = '5'.codePointAt(0) as CodePoint
  export const SIX             : CodePoint = '6'.codePointAt(0) as CodePoint
  export const SEVEN           : CodePoint = '7'.codePointAt(0) as CodePoint
  export const EIGHT           : CodePoint = '8'.codePointAt(0) as CodePoint
  export const NINE            : CodePoint = '9'.codePointAt(0) as CodePoint
  export const NEW_LINE        : CodePoint = '\n'.codePointAt(0) as CodePoint
  export const CARRIAGE_RETURN : CodePoint = '\r'.codePointAt(0) as CodePoint
  export const TABULATION      : CodePoint = '\t'.codePointAt(0) as CodePoint
  export const FORM_FEED       : CodePoint = '\f'.codePointAt(0) as CodePoint
  export const DOUBLE_QUOTE    : CodePoint = '"'.codePointAt(0) as CodePoint
  export const SPACE           : CodePoint = ' '.codePointAt(0) as CodePoint
  export const a               : CodePoint = 'a'.codePointAt(0) as CodePoint
  export const b               : CodePoint = 'b'.codePointAt(0) as CodePoint
  export const c               : CodePoint = 'c'.codePointAt(0) as CodePoint
  export const d               : CodePoint = 'd'.codePointAt(0) as CodePoint
  export const e               : CodePoint = 'e'.codePointAt(0) as CodePoint
  export const f               : CodePoint = 'f'.codePointAt(0) as CodePoint
  export const g               : CodePoint = 'g'.codePointAt(0) as CodePoint
  export const h               : CodePoint = 'h'.codePointAt(0) as CodePoint
  export const i               : CodePoint = 'i'.codePointAt(0) as CodePoint
  export const j               : CodePoint = 'j'.codePointAt(0) as CodePoint
  export const k               : CodePoint = 'k'.codePointAt(0) as CodePoint
  export const l               : CodePoint = 'l'.codePointAt(0) as CodePoint
  export const m               : CodePoint = 'm'.codePointAt(0) as CodePoint
  export const n               : CodePoint = 'n'.codePointAt(0) as CodePoint
  export const o               : CodePoint = 'o'.codePointAt(0) as CodePoint
  export const p               : CodePoint = 'p'.codePointAt(0) as CodePoint
  export const q               : CodePoint = 'q'.codePointAt(0) as CodePoint
  export const r               : CodePoint = 'r'.codePointAt(0) as CodePoint
  export const s               : CodePoint = 's'.codePointAt(0) as CodePoint
  export const t               : CodePoint = 't'.codePointAt(0) as CodePoint
  export const u               : CodePoint = 'u'.codePointAt(0) as CodePoint
  export const v               : CodePoint = 'v'.codePointAt(0) as CodePoint
  export const w               : CodePoint = 'w'.codePointAt(0) as CodePoint
  export const x               : CodePoint = 'x'.codePointAt(0) as CodePoint
  export const y               : CodePoint = 'y'.codePointAt(0) as CodePoint
  export const z               : CodePoint = 'z'.codePointAt(0) as CodePoint
  export const A               : CodePoint = 'A'.codePointAt(0) as CodePoint
  export const B               : CodePoint = 'B'.codePointAt(0) as CodePoint
  export const C               : CodePoint = 'C'.codePointAt(0) as CodePoint
  export const D               : CodePoint = 'D'.codePointAt(0) as CodePoint
  export const E               : CodePoint = 'E'.codePointAt(0) as CodePoint
  export const F               : CodePoint = 'F'.codePointAt(0) as CodePoint
  export const G               : CodePoint = 'G'.codePointAt(0) as CodePoint
  export const H               : CodePoint = 'H'.codePointAt(0) as CodePoint
  export const I               : CodePoint = 'I'.codePointAt(0) as CodePoint
  export const J               : CodePoint = 'J'.codePointAt(0) as CodePoint
  export const K               : CodePoint = 'K'.codePointAt(0) as CodePoint
  export const L               : CodePoint = 'L'.codePointAt(0) as CodePoint
  export const M               : CodePoint = 'M'.codePointAt(0) as CodePoint
  export const N               : CodePoint = 'N'.codePointAt(0) as CodePoint
  export const O               : CodePoint = 'O'.codePointAt(0) as CodePoint
  export const P               : CodePoint = 'P'.codePointAt(0) as CodePoint
  export const Q               : CodePoint = 'Q'.codePointAt(0) as CodePoint
  export const R               : CodePoint = 'R'.codePointAt(0) as CodePoint
  export const S               : CodePoint = 'S'.codePointAt(0) as CodePoint
  export const T               : CodePoint = 'T'.codePointAt(0) as CodePoint
  export const U               : CodePoint = 'U'.codePointAt(0) as CodePoint
  export const V               : CodePoint = 'V'.codePointAt(0) as CodePoint
  export const W               : CodePoint = 'W'.codePointAt(0) as CodePoint
  export const X               : CodePoint = 'X'.codePointAt(0) as CodePoint
  export const Y               : CodePoint = 'Y'.codePointAt(0) as CodePoint
  export const Z               : CodePoint = 'Z'.codePointAt(0) as CodePoint
  export const COLON           : CodePoint = ':'.codePointAt(0) as CodePoint
  export const SEMICOLON       : CodePoint = ';'.codePointAt(0) as CodePoint

  export function isDecimalDigit (symbol : CodePoint) : boolean {
    return symbol >= ZERO && symbol <= NINE
  }

  export function isBinaryDigit (symbol : CodePoint) : boolean {
    return symbol === ZERO || symbol === ONE
  }

  export function isHexadecimalDigit (symbol : CodePoint) : boolean {
    return symbol >= ZERO && symbol <= NINE ||
           symbol >= A && symbol <= F ||
           symbol >= a && symbol <= f
  }

  export function isWhitespace (symbol : CodePoint) : boolean {
    switch (symbol) {
      case CodePoint.CARRIAGE_RETURN:
      case CodePoint.NEW_LINE:
      case CodePoint.FORM_FEED:
      case CodePoint.TABULATION:
      case CodePoint.SPACE:
        return true
      default:
        return false
    }
  }

  export function toDebugString (symbol : CodePoint) : string {
    switch (symbol) {
      case CodePoint.CARRIAGE_RETURN : return ':r'
      case CodePoint.NEW_LINE        : return ':n'
      case CodePoint.FORM_FEED       : return ':f'
      case CodePoint.TABULATION      : return ':t'
      case CodePoint.SPACE           : return ':s'
      default                        : return String.fromCodePoint(symbol)
    }
  }
}
