import { UnidocPredicate } from './UnidocPredicate'

export class UnidocAnythingPredicate<T> implements UnidocPredicate<T> {
  public test(value: T): boolean {
    return true
  }

  public toString(): string {
    return '$anything'
  }

  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocAnythingPredicate) {
      return true
    }

    return false
  }
}

export namespace UnidocAnythingPredicate {
  export const INSTANCE: UnidocAnythingPredicate<any> = new UnidocAnythingPredicate()
}
