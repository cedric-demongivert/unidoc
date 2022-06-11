import { UnidocReduction } from './UnidocReduction'

/**
 *
 */
export function* fail(message: string): UnidocReduction<never> {
  const current: UnidocReduction.Input = (yield UnidocReduction.CURRENT)

  if (!current.isNext()) {
    throw new Error(`Stream / ${current.toString()} : ${message}`)
  }

  throw new Error(`${current.value.stringifyLocation()} / ${current.value.stringifyContent()} : ${message}`)
}