import { Pack, BufferPack, Duplicator, Sequence } from "@cedric-demongivert/gl-tool-collection"

import { UTF32CodeUnit } from "./UTF32CodeUnit"
import { UTF16String } from "./UTF16String"
import { UTF16CodeUnit } from "./UTF16CodeUnit"
import { Assignable } from "@cedric-demongivert/gl-tool-utils"

/**
 * A buffer used by UTF32String instances.
 */
const TEMPORARY_BUFFER: UTF16String = UTF16String.allocate(256)

/**
 * An UTF-32 code unit string.
 */
export class UTF32String extends BufferPack<Uint32Array> implements Pack<UTF32CodeUnit>, Assignable<UTF32String> {
  /**
   * Return the number of UTF-16 coding unit required to encode this UTF-32 string.
   */
  public get UTF16Size(): number {
    let result: number = 0

    const size: number = this.size
    const content: Uint32Array = this.array

    for (let index = 0; index < size; ++index) {
      result += content[index] > 0xFFFF ? 2 : 1
    }

    return result
  }

  /**
   * Set the content of this UTF-32 string to be equivalent to the given javascript string.
   * 
   * @param value - The content to set.
   * 
   * @return This instance for chaining purposes.
   */
  public setString(value: string): this {
    this.size = UTF32String.sizeOfString(value)

    const array: Uint32Array = this.array
    const size: number = value.length

    let offset: number = 0

    for (let index = 0; index < size; ++index) {
      const highSurrogate: number = value.charCodeAt(index)

      if (highSurrogate > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && highSurrogate < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
        index += 1
        offset += 1
        const lowSurrogate: number = value.charCodeAt(index)
        array[index - offset] = (highSurrogate - UTF16CodeUnit.HighSurrogate.MINIMUM << 10) + (lowSurrogate - UTF16CodeUnit.LowSurrogate.MINIMUM) + 0x10000
      } else {
        array[index - offset] = highSurrogate
      }
    }

    return this
  }

  /**
   * Append the content of the given javascript string to the end of this UTF32String.
   * 
   * @param value - The content to concat.
   * 
   * @return This instance for chaining purposes.
   */
  public concatString(value: string): this {
    const baseSize: number = this.size

    this.size += UTF32String.sizeOfString(value)

    const array: Uint32Array = this.array
    const valueSize: number = value.length

    let surrogates: number = 0

    for (let index = 0; index < valueSize; ++index) {
      const highSurrogate: number = value.charCodeAt(index)

      if (highSurrogate > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && highSurrogate < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
        index += 1
        surrogates += 1
        const lowSurrogate: number = value.charCodeAt(index)
        array[index - surrogates + baseSize] = (highSurrogate - UTF16CodeUnit.HighSurrogate.MINIMUM << 10) + (lowSurrogate - UTF16CodeUnit.LowSurrogate.MINIMUM) + 0x10000
      } else {
        array[index - surrogates + baseSize] = highSurrogate
      }
    }

    return this
  }

  /**
   * Set the content of this UTF-32 string to be equivalent to the given UTF-16 string.
   * 
   * @param value - The content to set.
   * 
   * @return This instance for chaining purposes.
   */
  public setUTF16String(value: UTF16String): this {
    this.size = value.UTF32Size

    const utf32Array: Uint32Array = this.array
    const utf16Array: Uint16Array = value.array

    const size: number = this.size
    let offset: number = 0

    for (let index = 0; index < size; ++index) {
      const highSurrogate: number = utf16Array[index + offset]

      if (highSurrogate > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && highSurrogate < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
        offset += 1
        const lowSurrogate: number = utf16Array[index + offset]
        utf32Array[index] = (highSurrogate - UTF16CodeUnit.HighSurrogate.MINIMUM << 10) + (lowSurrogate - UTF16CodeUnit.LowSurrogate.MINIMUM) + 0x10000
      } else {
        utf32Array[index] = highSurrogate
      }
    }

    return this
  }

