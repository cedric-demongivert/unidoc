//import { NativeSet } from '@cedric-demongivert/gl-tool-collection'
//import { Collection } from '@cedric-demongivert/gl-tool-collection'

import { UnidocPredicate } from './UnidocPredicate'

export class UnidocAnyPredicate<T> implements UnidocPredicate<T> {
  private readonly _values: Set<T>

  public constructor(values: Iterable<T>) {
    this._values = new Set()

    for (const value of values) {
      this._values.add(value)
    }
  }

  public test(value: T): boolean {
    return this._values.has(value)
  }

  public toString(): string {
    let result: string = '$any('
    const iterator: Iterator<T> = this._values.values()
    let next: IteratorResult<T> = iterator.next()

    if (!next.done) {
      result += next.value
    }

    while (!(next = iterator.next()).done) {
      result += ', '
      result += next.value
    }

    result += ')'

    return result
  }

  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocAnyPredicate) {
      if (other._values.size !== this._values.size) return false

      for (const value of this._values) {
        if (!other._values.has(value)) {
          return false
        }
      }

      return true
    }

    return false
  }
}
