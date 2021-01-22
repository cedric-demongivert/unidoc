import { UnidocReductionInput } from '../UnidocReductionInput'
import { UnidocReductionRequest } from '../UnidocReductionRequest'

import { UnidocReducer } from '../UnidocReducer'

export function* skipEndOfAnyTag(): UnidocReducer<void> {
  let input: UnidocReductionInput = yield UnidocReductionRequest.CURRENT

  if (input.isEndOfAnyTag()) {
    input = yield UnidocReductionRequest.NEXT
  }
}
