import { UnidocSelector } from '../selector/UnidocSelector'

import { UnidocPredicate } from './UnidocPredicate'

export class UnidocSelectionPredicate<Input, Tested> implements UnidocPredicate<Input> {
  public readonly selector: UnidocSelector<Input, Tested>
  public readonly predicate: UnidocPredicate<Tested>

  public constructor(selector: UnidocSelector<Input, Tested>, predicate: UnidocPredicate<Tested>) {
    this.selector = selector
    this.predicate = predicate
  }

  public test(value: Input): boolean {
    return this.predicate.test(this.selector.select(value))
  }

  public toString(): string {
    return this.selector.toString() + ' is ' + this.predicate.toString()
  }

  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocSelectionPredicate) {
      return (
        this.selector.equals(other.selector) &&
        this.predicate.equals(other.predicate)
      )
    }

    return false
  }
}
