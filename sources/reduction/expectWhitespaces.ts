import { UnidocReduction } from './UnidocReduction'

import { reduceWhitespaces } from './reduceWhitespaces'
import { fail } from './fail'

/**
 *
 */
export function* expectWhitespaces(): UnidocReduction<string> {
  const result: string | null = yield* reduceWhitespaces()

  if (result == null) {
    return yield* fail('expected whitespaces.')
  }

  return result
}