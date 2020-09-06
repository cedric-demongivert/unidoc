import { Predicate } from './Predicate'

export class OnlyPredicate<T> implements Predicate<T> {
  public readonly value : T

  public constructor (value : T) {
    this.value = value
  }

  public validate (value : T) : boolean {
    return value === this.value
  }

  public toString () : string {
    return '$only(' + this.value + ')'
  }
}
