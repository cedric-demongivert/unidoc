/**
 * It is a class of objects that can be cleared, namely, reset to a default state. 
 */
export interface Clearable {
  /**
   * Reset this instance to its default state.
   *
   * @return A reference to this instance for chaining purposes.
   */
  clear(): this
}

/**
 * 
 */
export namespace Clearable {
  /**
   * It reset the given clearable instance to its default state.
   * 
   * @param value - A clearable instance to reset.
   * 
   * @return A reference to this instance for chaining purposes.
   */
  export function clear<Target extends Clearable>(value: Target): Target {
    return value.clear()
  }
}