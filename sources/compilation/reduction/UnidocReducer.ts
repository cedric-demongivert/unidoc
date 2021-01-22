import { UnidocReductionInput } from './UnidocReductionInput'
import { UnidocReductionRequest } from './UnidocReductionRequest'

import * as common from './common'

/**
*
*/
export type UnidocReducer<T> = Generator<UnidocReductionRequest, T, UnidocReductionInput>

/**
*
*/
export namespace UnidocReducer {
  /**
  *
  */
  export type Result<T> = IteratorResult<UnidocReductionRequest, T>

  /**
  *
  */
  export type Factory<T> = () => UnidocReducer<T>

  /**
  *
  */
  export function feed<T>(reducer: UnidocReducer<T>, input: UnidocReductionInput): Result<T> {
    let result: Result<T> = reducer.next(input)

    while (!result.done && result.value === UnidocReductionRequest.CURRENT) {
      result = reducer.next(input)
    }

    return result
  }

  /**
  *
  */
  export function finish<T>(reducer: UnidocReducer<T>): T {
    const result: Result<T> = feed(reducer, UnidocReductionInput.END)

    if (result.done) {
      return result.value
    } else {
      throw new Error(
        'Illegal nested reducer behavior, the nested reducer continue to run ' +
        'despite the fact that it received the event that notify the end ' +
        'of the reduction process.'
      )
    }
  }

  /**
  *
  */
  export function* log(): UnidocReducer<void> {
    let current: UnidocReductionInput = yield UnidocReductionRequest.CURRENT

    while (!current.isEnd()) {
      console.log(current.toString())
      current = yield UnidocReductionRequest.NEXT
    }

    console.log(current.toString())
  }

  /**
  *
  */
  export const nextTag = common.nextTag

  /**
  *
  */
  export const reduce = common.reduce

  /**
  *
  */
  export const reduceEvents = common.reduceEvents

  /**
  *
  */
  export const reduceMany = common.reduceMany

  /**
  *
  */
  export const reduceTag = common.reduceTag

  /**
  *
  */
  export const reduceToken = common.reduceToken

  /**
  *
  */
  export const reduceText = common.reduceText

  /**
  *
  */
  export const reduceWhitespaces = common.reduceWhitespaces

  /**
  *
  */
  export const reduceWords = common.reduceWords

  /**
  *
  */
  export const skipEndOfAnyTag = common.skipEndOfAnyTag

  /**
  *
  */
  export const skipStart = common.skipStart

  /**
  *
  */
  export const skipStartOfAnyTag = common.skipStartOfAnyTag

  /**
  *
  */
  export const skipTag = common.skipTag

  /**
  *
  */
  export const skipWhitespaces = common.skipWhitespaces
}
