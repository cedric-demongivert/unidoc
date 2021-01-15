import { UnidocReductionInput } from './UnidocReductionInput'
import { UnidocReductionInputType } from './UnidocReductionInputType'
import { UnidocReductionRequest } from './UnidocReductionRequest'

import { UnidocReducer } from './UnidocReducer'

/**
*
*/
export function* reduceEvents<T>(reducer: UnidocReducer<T>): UnidocReducer<T> {
  let current: UnidocReductionInput = yield UnidocReductionRequest.CURRENT
  let result: UnidocReducer.Result<T>

  while (!current.isEnd()) {
    switch (current.type) {
      case UnidocReductionInputType.START:
      case UnidocReductionInputType.EVENT:
        result = UnidocReducer.feed(reducer, current)

        if (result.done) {
          return result.value
        }
        break
      default:
        break
    }

    current = yield UnidocReductionRequest.NEXT
  }

  return UnidocReducer.finish(reducer)
}
