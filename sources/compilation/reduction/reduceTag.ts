import { UnidocReductionInput } from './UnidocReductionInput'
import { UnidocReductionRequest } from './UnidocReductionRequest'

import { UnidocReducer } from './UnidocReducer'

import { skipStart } from './skipStart'
import { skipWhitespaces } from './skipWhitespaces'

/**
*
*/
export function* reduceTag<T>(reducer: UnidocReducer<T>): UnidocReducer<T | undefined> {
  yield* skipStart()
  yield* skipWhitespaces()

  let current: UnidocReductionInput = yield UnidocReductionRequest.CURRENT

  if (current.isStartOfAnyTag()) {
    let depth: number = 0
    let reduction: UnidocReducer.Result<T> = UnidocReducer.feed(reducer, UnidocReductionInput.START)

    do {
      if (current.isStartOfAnyTag()) {
        depth += 1
      } else if (current.isEndOfAnyTag()) {
        depth -= 1
      }

      if (current.isEnd()) {
        return UnidocReducer.finish(reducer)
      }

      if (reduction.done && current.isEnd()) {
        return reduction.value
      } else if (current.isEnd()) {
        return UnidocReducer.finish(reducer)
      } else {
        reduction = UnidocReducer.feed(reducer, current)
      }

      current = yield UnidocReductionRequest.NEXT
    } while (depth > 0)

    yield* skipWhitespaces()

    if (reduction.done) {
      return reduction.value
    } else {
      return UnidocReducer.finish(reducer)
    }
  } else {
    return undefined
  }
}

/**
*
*/
export namespace reduceTag {
  /**
  *
  */
  export function* content<T>(reducer: UnidocReducer<T>): UnidocReducer<T> {
    yield* skipStart()
    yield* skipWhitespaces()

    let current: UnidocReductionInput = yield UnidocReductionRequest.CURRENT

    if (current.isStartOfAnyTag()) {
      let depth: number = 1
      let reduction: UnidocReducer.Result<T> = UnidocReducer.feed(reducer, UnidocReductionInput.START)

      do {
        current = yield UnidocReductionRequest.NEXT

        if (current.isStartOfAnyTag()) {
          depth += 1
        } else if (current.isEndOfAnyTag()) {
          depth -= 1
        }

        if (current.isEnd()) {
          return UnidocReducer.finish(reducer)
        }

        if (reduction.done && current.isEnd()) {
          return reduction.value
        } else if (current.isEnd()) {
          return UnidocReducer.finish(reducer)
        } else if (depth > 0) {
          reduction = UnidocReducer.feed(reducer, current)
        }
      } while (depth > 0)

      yield UnidocReductionRequest.NEXT
      yield* skipWhitespaces()

      if (reduction.done) {
        return reduction.value
      } else {
        return UnidocReducer.finish(reducer)
      }
    } else {
      return undefined
    }
  }
}
