import { UnidocReduction } from './UnidocReduction'

import { reduceToken } from './reduceToken'
import { fail } from './fail'

/**
 *
 */
export function* expectToken(): UnidocReduction<string> {
  const result: string | null = yield* reduceToken()

  if (result == null) {
    return yield* fail('expected token.')
  }

  return result
}