import { UTF32CodeUnit, UTF32String, UTF16String } from "../symbol"

import { UnidocLocation } from "./UnidocLocation"
import { UnidocTracker } from "./UnidocTracker"

/**
 * 
 */
export type UnidocTrackerFunction = (next?: string | UTF32CodeUnit | UTF32String | UTF16String) => UnidocLocation

/**
 * 
 */
export namespace UnidocTrackerFunction {
  /**
   * 
   */
  export function create(column: number = 0, line: number = 0, index: number = 0): UnidocTrackerFunction {
    return from(UnidocTracker.create(column, line, index))
  }

  /**
   * 
   */
  export function from(tracker: UnidocTracker): UnidocTrackerFunction {
    return function unidocTrackerFunction(next?: string | UTF32CodeUnit | UTF32String | UTF16String): UnidocLocation {
      if (next == null) {
        return tracker.location
      } else if (typeof next === 'string') {
        tracker.nextString(next)
      } else if (next instanceof UTF32String) {
        tracker.nextUTF32String(next)
      } else if (next instanceof UTF16String) {
        tracker.nextUTF16String(next)
      } else {
        tracker.next(next)
      }

      return tracker.location
    }
  }
}
