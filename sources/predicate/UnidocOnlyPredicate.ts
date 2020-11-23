import { UnidocPredicate } from './UnidocPredicate'

export class UnidocOnlyPredicate<T> implements UnidocPredicate<T> {
  public readonly value: T

  public constructor(value: T) {
    this.value = value
  }

  public test(value: T): boolean {
    return value === this.value
  }

  public toString(): string {
    return 'only(' + this.value + ')'
  }

  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocOnlyPredicate) {
      return other.value === this.value
    }

    return false
  }
}
