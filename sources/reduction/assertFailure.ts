import { UnidocReduction } from './UnidocReduction'

/**
 *
 */
export function* assertFailure(): UnidocReduction<void> {
  (yield UnidocReduction.CURRENT).assertFailure()!
}