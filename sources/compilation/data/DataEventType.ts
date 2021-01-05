export type DataEventType = number

export namespace DataEventType {
  /**
  *
  */
  export const MOVE: DataEventType = 0

  /**
  *
  */
  export const BACK: DataEventType = 1

  /**
  *
  */
  export const OBJECT: DataEventType = 2

  /**
  *
  */
  export const ARRAY: DataEventType = 3

  /**
  *
  */
  export const MAP: DataEventType = 4

  /**
  *
  */
  export const SWAP: DataEventType = 5

  /**
  *
  */
  export const SET: DataEventType = 6

  /**
  *
  */
  export const PUSH: DataEventType = 7

  /**
  *
  */
  export const PUBLISH: DataEventType = 8

  /**
  *
  */
  export const DEFAULT: DataEventType = MOVE

  /**
  *
  */
  export const ALL: DataEventType[] = [
    MOVE,
    BACK,
    OBJECT,
    ARRAY,
    MAP,
    SWAP,
    SET,
    PUSH,
    PUBLISH
  ]

  /**
  *
  */
  export function toString(value: DataEventType): string | undefined {
    switch (value) {
      case MOVE: return 'MOVE'
      case BACK: return 'BACK'
      case OBJECT: return 'OBJECT'
      case ARRAY: return 'ARRAY'
      case MAP: return 'MAP'
      case SWAP: return 'SWAP'
      case SET: return 'SET'
      case PUSH: return 'PUSH'
      case PUBLISH: return 'PUBLISH'
      default: return undefined
    }
  }

  /**
  *
  */
  export function toDebugString(value: DataEventType): string {
    return '#' + value + ' (' + (toString(value) || 'undefined') + ')'
  }
}
