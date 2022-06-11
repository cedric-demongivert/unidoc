import { UnidocReduction } from './UnidocReduction'

/**
 *  
 */
export function* skipRest(): UnidocReduction<void> {
  let element: UnidocReduction.Input = yield UnidocReduction.CURRENT

  if (!element.isTermination()) {
    element = yield UnidocReduction.NEXT
  }

  return
}
