import { Allocator } from '@cedric-demongivert/gl-tool-collection'

export class UnidocState {
  /**
  * The content of this state.
  */
  private _data: Uint8Array

  /**
  *
  */
  private _view: DataView

  /**
  *
  */
  private _size: number

  /**
  *
  */
  public get data(): Uint8Array {
    return this._data
  }

  /**
  *
  */
  public get size(): number {
    return this._size
  }

  /**
  *
  */
  public set size(newSize: number) {
    if (newSize > this._data.length) {
      let nextCapacity: number = this._data.length

      while (nextCapacity < newSize) {
        nextCapacity *= 2
      }

      this.reallocate(nextCapacity)
    }

    this._size = newSize
  }

  /**
  *
  */
  public get capacity(): number {
    return this._data.byteLength
  }

  /**
  * Instantiate a new empty state.
  *
  * @param [capacity = 8] - The capacity of the state to instantiate in bytes.
  */
  public constructor(capacity: number = 8) {
    this._data = new Uint8Array(capacity)
    this._view = new DataView(this._data.buffer)
    this._size = 0
  }

  public reallocate(newCapacity: number): void {
    const oldData: Uint8Array = this._data

    this._size = this._size > newCapacity ? newCapacity : this._size
    this._data = new Uint8Array(newCapacity)
    this._data.set(oldData.subarray(0, this._size))
    this._view = new DataView(this._data.buffer)
  }

  public fit(): void {
    const oldData: Uint8Array = this._data
    this._data = new Uint8Array(this._size)
    this._data.set(oldData.subarray(0, this._size))
    this._view = new DataView(this._data.buffer)
  }

  public pushBitset(size: number): number {
    const cursor: number = this._size
    const bytes: number = Math.ceil(size / 8)
    this.size = cursor + Uint8Array.BYTES_PER_ELEMENT * bytes

    for (let index = 0; index < bytes; ++index) {
      this._view.setUint8(cursor + index, 0)
    }

    return cursor
  }

  public pushBoolean(value: boolean): number {
    const cursor: number = this._size
    this.size = cursor + Uint8Array.BYTES_PER_ELEMENT

    this._view.setUint8(cursor, value ? 1 : 0)

    return cursor
  }

  public pushUint8(value: number): number {
    const cursor: number = this._size
    this.size = cursor + Uint8Array.BYTES_PER_ELEMENT

    this._view.setUint8(cursor, value)

    return cursor
  }

  public pushInt8(value: number): number {
    const cursor: number = this._size
    this.size = cursor + Int8Array.BYTES_PER_ELEMENT

    this._view.setInt8(cursor, value)

    return cursor
  }

  public pushUint16(value: number): number {
    const cursor: number = this._size
    this.size = cursor + Uint16Array.BYTES_PER_ELEMENT

    this._view.setUint16(cursor, value)

    return cursor
  }

  public pushInt16(value: number): number {
    const cursor: number = this._size
    this.size = cursor + Int16Array.BYTES_PER_ELEMENT

    this._view.setInt16(cursor, value)

    return cursor
  }

  public pushUint32(value: number): number {
    const cursor: number = this._size
    this.size = cursor + Uint32Array.BYTES_PER_ELEMENT

    this._view.setUint32(cursor, value)

    return cursor
  }

  public pushInt32(value: number): number {
    const cursor: number = this._size
    this.size = cursor + Int32Array.BYTES_PER_ELEMENT

    this._view.setInt32(cursor, value)

    return cursor
  }

  public pushFloat32(value: number): number {
    const cursor: number = this._size
    this.size = cursor + Float32Array.BYTES_PER_ELEMENT

    this._view.setFloat32(cursor, value)

    return cursor
  }

  public pushFloat64(value: number): number {
    const cursor: number = this._size
    this.size = cursor + Float64Array.BYTES_PER_ELEMENT

    this._view.setFloat64(cursor, value)

    return cursor
  }

  public pushString(value: string): number {
    const cursor: number = this._size
    const size: number = value.length

    this.size = cursor + Uint32Array.BYTES_PER_ELEMENT + size * Uint16Array.BYTES_PER_ELEMENT

    const view: DataView = this._view

    view.setUint32(cursor, size)

    let codePointCursor: number = cursor + Uint32Array.BYTES_PER_ELEMENT

    for (let index = 0; index < size; ++index) {
      view.setUint16(codePointCursor, value.codePointAt(index) as number)
      codePointCursor += Uint16Array.BYTES_PER_ELEMENT
    }

    return cursor
  }

  public enable(cursor: number, bit: number): void {
    const end: number = cursor + Math.ceil(bit / 8)
    this.size = Math.max(this._size, end)

    const byteIndex: number = cursor + Math.floor(bit / 8)

    this._view.setUint8(
      byteIndex,
      this._view.getUint8(byteIndex) | (0b1 << (bit % 8))
    )
  }

  public disable(cursor: number, bit: number): void {
    const end: number = cursor + Math.ceil(bit / 8)
    this.size = Math.max(this._size, end)

    const byteIndex: number = cursor + Math.floor(bit / 8)

    this._view.setUint8(
      byteIndex,
      this._view.getUint8(byteIndex) & ~(0b1 << (bit % 8))
    )
  }

  public setBit(cursor: number, bit: number, value: boolean): void {
    if (value) {
      this.enable(cursor, bit)
    } else {
      this.disable(cursor, bit)
    }
  }

  public setBoolean(cursor: number, value: boolean): void {
    const end: number = cursor + Uint8Array.BYTES_PER_ELEMENT
    this.size = Math.max(this._size, end)

    this._view.setUint8(cursor, value ? 0 : 1)
  }

