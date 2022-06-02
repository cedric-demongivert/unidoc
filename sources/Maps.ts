import { equals as toEquals } from '@cedric-demongivert/gl-tool-utils'

/**
 * 
 */
export namespace Maps {
  /**
   * 
   */
  export function move(from: Map<unknown, unknown>, to: Map<unknown, unknown>): Map<unknown, unknown> {
    to.clear()
    for (const [key, value] of from) to.set(key, value)
    return to
  }

  /**
   * 
   */
  export function equals(left: Map<unknown, unknown>, right: Map<unknown, unknown>): boolean {
    if (left.size !== right.size) return false

    for (const [key, value] of left) {
      if (!toEquals(right.get(key), value)) {
        return false
      }
    }

    return true
  }
}