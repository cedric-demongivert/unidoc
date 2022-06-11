import { UnidocReduction } from './UnidocReduction'

/**
 *
 */
export function* assertTermination(): UnidocReduction<void> {
  (yield UnidocReduction.CURRENT).assertTermination()!
}