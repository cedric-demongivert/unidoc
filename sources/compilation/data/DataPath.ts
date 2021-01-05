import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

export class DataPath {
  /**
  *
  */
  private readonly _elements: Pack<string | number>

  /**
  *
  */
  public readonly elements: Sequence<string | number>

  /**
  *
  */
  public constructor(capacity: number = 16) {
    this._elements = Pack.any(capacity)
    this.elements = this._elements.view()
  }

  /**
  *
  */
  public get size(): number {
    return this._elements.size
  }

  /**
  *
  */
  public get capacity(): number {
    return this._elements.capacity
  }

  /**
  *
  */
  public reallocate(capacity: number): void {
    this._elements.reallocate(capacity)
  }

  /**
  *
  */
  public fit(): void {
    this._elements.fit()
  }

  /**
  *
  */
  public push(element: string | number): void {
    this._elements.push(element)
  }

  /**
  *
  */
  public pop(): string | number {
    return this._elements.pop()
  }

  /**
  *
  */
  public concat(path: DataPath): void {
    this._elements.concat(path._elements)
  }

  /**
  *
  */
  public copy(path: DataPath): void {
    this._elements.copy(path._elements)
  }

  /**
  *
  */
  public clear(): void {
    this._elements.clear()
  }

  /**
  *
  */
  public clone(): DataPath {
    const result: DataPath = new DataPath(this._elements.capacity)
    result.copy(this)
    return result
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    if (this._elements.size > 0) {
      let result = '.'

      const first: string | number = this._elements.get(0)

      if (typeof first === 'string') {
        result += first
      } else {
        result += '['
        result += first
        result += ']'
      }

      for (let index = 1; index < this._elements.size; ++index) {
        const value: string | number = this._elements.get(1)

        if (typeof value === 'string') {
          result += '.'
          result += value
        } else {
          result += '['
          result += value
          result += ']'
        }
      }

      return result
    } else {
      return '.'
    }
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof DataPath) {
      return other._elements.equals(this._elements)
    }

    return false
  }

  /**
  *
  */
  public [Symbol.iterator](): Iterator<string | number> {
    return this._elements[Symbol.iterator]()
  }
}

export namespace DataPath {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy(toCopy: DataPath): DataPath
  /**
  *
  */
  export function copy(toCopy: null): null
  /**
  *
  */
  export function copy(toCopy: undefined): undefined
  export function copy(toCopy: DataPath | null | undefined): DataPath | null | undefined {
    return toCopy == null ? toCopy : toCopy.clone()
  }
}
