import { UnidocReduction } from './UnidocReduction'
import { reduceText } from './reduceText'

/**
 *
 */
export function* expectText(): UnidocReduction<string> {
  const result: string | null = yield* reduceText()

  if (result == null) {
    throw new Error(`Expected text, but received ${(yield UnidocReduction.CURRENT).toString()}.`)
  }

  return result
}