import { UnidocReduction } from './UnidocReduction'

/**
 *
 */
export function* assertTermination(): UnidocReduction<void> {
  const current: UnidocReduction.Input = (yield UnidocReduction.CURRENT)

  if (!current.isTermination()) {
    throw new Error(`Stream : expected to receive termination, but received ${current.toString()}.`)
  }
}