  public setUint8(cursor: number, value: number): void {
    const end: number = cursor + Uint8Array.BYTES_PER_ELEMENT
    this.size = Math.max(this._size, end)

    this._view.setUint8(cursor, value)
  }

  public setInt8(cursor: number, value: number): void {
    const end: number = cursor + Int8Array.BYTES_PER_ELEMENT
    this.size = Math.max(this._size, end)

    this._view.setInt8(cursor, value)
  }

  public setUint16(cursor: number, value: number): void {
    const end: number = cursor + Uint16Array.BYTES_PER_ELEMENT
    this.size = Math.max(this._size, end)

    this._view.setUint16(cursor, value)
  }

  public setInt16(cursor: number, value: number): void {
    const end: number = cursor + Int16Array.BYTES_PER_ELEMENT
    this.size = Math.max(this._size, end)

    this._view.setInt16(cursor, value)
  }

  public setUint32(cursor: number, value: number): void {
    const end: number = cursor + Uint32Array.BYTES_PER_ELEMENT
    this.size = Math.max(this._size, end)

    this._view.setUint32(cursor, value)
  }

  public setInt32(cursor: number, value: number): void {
    const end: number = cursor + Int32Array.BYTES_PER_ELEMENT
    this.size = Math.max(this._size, end)

    this._view.setInt32(cursor, value)
  }

  public setFloat32(cursor: number, value: number): void {
    const end: number = cursor + Float32Array.BYTES_PER_ELEMENT
    this.size = Math.max(this._size, end)

    this._view.setFloat32(cursor, value)
  }

  public setFloat64(cursor: number, value: number): void {
    const end: number = cursor + Float64Array.BYTES_PER_ELEMENT
    this.size = Math.max(this._size, end)

    this._view.setFloat64(cursor, value)
  }

  public getBit(cursor: number, bit: number): boolean {
    return (
      this._view.getUint8(cursor + Math.floor(bit / 8)) & (0b1 << (bit % 8))
    ) > 0
  }

  public getBoolean(cursor: number): boolean {
    return this._view.getUint8(cursor) > 0
  }

  public getUint8(cursor: number): number {
    return this._view.getUint8(cursor)
  }

  public getInt8(cursor: number): number {
    return this._view.getInt8(cursor)
  }

  public getUint16(cursor: number): number {
    return this._view.getUint16(cursor)
  }

  public getInt16(cursor: number): number {
    return this._view.getInt16(cursor)
  }

  public getUint32(cursor: number): number {
    return this._view.getUint32(cursor)
  }

  public getInt32(cursor: number): number {
    return this._view.getInt32(cursor)
  }

  public getFloat32(cursor: number): number {
    return this._view.getFloat32(cursor)
  }

  public getFloat64(cursor: number): number {
    return this._view.getFloat64(cursor)
  }

  public getString(cursor: number): string {
    const view: DataView = this._view
    const size: number = view.getUint32(cursor)

    let result: string = ''
    let codePointCursor: number = cursor + Uint32Array.BYTES_PER_ELEMENT

    for (let index = 0; index < size; ++index) {
      result += String.fromCodePoint(view.getUint16(codePointCursor))
      codePointCursor += Uint16Array.BYTES_PER_ELEMENT
    }

    return result
  }

  /**
  * @see Pack.fill
  */
  public fill(value: number): void {
    this._data.fill(value, 0, this._size)
  }

  /**
  * Copy an existing state instance.
  *
  * @param toCopy - An existing state instance to copy.
  */
  public copy(toCopy: UnidocState): void {
    if (toCopy._size > this.capacity) {
      this.reallocate(toCopy.capacity)
    }

    this._data.set(toCopy._data.subarray(0, toCopy._size))
    this._size = toCopy._size
  }

  /**
  * Clone this state instance.
  *
  * @return A clone of this state instance.
  */
  public clone(): UnidocState {
    const result: UnidocState = new UnidocState(this.capacity)
    result.copy(this)
    return result
  }

  /**
  * Reset the state of this object as if it was just instantiated.
  */
  public clear(): void {
    this._size = 0
  }


  /**
  * Hash this state into a number.
  *
  * @return A hash of this state.
  */
  public hash(): number {
    const size: number = this._size
    if (size > 1) {
      const data: Uint8Array = this._data

      let result: number = 1

      for (let index = 0; index < size; ++index) {
        result = 31 * result + data[index]
      }

      return result
    } else if (size > 0) {
      return this._data[0]
    } else {
      return 0
    }
  }

  public toHexadecimalString(): string {
    let result: string = '0x'

    const size: number = this._size
    const data: Uint8Array = this._data

    for (let index = 0; index < size; ++index) {
      result += data[index].toString(16)
    }

    return result
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    const size: number = this._size

    let result: string = this.constructor.name

    result += ' (0x'

    if (size > 0) {
      const data: Uint8Array = this._data

      for (let index = 0; index < size; ++index) {
        result += data[index].toString(16)
      }
    }

    result += ')'

    return result
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocState) {
      if (other._size !== this._size) {
        return false
      } else {
        const size: number = this._size
        const data: Uint8Array = this._data
        const otherData: Uint8Array = other._data

        for (let index = 0; index < size; ++index) {
          if (data[index] !== otherData[index]) {
            return false
          }
        }

        return true
      }
    }

    return false
  }
}

export namespace UnidocState {
  export function uint8(value: number): UnidocState {
    const result: UnidocState = new UnidocState(1)
    result.pushUint8(value)
    return result
  }

  export function create(): UnidocState {
    return new UnidocState()
  }

  export const ALLOCATOR: Allocator<UnidocState> = Allocator.fromFactory(create)
}
