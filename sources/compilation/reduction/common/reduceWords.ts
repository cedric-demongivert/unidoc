import { UnidocReductionInput } from '../UnidocReductionInput'
import { UnidocReductionRequest } from '../UnidocReductionRequest'

import { UnidocReducer } from '../UnidocReducer'

/**
*
*/
const EMPTY_STRING: string = ''

/**
*
*/
export function* reduceWords(): UnidocReducer<string | undefined> {
  let result: string
  let current: UnidocReductionInput = yield UnidocReductionRequest.CURRENT

  if (current.isStart()) {
    current = yield UnidocReductionRequest.NEXT

    if (current.isEnd()) {
      return EMPTY_STRING
    }
  }

  if (current.isAnyWord()) {
    result = current.event.text
  } else {
    return undefined
  }

  current = yield UnidocReductionRequest.NEXT

  while (current.isAnyWord()) {
    result += current.event.text
    current = yield UnidocReductionRequest.NEXT
  }

  return result
}
