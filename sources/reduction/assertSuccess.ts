import { UnidocReduction } from './UnidocReduction'

/**
 *
 */
export function* assertSuccess(): UnidocReduction<void> {
  (yield UnidocReduction.CURRENT).assertSuccess()!
}