import { assertEndOfAnyTag } from './assertEndOfAnyTag'
import { assertStart } from './assertStart'
import { assertStartOfAnyTag } from './assertStartOfAnyTag'
import { assertTermination } from './assertTermination'
import { expectText } from './expectText'
import { skipWhitespaces } from './skipWhitespaces'

import { UnidocReduction } from './UnidocReduction'

/**
*
*/
export function* expectTextTag(): UnidocReduction<string | null> {
  yield* assertStart()
  yield UnidocReduction.NEXT

  yield* assertStartOfAnyTag()
  yield UnidocReduction.NEXT

  const result: string = yield* expectText()

  yield* skipWhitespaces()

  yield* assertEndOfAnyTag()
  yield UnidocReduction.NEXT

  yield* assertTermination()
  yield UnidocReduction.NEXT

  return result
}