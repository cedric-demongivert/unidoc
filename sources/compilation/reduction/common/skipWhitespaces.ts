import { UnidocReductionInput } from '../UnidocReductionInput'
import { UnidocReductionRequest } from '../UnidocReductionRequest'

import { UnidocReducer } from '../UnidocReducer'

export function* skipWhitespaces(): UnidocReducer<void> {
  let input: UnidocReductionInput = yield UnidocReductionRequest.CURRENT

  while (input.isWhitespace()) {
    input = yield UnidocReductionRequest.NEXT
  }
}
