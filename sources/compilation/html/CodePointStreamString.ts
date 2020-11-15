import { CodePoint } from '../../symbol/CodePoint'

export class CodePointStreamString implements Iterable<CodePoint> {
  public value: string

  public constructor(value: string) {
    this.value = value
  }

  public *[Symbol.iterator](): Iterator<CodePoint> {
    if (this.value != null) {
      for (let index = 0, size = this.value.length; index < size; ++index) {
        yield this.value.codePointAt(index) as CodePoint
      }
    }
  }
}
