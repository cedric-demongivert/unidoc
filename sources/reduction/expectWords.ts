import { UnidocReduction } from './UnidocReduction'

import { reduceWords } from './reduceWords'

/**
 *
 */
export function* expectWords(): UnidocReduction<string> {
  const result: string | null = yield* reduceWords()

  if (result == null) {
    throw new Error(`Expected words, but received ${(yield UnidocReduction.CURRENT).toString()}.`)
  }

  return result
}