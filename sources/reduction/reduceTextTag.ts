import { assertEndOfAnyTag } from './assertEndOfAnyTag'
import { assertStart } from './assertStart'
import { assertStartOfAnyTag } from './assertStartOfAnyTag'
import { assertTermination } from './assertTermination'
import { reduceText } from './reduceText'
import { skipWhitespaces } from './skipWhitespaces'

import { UnidocReduction } from './UnidocReduction'

/**
*
*/
export function* reduceTextTag(): UnidocReduction<string | null> {
  yield* assertStart()
  yield UnidocReduction.NEXT

  yield* assertStartOfAnyTag()
  yield UnidocReduction.NEXT

  const result: string | null = yield* reduceText()

  yield* assertEndOfAnyTag()
  yield UnidocReduction.NEXT

  yield* assertTermination()
  yield UnidocReduction.NEXT

  return result
}