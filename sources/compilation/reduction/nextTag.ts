import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocReductionInput } from './UnidocReductionInput'
import { UnidocReductionInputType } from './UnidocReductionInputType'
import { UnidocReductionRequest } from './UnidocReductionRequest'

import { UnidocReducer } from './UnidocReducer'

export function* nextTag(): UnidocReducer<UnidocReductionInput> {
  let input: UnidocReductionInput = yield UnidocReductionRequest.CURRENT

  while (true) {
    switch (input.type) {
      case UnidocReductionInputType.END:
        return input
      case UnidocReductionInputType.EVENT:
        if (input.event.type === UnidocEventType.START_TAG) {
          return input
        }
      default:
        input = yield UnidocReductionRequest.NEXT
    }
  }
}
