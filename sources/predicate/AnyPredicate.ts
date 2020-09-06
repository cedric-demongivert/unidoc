//import { NativeSet } from '@cedric-demongivert/gl-tool-collection'
//import { Collection } from '@cedric-demongivert/gl-tool-collection'

import { Predicate } from './Predicate'

export class AnyPredicate<T> implements Predicate<T> {
  //public readonly values : Collection<T>

  //private readonly _values : NativeSet<T>

  private readonly _values : Set<T>

  public constructor (values : Iterable<T>) {
    this._values = new Set()

    for (const value of values) {
      this._values.add(value)
    }

    //this.value = this._values.view()
  }

  public validate (value : T) : boolean {
    return this._values.has(value)
  }

  public toString () : string {
    let result = '$any('
    let comma = false

    for (const value of this._values) {
      if (comma) {
        result += ', '
      } else {
        comma = true
      }

      result += value
    }

    result += ')'

    return result
  }
}
