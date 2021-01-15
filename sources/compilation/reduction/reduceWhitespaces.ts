import { UnidocReductionInput } from './UnidocReductionInput'
import { UnidocReductionRequest } from './UnidocReductionRequest'

import { UnidocReducer } from './UnidocReducer'

/**
*
*/
export const EMPTY_STRING = ''

/**
*
*/
export function* reduceWhitespaces(): UnidocReducer<string | undefined> {
  let result: string
  let current: UnidocReductionInput = yield UnidocReductionRequest.CURRENT

  if (current.isStart()) {
    current = yield UnidocReductionRequest.NEXT

    if (current.isEnd()) {
      return EMPTY_STRING
    }
  }

  if (current.isWhitespace()) {
    result = current.event.text
  } else {
    return undefined
  }

  current = yield UnidocReductionRequest.NEXT

  while (current.isWhitespace()) {
    result += current.event.text
    current = yield UnidocReductionRequest.NEXT
  }

  return result
}
