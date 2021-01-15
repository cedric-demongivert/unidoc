import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocReductionInput } from './UnidocReductionInput'
import { UnidocReductionInputType } from './UnidocReductionInputType'
import { UnidocReductionRequest } from './UnidocReductionRequest'

import { UnidocReducer } from './UnidocReducer'

import { skipStart } from './skipStart'
import { skipWhitespaces } from './skipWhitespaces'

export function* skipTag(): UnidocReducer<UnidocReductionInput> {
  yield* skipStart()
  yield* skipWhitespaces()

  let current: UnidocReductionInput = yield UnidocReductionRequest.CURRENT

  if (current.isStartOfAnyTag()) {
    let depth: number = 1

    while (depth > 0) {
      current = yield UnidocReductionRequest.NEXT

      switch (current.type) {
        case UnidocReductionInputType.END:
          return current
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
          break
        default:
          break
      }
    }

    return yield UnidocReductionRequest.NEXT
  }

  return yield UnidocReductionRequest.CURRENT
}
