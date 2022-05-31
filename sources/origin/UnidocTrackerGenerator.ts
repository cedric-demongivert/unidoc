import { UTF32CodeUnit, UTF32String, UTF16String } from "../symbol"

import { UnidocLocation } from "./UnidocLocation"
import { UnidocTracker } from "./UnidocTracker"

/**
 * 
 */
export type UnidocTrackerGenerator = Generator<UnidocLocation, never, string | UTF32CodeUnit | UTF32String | UTF16String | undefined>

/**
 * 
 */
export namespace UnidocTrackerGenerator {
  /**
   * 
   */
  export function create(column: number = 0, line: number = 0, index: number = 0): UnidocTrackerGenerator {
    return from(UnidocTracker.create(column, line, index))
  }

  /**
   * 
   */
  export function* from(tracker: UnidocTracker): UnidocTrackerGenerator {
    let next: string | UTF32CodeUnit | UTF32String | UTF16String | undefined = yield tracker.location

    while (true) {
      while (next == null) {
        next = yield tracker.location
      }

      if (typeof next === 'string') {
        tracker.nextString(next)
      } else if (next instanceof UTF32String) {
        tracker.nextUTF32String(next)
      } else if (next instanceof UTF16String) {
        tracker.nextUTF16String(next)
      } else {
        tracker.next(next)
      }

      next = yield tracker.location
    }
  }
}
