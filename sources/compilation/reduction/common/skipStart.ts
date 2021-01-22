import { UnidocReductionInput } from '../UnidocReductionInput'
import { UnidocReductionRequest } from '../UnidocReductionRequest'

import { UnidocReducer } from '../UnidocReducer'

export function* skipStart(): UnidocReducer<void> {
  let input: UnidocReductionInput = yield UnidocReductionRequest.CURRENT

  if (input.isStart()) {
    input = yield UnidocReductionRequest.NEXT
  }
}
