/**
 * A set of empty constants to use as default values.
 */
export namespace Empty {
  /**
   * An empty string.
   */
  export const STRING: string = ''

  /**
   * An empty numerical value.
   */
  export const NUMBER: number = 0

  /**
   * An empty function.
   */
  export const callback = Object.freeze(
    function callback(): void {

    }
  )

  /**
   * An empty array.
   */
  export const ARRAY: readonly any[] = Object.freeze([])

  /**
   * An empty object.
   */
  export const OBJECT: Readonly<{}> = Object.freeze({})
}