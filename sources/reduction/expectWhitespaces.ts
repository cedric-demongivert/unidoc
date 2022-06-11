import { UnidocReduction } from './UnidocReduction'

import { reduceWhitespaces } from './reduceWhitespaces'

/**
 *
 */
export function* expectWhitespaces(): UnidocReduction<string> {
  const result: string | null = yield* reduceWhitespaces()

  if (result == null) {
    throw new Error(`Expected whitespaces, but received ${(yield UnidocReduction.CURRENT).toString()}.`)
  }

  return result
}