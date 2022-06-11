import { UnidocReduction } from './UnidocReduction'

import { reduceToken } from './reduceToken'

/**
 *
 */
export function* expectToken(): UnidocReduction<string> {
  const result: string | null = yield* reduceToken()

  if (result == null) {
    throw new Error(`Expected token, but received ${(yield UnidocReduction.CURRENT).toString()}.`)
  }

  return result
}