  /**
   * Compare the content of this UTF32String with the content of the given javascript string 
   * and return true if they are equivalent.
   * 
   * This method can be parametized to compare a substring of this UTF32String instead of the 
   * whole content. This method will clamp and reorder the given boundaries parameters if necessary. 
   * 
   * It may be worthwhile to split this method in two for critical code use. Until we gather more
   * information about this topic, only one method will exists.
   * 
   * @param value - The value to use as a comparison.
   * @param [from=0] - The index of the UTF32 code unit to use as a starting point for the comparison, inclusive.
   * @param [to=this.size] - The index of the UTF32 code unit to use as the end of the content to compare, exclusive.
   * 
   * @return True if the content of this UTF32String is equivalent to the content of the given javascript string.
   */
  public equalsToString(value: string, from: number = 0, to: number = this.size): boolean {
    const valueUTF32Size: number = UTF32String.sizeOfString(value)
    const thisSize: number = this.size

    let start: number = from < to ? from : to
    let end: number = from < to ? to : from

    start = start < 0 ? 0 : (start > thisSize ? thisSize : start)
    end = end < 0 ? 0 : (end > thisSize ? thisSize : end)

    if (end - start === valueUTF32Size) {
      const array: Uint32Array = this.array

      let surrogates: number = 0

      for (let index = start; index < end; ++index) {
        const highSurrogate: number = value.charCodeAt(index - start + surrogates)

        if (highSurrogate > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && highSurrogate < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
          surrogates += 1
          const lowSurrogate: number = value.charCodeAt(index - start + surrogates)

          if (array[index] != UTF32CodeUnit.fromUTF16CodePoint(highSurrogate, lowSurrogate)) {
            return false
          }
        } else if (array[index] !== highSurrogate) {
          return false
        }
      }

      return true
    } else {
      return false
    }
  }

  /**
   * 
   */
  public subEquals(thisFrom: number, other: UTF32String, otherFrom: number = 0, otherTo: number = other.size): boolean {
    const array: Uint32Array = this.array
    const otherArray: Uint32Array = other.array

    for (let index = 0, size = otherTo - otherFrom; index < size; ++index) {
      if (array[thisFrom + index] !== otherArray[otherFrom + index]) {
        return false
      }
    }

    return true
  }

  /**
   * @see string.substring
   * 
   * @return This instance for chaining purposes.
   */
  public substring(from: number, to: number = this.size, output: UTF32String = this): UTF32String {
    const size: number = this.size

    let start: number = from < to ? from : to
    let end: number = from < to ? to : from

    start = start < 0 ? 0 : (start > size ? size : start)
    end = end < 0 ? 0 : (end > size ? size : end)

    if (output.capacity < end - start) {
      output.reallocate(end - start)
    }

    const inArray: Uint32Array = this.array
    const outArray: Uint32Array = output.array

    for (let index = start; index < end; ++index) {
      outArray[index - start] = inArray[index]
    }

    output.size = end - start

    return this
  }

  /**
   * @see Assignable.prototype.copy
   */
  public copy(sequence: Sequence<number>): this {
    super.copy(sequence)
    return this
  }

  /**
   * 
   */
  public subCopyString(value: string, offset: number = 0, size: number = value.length - offset): this {
    this.size = UTF32String.sizeOfSubString(value, offset, size)

    const array: Uint32Array = this.array
    const valueEnd: number = offset + size

    let index: number = 0
    let valueIndex: number = offset

    while (valueIndex < valueEnd) {
      const highSurrogate: number = value.charCodeAt(valueIndex)

      if (highSurrogate > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && highSurrogate < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
        valueIndex += 1
        const lowSurrogate: number = value.charCodeAt(valueIndex)
        array[index] = (highSurrogate - UTF16CodeUnit.HighSurrogate.MINIMUM << 10) + (lowSurrogate - UTF16CodeUnit.LowSurrogate.MINIMUM) + 0x10000
      } else {
        array[index] = highSurrogate
      }

      valueIndex += 1
      index += 1
    }

    return this
  }

