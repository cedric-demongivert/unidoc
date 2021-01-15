import { UnidocReducer } from './UnidocReducer'

/**
*
*/
export function* reduceMany<T>(factory: UnidocReducer.Factory<T>): UnidocReducer<T[]> {
  const result: T[] = []

  while (true) {
    let next: T | undefined = yield* factory()

    if (next === undefined) {
      return result
    } else {
      result.push(next)
    }
  }
}
