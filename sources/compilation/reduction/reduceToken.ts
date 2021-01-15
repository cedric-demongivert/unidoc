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
function* reduceEventsToToken(): UnidocReducer<string> {
  let current: UnidocReductionInput = yield UnidocReductionRequest.CURRENT

  if (current.isStart()) {
    current = yield UnidocReductionRequest.NEXT

    if (current.isEnd()) {
      return EMPTY_STRING
    }
  }

  if (current.isWhitespace() || current.isWord()) {
    yield* skipWhitespaces()
    let result: string = (yield* reduceWords()) || EMPTY_STRING
    yield* skipWhitespaces()
    return result
  }

  return undefined
}

/**
*
*/
export function reduceToken(): UnidocReducer<string> {
  return reduceEvents(reduceEventsToToken())
}
