import { UnidocReducer } from './UnidocReducer'

import { UnidocReductionRequest } from './UnidocReductionRequest'
import { UnidocReductionInput } from './UnidocReductionInput'

import { skipWhitespaces } from './skipWhitespaces'
import { reduceWords } from './reduceWords'
import { reduceEvents } from './reduceEvents'

const EMPTY_STRING: string = ''

/**
*
*/
function* reduceEventsToToken(): UnidocReducer<string | undefined> {
  let current: UnidocReductionInput = yield UnidocReductionRequest.CURRENT

  if (current.isStart()) {
    current = yield UnidocReductionRequest.NEXT

    if (current.isEnd()) {
      return EMPTY_STRING
    }
  }

  if (current.isWhitespace() || current.isAnyWord()) {
    yield* skipWhitespaces()
    return (yield* reduceWords()) || EMPTY_STRING
  }

  return undefined
}

/**
*
*/
export function reduceToken(): UnidocReducer<string | undefined> {
  return reduceEvents(reduceEventsToToken())
}
