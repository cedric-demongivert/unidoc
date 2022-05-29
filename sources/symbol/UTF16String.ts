import { Pack, BufferPack } from "@cedric-demongivert/gl-tool-collection"

import { UTF16CodeUnit } from "./UTF16CodeUnit"
import { UTF32String } from "./UTF32String"

/**
 * An UTF-16 code unit string.
 */
export class UTF16String extends BufferPack<Uint16Array> implements Pack<UTF16CodeUnit> {
  /**
   * Return the size in UTF32 coding unit of the given javascript string.
   * 
   * @param value - A javascript string to evaluate.
   * 
   * @return The size in UTF32 coding unit of the given javascript string.
   */
  public get UTF32Size(): number {
    let result: number = this.size

    const size: number = result
    const array: Uint16Array = this.array

    for (let index = 0; index < size; ++index) {
      const utf16Unit: number = array[index]

      if (utf16Unit > UTF16CodeUnit.AnySurrogate.LOWER_BOUNDARY && utf16Unit < UTF16CodeUnit.AnySurrogate.UPPER_BOUNDARY) {
        result -= 1
        index += 1
      }
    }

    return result
  }

  /**
   * Set the content of this UTF-16 string to be equivalent to the given javascript string.
   * 
   * @param value - The content to set.
   * 
   * @return This instance for chaining purposes.
   */
  public setString(value: string): this {
    const size: number = value.length

    this.size = size

    const array: Uint16Array = this.array

    for (let index = 0; index < size; ++index) {
      array[index] = value.charCodeAt(index)
    }

    return this
  }

  /**
   * Append the content of the given javascript string to the end of this UTF-16 string.
   * 
   * @param value - The content to concat.
   * 
   * @return This instance for chaining purposes.
   */
  public concatString(value: string): this {
    const oldSize: number = this.size
    const valueSize: number = value.length

    this.size += valueSize

    const array: Uint16Array = this.array

    for (let index = 0; index < valueSize; ++index) {
      array[index + oldSize] = value.charCodeAt(index)
    }

    return this
  }

  /**
   * Set the content of this UTF-16 string to be equivalent to the given UTF-32 string.
   * 
   * @param value - The content to set.
   * 
   * @return This instance for chaining purposes.
   */
  public setUTF32String(value: UTF32String): this {
    this.size = value.UTF16Size

    const size: number = value.size
    const utf32Array: Uint32Array = value.array
    const utf16Array: Uint16Array = this.array

    let offset: number = 0

    for (let index = 0; index < size; ++index) {
      const utf32Unit: number = utf32Array[index]

      if (utf32Unit > 0xFFFF) {
        utf16Array[index + offset] = UTF16CodeUnit.HighSurrogate.MINIMUM + ((utf32Unit - 0x10000) >>> 10)
        offset += 1
        utf16Array[index + offset] = UTF16CodeUnit.LowSurrogate.MINIMUM + (utf32Unit & 0x3FF)
      } else if (utf32Unit < UTF16CodeUnit.AnySurrogate.MINIMUM || utf32Unit > UTF16CodeUnit.AnySurrogate.MAXIMUM) {
        utf16Array[index + offset] = utf32Unit
      } else {
        utf16Array[index + offset] = UTF16CodeUnit.REPLACEMENT_CHARACTER // ERROR @see https://www.unicode.org/versions/Unicode14.0.0/ch05.pdf Page 255
      }
    }

    return this
  }

  /**
   * @see string.substring
   * 
   * This method may cut surrogate pairs in two as the length of the UTF16 string is computed in code unit and not
   * in code points.
   * 
   * @return This instance for chaining purposes.
   */
  public substring(from: number, to: number = this.size, output: UTF16String = this): UTF16String {
    const size: number = this.size

    let start: number = from < to ? from : to
    let end: number = from < to ? to : from

    start = start < 0 ? 0 : (start > size ? size : start)
    end = end < 0 ? 0 : (end > size ? size : end)

    if (output.capacity < end - start) {
      output.reallocate(end - start)
    }

    const inArray: Uint16Array = this.array
    const outArray: Uint16Array = output.array

    for (let index = start; index < end; ++index) {
      outArray[index - start] = inArray[index]
    }

    output.size = end - start

    return this
  }

  /**
   * @return This UTF-16 string as a javascript string.
   */
  public toString(): string {
    return String.fromCharCode(...this)
  }

