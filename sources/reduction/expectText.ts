import { UnidocReduction } from './UnidocReduction'

import { reduceText } from './reduceText'
import { fail } from './fail'

/**
 *
 */
export function* expectText(): UnidocReduction<string> {
  const result: string | null = yield* reduceText()

  if (result == null) {
    return yield* fail('expected text.')
  }

  return result
}