  /**
   * 
   */
  public countLines(): number {
    let result: number = 0
    let wasCarriageReturn: boolean = false

    const array: Uint32Array = this.array

    for (let index = 0, size = this.size; index < size; ++index) {
      const code: UTF32CodeUnit = array[index]

      if (code === UTF32CodeUnit.CARRIAGE_RETURN) {
        wasCarriageReturn = true
        result += 1
      } else if (code === UTF32CodeUnit.NEW_LINE) {
        result += wasCarriageReturn ? 0 : 1
        wasCarriageReturn = false
      } else {
        wasCarriageReturn = false
      }
    }

    return result
  }

  /**
   * @return This UTF-32 string as a javascript string.
   */
  public toString(): string {
    return TEMPORARY_BUFFER.setUTF32String(this).toString()
  }

  /**
   * 
   */
  public toDebugString(): string {
    return TEMPORARY_BUFFER.setUTF32String(this).toDebugString()
  }
}

/**
 * 
 */
export namespace UTF32String {
  /**
   * 
   */
  export const EMPTY: UTF32String = Object.freeze(new UTF32String(new Uint32Array(0), 0)) as UTF32String

  /**
   * Allocate an empty UTF-32 string of the given capacity.
   * 
   * @param capacity - The number of coding unit to pre-allocate.
   * 
   * @return An empty UTF-32 string of the given capacity.
   */
  export function allocate(capacity: number): UTF32String {
    return new UTF32String(new Uint32Array(capacity), 0)
  }

  /**
   * 
   */
  export namespace allocate {
    /**
     * 
     */
    export function withDefaultCapacity(): UTF32String {
      return new UTF32String(new Uint32Array(32), 0)
    }
  }

  /**
   * Return the size in UTF32 coding unit of the given javascript string.
   * 
   * @param value - A javascript string to evaluate.
   * 
   * @return The size in UTF32 coding unit of the given javascript string.
   */
  export function sizeOfString(value: string): number {
    let result: number = value.length
    const size: number = value.length

    for (let index = 0; index < size; ++index) {
      const utf16Unit: number = value.charCodeAt(index)

      if (utf16Unit > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && utf16Unit < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
        result -= 1
        index += 1
      }
    }

    return result
  }

  /**
   * 
   */
  export function sizeOfSubString(value: string, offset: number = 0, size: number = value.length - offset): number {
    let result: number = 0
    let index: number = offset
    const end: number = offset + size

    while (index < end) {
      const utf16Unit: number = value.charCodeAt(index)
      result += 1

      if (utf16Unit > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && utf16Unit < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
        index += 2
      } else {
        index += 1
      }
    }

    return result
  }

  /**
   * Allocate an UTF-32 string equal to the given javascript string.
   * 
   * @param value - The value of the string to instantiate as a javascript string.
   * 
   * @return An UTF-32 string equal to the given javascript string.
   */
  export function fromString(value: string): UTF32String {
    return new UTF32String(new Uint32Array(sizeOfString(value))).setString(value)
  }

  /**
   * Allocate an UTF-32 string equal to the given UTF-16 string.
   * 
   * @param value - The value of the string to instantiate as a UTF-16 string.
   * 
   * @return An UTF-32 string equal to the given UTF-16 string.
   */
  export function fromUTF16String(value: UTF16String): UTF32String {
    return new UTF32String(new Uint32Array(value.UTF32Size)).setUTF16String(value)
  }

  /**
   * 
   */
  export function fromCodeUnits(codes: Iterable<UTF32CodeUnit>, capacity: number = 0): UTF32String {
    const result: UTF32String = new UTF32String(new Uint32Array(capacity))

    for (const code of codes) {
      result.push(code)
    }

    return result
  }

  /**
   * 
   */
  export const DUPLICATOR: Duplicator<UTF32String> = Duplicator.fromFactory(allocate.withDefaultCapacity)
}
