/**
 * A class that describe an instance that can be cleared, namely, be reseted to a default state. 
 */
export interface Clearable {
  /**
   * Reset this instance to it's default state.
   *
   * @return This instance for chaining purposes.
   */
  clear(): this
}

/**
 * 
 */
export namespace Clearable {
  /**
   * Reset the given instance of a Clearable class to it's default state.
   * 
   * @param value - An instance to reset.
   * 
   * @return The given instance for chaining purposes.
   */
  export function clear<Target extends Clearable>(value: Target): Target {
    return value.clear()
  }
}