  /**
   * @return This UTF-16 string as a javascript string.
   */
  public toDebugString(): string {
    const thisSize: number = this.size
    const array: Uint16Array = this.array

    TEMPORARY_BUFFER.clear()

    for (let index = 0; index < thisSize; ++index) {
      switch (array[index]) {
        case UTF16CodeUnit.NEW_LINE:
          TEMPORARY_BUFFER.push(UTF16CodeUnit.COLON)
          TEMPORARY_BUFFER.push(UTF16CodeUnit.LATIN_SMALL_LETTER_N)
          break
        case UTF16CodeUnit.CARRIAGE_RETURN:
          TEMPORARY_BUFFER.push(UTF16CodeUnit.COLON)
          TEMPORARY_BUFFER.push(UTF16CodeUnit.LATIN_SMALL_LETTER_R)
          break
        case UTF16CodeUnit.HORIZONTAL_TABULATION:
          TEMPORARY_BUFFER.push(UTF16CodeUnit.COLON)
          TEMPORARY_BUFFER.push(UTF16CodeUnit.LATIN_SMALL_LETTER_T)
          break
        case UTF16CodeUnit.SPACE:
          TEMPORARY_BUFFER.push(UTF16CodeUnit.COLON)
          TEMPORARY_BUFFER.push(UTF16CodeUnit.LATIN_SMALL_LETTER_S)
          break
        case UTF16CodeUnit.COLON:
          TEMPORARY_BUFFER.push(UTF16CodeUnit.COLON)
          TEMPORARY_BUFFER.push(UTF16CodeUnit.COLON)
          break
        case UTF16CodeUnit.FORM_FEED:
          TEMPORARY_BUFFER.push(UTF16CodeUnit.COLON)
          TEMPORARY_BUFFER.push(UTF16CodeUnit.LATIN_SMALL_LETTER_F)
          break
        default:
          TEMPORARY_BUFFER.push(array[index])
          break
      }
    }

    return String.fromCharCode(...TEMPORARY_BUFFER)
  }

  /**
   * Compare the content of this UTF16String with the content of the given javascript string 
   * and return true if they are equivalent.
   * 
   * This method can be parametized to compare a substring of this UTF16String instead of the 
   * whole content. This method will clamp and reorder the given boundaries parameters if necessary. 
   * 
   * It may be worthwhile to split this method in two for critical code use. Until we gather more
   * information about this topic, only one method will exists.
   * 
   * @param value - The value to use as a comparison.
   * @param [from=0] - The index of the UTF16 code unit to use as a starting point for the comparison, inclusive.
   * @param [to=this.size] - The index of the UTF16 code unit to use as the end of the content to compare, exclusive.
   * 
   * @return True if the content of this UTF16String is equivalent to the content of the given javascript string.
   */
  public equalsToString(value: string, from: number = 0, to: number = this.size): boolean {
    const valueSize: number = value.length
    const thisSize: number = this.size

    let start: number = from < to ? from : to
    let end: number = from < to ? to : from

    start = start < 0 ? 0 : (start > thisSize ? thisSize : start)
    end = end < 0 ? 0 : (end > thisSize ? thisSize : end)

    if (end - start === valueSize) {
      const array: Uint16Array = this.array

      for (let index = start; index < end; ++index) {
        if (array[index] !== value.charCodeAt(index - start)) {
          return false
        }
      }

      return true
    } else {
      return false
    }
  }
}

/**
 * 
 */
export namespace UTF16String {
  /**
   * Allocate an empty UTF-16 string of the given capacity.
   * 
   * @param capacity - The number of coding unit to pre-allocate.
   * 
   * @return An empty UTF-16 string of the given capacity.
   */
  export function allocate(capacity: number): UTF16String {
    return new UTF16String(new Uint16Array(capacity), 0)
  }

  /**
   * Allocate an UTF-16 string equal to the given javascript string.
   * 
   * @param value - The value of the string to instantiate as a javascript string.
   * 
   * @return An UTF-16 string equal to the given javascript string.
   */
  export function fromString(value: string): UTF16String {
    return new UTF16String(new Uint16Array(value.length)).setString(value)
  }

  /**
   * Allocate an UTF-16 string equal to the given javascript string.
   * 
   * @param value - The value of the string to instantiate as a javascript string.
   * 
   * @return An UTF-16 string equal to the given javascript string.
   */
  export function fromUTF32String(value: UTF32String): UTF16String {
    return new UTF16String(new Uint16Array(value.UTF16Size)).setUTF32String(value)
  }

  /**
   * 
   */
  export function fromCodeUnits(codes: Iterable<UTF16CodeUnit>, capacity: number = 0): UTF16String {
    const result: UTF16String = new UTF16String(new Uint16Array(capacity))

    for (const code of codes) {
      result.push(code)
    }

    return result
  }
}

/**
 * A buffer used by UTF16String instances.
 */
const TEMPORARY_BUFFER: UTF16String = UTF16String.allocate(256)