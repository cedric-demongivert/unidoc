export type UnidocSourceReaderState = number

export namespace UnidocSourceReaderState {
  export const SYMBOL  : UnidocSourceReaderState = 0
  export const RETURN  : UnidocSourceReaderState = 1

  export const DEFAULT : UnidocSourceReaderState = SYMBOL

  export const ALL : UnidocSourceReaderState[] = [
    SYMBOL,
    RETURN
  ]

  export function toString (value : UnidocSourceReaderState) : string | undefined {
    switch (value) {
      case SYMBOL  : return 'SYMBOL'
      case RETURN  : return 'RETURN'
      default      : return undefined
    }
  }

  export function throwUnhandledState (value : number) : void {
    throw new Error(
      'Unhandled or unknown unidoc source reader state ' + value +
      ' "' + toString(value) + '".'
    )
  }
}
