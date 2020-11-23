import { UnidocPredicate } from './UnidocPredicate'

export class UnidocMatchPredicate implements UnidocPredicate<string> {
  public readonly regexp: RegExp

  public constructor(regexp: RegExp) {
    this.regexp = regexp
  }

  public test(value: string): boolean {
    return this.regexp.test(value)
  }

  public toString(): string {
    return '$match(' + this.regexp.toString() + ')'
  }

  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocMatchPredicate) {
      return other.regexp === this.regexp
    }

    return false
  }
}
