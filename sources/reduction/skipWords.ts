import { UnidocReduction } from './UnidocReduction'

/**
 * 
 */
export function* skipWords(): UnidocReduction<void> {
  let input: UnidocReduction.Input = yield UnidocReduction.CURRENT

  while (input.isNext() && input.value.isWord()) {
    input = yield UnidocReduction.NEXT
  }

  return
}
