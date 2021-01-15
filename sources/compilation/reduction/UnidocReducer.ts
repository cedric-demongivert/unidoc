import { UnidocReductionInput } from './UnidocReductionInput'
import { UnidocReductionRequest } from './UnidocReductionRequest'

import { reduceEvents as reduceEventsImport } from './reduceEvents'
import { reduceMany as reduceManyImport } from './reduceMany'
import { reduceText as reduceTextImport } from './reduceText'
import { reduceToken as reduceTokenImport } from './reduceToken'
import { reduceWhitespaces as reduceWhitespacesImport } from './reduceWhitespaces'
import { reduceWords as reduceWordsImport } from './reduceWords'
import { skipEndOfAnyTag as skipEndOfAnyTagImport } from './skipEndOfAnyTag'
import { skipStart as skipStartImport } from './skipStart'
import { skipStartOfAnyTag as skipStartOfAnyTagImport } from './skipStartOfAnyTag'
import { skipWhitespaces as skipWhitespacesImport } from './skipWhitespaces'

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
  export function feed<T>(reducer: UnidocReducer<T>, input: UnidocReductionInput): UnidocReducer.Result<T> {
    let result: UnidocReducer.Result<T> = reducer.next(input)

    while (!result.done && result.value === UnidocReductionRequest.CURRENT) {
      result = reducer.next(input)
    }

    return result
  }

  /**
  *
  */
  export function finish<T>(reducer: UnidocReducer<T>): T {
    const result: UnidocReducer.Result<T> = feed(reducer, UnidocReductionInput.END)

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
  export const reduceEvents = reduceEventsImport

  /**
  *
  */
  export const reduceMany = reduceManyImport

  /**
  *
  */
  export const reduceToken = reduceTokenImport

  /**
  *
  */
  export const reduceText = reduceTextImport

  /**
  *
  */
  export const reduceWhitespaces = reduceWhitespacesImport

  /**
  *
  */
  export const reduceWords = reduceWordsImport

  /**
  *
  */
  export const skipEndOfAnyTag = skipEndOfAnyTagImport

  /**
  *
  */
  export const skipStart = skipStartImport

  /**
  *
  */
  export const skipStartOfAnyTag = skipStartOfAnyTagImport

  /**
  *
  */
  export const skipWhitespaces = skipWhitespacesImport
}
