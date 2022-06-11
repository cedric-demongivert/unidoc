import { UnidocReduction } from './UnidocReduction'

/**
*
*/
export function* assertNext(): UnidocReduction<void> {
  (yield UnidocReduction.CURRENT).assertNext()!
}