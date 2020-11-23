//import { NativeSet } from '@cedric-demongivert/gl-tool-collection'
//import { Collection } from '@cedric-demongivert/gl-tool-collection'

import { UnidocPredicate } from './UnidocPredicate'

export class UnidocConjunctionPredicate<T> implements UnidocPredicate<T> {
  public readonly predicates: UnidocPredicate<T>[]

  public constructor(values: Iterable<UnidocPredicate<T>>) {
    this.predicates = [...values]
  }

  public test(value: T): boolean {
    for (const predicate of this.predicates) {
      if (!predicate.test(value)) {
        return false
      }
    }

    return true
  }

  public toString(): string {
    if (this.predicates.length === 0) {
      return 'true'
    }

    let result: string = '('
    const iterator: Iterator<UnidocPredicate<T>> = this.predicates.values()
    let next: IteratorResult<UnidocPredicate<T>> = iterator.next()

    if (!next.done) {
      result += next.value.toString()
    }

    while (!(next = iterator.next()).done) {
      result += ' and '
      result += next.value.toString()
    }

    result += ')'

    return result
  }

  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocConjunctionPredicate) {
      if (other.predicates.length !== this.predicates.length) return false

      for (let index = 0; index < this.predicates.length; ++index) {
        if (!other.predicates[index].equals(this.predicates[index])) {
          return false
        }
      }

      return true
    }

    return false
  }
}
