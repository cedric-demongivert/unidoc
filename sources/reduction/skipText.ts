import { UnidocReduction } from './UnidocReduction'

/**
 * 
 */
export function* skipText(): UnidocReduction<void> {
  let input: UnidocReduction.Input = yield UnidocReduction.CURRENT

  while (input.isNext() && input.value.isText()) {
    input = yield UnidocReduction.NEXT
  }

  return
}
