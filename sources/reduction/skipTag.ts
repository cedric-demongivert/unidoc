import { UnidocReduction } from './UnidocReduction'

/**
 *  
 */
export function* skipTag(): UnidocReduction<void> {
  let element: UnidocReduction.Input = yield UnidocReduction.CURRENT

  if (!element.isNext() || !element.value.isStartOfAnyTag()) {
    return
  }

  const depth: number = element.value.path.size
  element = yield UnidocReduction.NEXT

  while (element.isNext()) {
    if (element.value.path.size <= depth) {
      yield UnidocReduction.NEXT
      return
    }

    element = yield UnidocReduction.NEXT
  }

  return
}
