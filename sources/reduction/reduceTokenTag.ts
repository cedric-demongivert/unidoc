import { UTF32String } from '../symbol'
import { assertEndOfAnyTag } from './assertEndOfAnyTag'
import { assertStart } from './assertStart'
import { assertStartOfAnyTag } from './assertStartOfAnyTag'
import { assertTermination } from './assertTermination'
import { reduceToken } from './reduceToken'
import { skipWhitespaces } from './skipWhitespaces'

import { UnidocReduction } from './UnidocReduction'

/**
*
*/
export function* reduceTokenTag(): UnidocReduction<string | null> {
  yield* assertStart()
  yield UnidocReduction.NEXT

  yield* assertStartOfAnyTag()
  yield UnidocReduction.NEXT

  const result: string | null = yield* reduceToken()

  yield* skipWhitespaces()

  yield* assertEndOfAnyTag()
  yield UnidocReduction.NEXT

  yield* assertTermination()

  return result
}