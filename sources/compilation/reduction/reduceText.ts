import { UnidocReductionRequest } from './UnidocReductionRequest'
import { UnidocReductionInput } from './UnidocReductionInput'
import { UnidocReducer } from './UnidocReducer'

import { skipWhitespaces } from './skipWhitespaces'

import { reduceEvents } from './reduceEvents'
import { reduceWords } from './reduceWords'

/**
*
*/
const EMPTY_STRING: string = ''

/**
*
*/
function* reduceEventsToText(): UnidocReducer<string | undefined> {
  let result: string
  let current: UnidocReductionInput

  current = yield UnidocReductionRequest.CURRENT

  if (current.isStart()) {
    current = yield UnidocReductionRequest.NEXT

    if (current.isEnd()) {
      return EMPTY_STRING
    }
  }

  if (current.isWhitespace() || current.isAnyWord()) {
    yield* skipWhitespaces()

    result = (yield* reduceWords()) || EMPTY_STRING

    current = yield UnidocReductionRequest.CURRENT

    while (current.isWhitespace()) {
      yield* skipWhitespaces()

      current = yield UnidocReductionRequest.CURRENT

      if (current.isAnyWord()) {
        result += ' '
        result += yield* reduceWords()
      } else {
        return result
      }

      current = yield UnidocReductionRequest.CURRENT
    }

    return result
  }

  return undefined
}

/**
*
*/
export function reduceText(): UnidocReducer<string | undefined> {
  return reduceEvents(reduceEventsToText())
}
