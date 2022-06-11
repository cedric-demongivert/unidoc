import { UnidocReduction } from './UnidocReduction'

/**
 *
 */
export function* assertStart(): UnidocReduction<void> {
  const current: UnidocReduction.Input = (yield UnidocReduction.CURRENT)

  if (!current.isStart()) {
    throw new Error(`Stream : expected to receive start, but received ${current.toString()}.`)
  }
}