import { UnidocReduction } from './UnidocReduction'

import { reduceWords } from './reduceWords'
import { fail } from './fail'

/**
 *
 */
export function* expectWords(): UnidocReduction<string> {
  const result: string | null = yield* reduceWords()

  if (result == null) {
    return yield* fail('expected words.')
  }

  return result
}