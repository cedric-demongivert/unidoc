import { UnidocReduction } from './UnidocReduction'

/**
*
*/
export function* assertStart(): UnidocReduction<void> {
  (yield UnidocReduction.CURRENT).assertStart()!
}