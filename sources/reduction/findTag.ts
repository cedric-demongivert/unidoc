import { UnidocReduction } from './UnidocReduction'

/**
 * 
 */
export function* findTag(): UnidocReduction<string | null> {
  let input: UnidocReduction.Input = yield UnidocReduction.CURRENT

  while (input.isStart() || input.isNext() && !input.value.isStartOfAnyTag()) {
    input = yield UnidocReduction.NEXT
  }

  if (input.isNext()) {
    return input.value.symbols.toString()
  }

  return null
}
