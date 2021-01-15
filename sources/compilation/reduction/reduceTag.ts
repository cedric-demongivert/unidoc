import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocReductionInput } from './UnidocReductionInput'
import { UnidocReductionInputType } from './UnidocReductionInputType'
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
      switch (current.type) {
        case UnidocReductionInputType.END:
          if (reduction.done) {
            return reduction.value
          } else {
            return UnidocReducer.finish(reducer)
          }
        case UnidocReductionInputType.EVENT:
          switch (current.event.type) {
            case UnidocEventType.START_TAG:
              depth += 1
              break
            case UnidocEventType.END_TAG:
              depth -= 1
              break
            default:
              break
          }
        default:
          if (!reduction.done) {
            reduction = UnidocReducer.feed(reducer, current)
          }
          break
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
  export function* content<T>(reducer: UnidocReducer<T>): UnidocReducer<T | undefined> {
    yield* skipStart()
    yield* skipWhitespaces()

    let current: UnidocReductionInput = yield UnidocReductionRequest.CURRENT

    if (current.isStartOfAnyTag()) {
      let reduction: UnidocReducer.Result<T> = UnidocReducer.feed(reducer, UnidocReductionInput.START)

      current = yield UnidocReductionRequest.NEXT

      switch (current.type) {
        case UnidocReductionInputType.END:
          if (reduction.done) {
            return reduction.value
          } else {
            return UnidocReducer.finish(reducer)
          }
        case UnidocReductionInputType.EVENT:
          switch (current.event.type) {
            case UnidocEventType.END_TAG:
              yield UnidocReductionRequest.NEXT
              if (reduction.done) {
                return reduction.value
              } else {
                return UnidocReducer.finish(reducer)
              }
            default:
              break
          }
        default:
          break
      }

      let depth: number = 1

      while (depth > 0) {
        if (!reduction.done) {
          reduction = UnidocReducer.feed(reducer, current)
        }

        current = yield UnidocReductionRequest.NEXT

        switch (current.type) {
          case UnidocReductionInputType.END:
            if (reduction.done) {
              return reduction.value
            } else {
              return UnidocReducer.finish(reducer)
            }
          case UnidocReductionInputType.EVENT:
            switch (current.event.type) {
              case UnidocEventType.START_TAG:
                depth += 1
                break
              case UnidocEventType.END_TAG:
                depth -= 1
                break
              default:
                break
            }
          default:
            break
        }
      } while (depth > 0);

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
