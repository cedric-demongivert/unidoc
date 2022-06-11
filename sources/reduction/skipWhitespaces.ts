import { UnidocReduction } from './UnidocReduction'

/**
 * 
 */
export function* skipWhitespaces(): UnidocReduction<void> {
  let input: UnidocReduction.Input = yield UnidocReduction.CURRENT

  while (input.isNext() && input.value.isWhitespace()) {
    input = yield UnidocReduction.NEXT
  }

  return
}
