import { assertEndOfAnyTag } from './assertEndOfAnyTag'
import { assertStart } from './assertStart'
import { assertStartOfAnyTag } from './assertStartOfAnyTag'
import { assertTermination } from './assertTermination'
import { expectToken } from './expectToken'
import { skipWhitespaces } from './skipWhitespaces'

import { UnidocReduction } from './UnidocReduction'

/**
*
*/
export function* expectTokenTag(): UnidocReduction<string | null> {
  yield* assertStart()
  yield UnidocReduction.NEXT

  yield* assertStartOfAnyTag()
  yield UnidocReduction.NEXT

  const result: string = yield* expectToken()

  yield* skipWhitespaces()

  yield* assertEndOfAnyTag()
  yield UnidocReduction.NEXT

  yield* assertTermination()
  yield UnidocReduction.NEXT

  return result
}