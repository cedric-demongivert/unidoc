import { UnidocReductionInput } from './UnidocReductionInput'
import { UnidocReductionRequest } from './UnidocReductionRequest'

import { UnidocReducer } from './UnidocReducer'

export function* skipStartOfAnyTag(): UnidocReducer<void> {
  let input: UnidocReductionInput = yield UnidocReductionRequest.CURRENT

  if (input.isStartOfAnyTag()) {
    input = yield UnidocReductionRequest.NEXT
  }
}
