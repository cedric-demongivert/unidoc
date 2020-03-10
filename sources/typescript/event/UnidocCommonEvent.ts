import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { CodePoint } from '../CodePoint'
import { UnidocLocation } from '../UnidocLocation'

import { UnidocEvent } from './UnidocEvent'
import { UnidocEventType } from './UnidocEventType'

export class UnidocCommonEvent implements UnidocEvent {
  /**
  * @see UnidocEvent.timestamp
  */
  public timestamp : number

  /**
  * @see UnidocEvent.type
  */
  public type : UnidocEventType

  /**
  * @see UnidocEvent.location
  */
  public readonly location : UnidocLocation

  /**
  * Content associated to this event.
  */
  public readonly symbols : Pack<CodePoint>

  /**
  * Instantiate a new common unidoc event.
  */
  public constructor () {
    this.location  = new UnidocLocation()
    this.timestamp = Date.now()
    this.type      = UnidocEventType.DEFAULT_TYPE
    this.symbols   = Pack.uint32(128)
  }

  /**
  * @return This token as a javascript string.
  */
  public get text () : string {
    return String.fromCodePoint(...this.symbols)
  }

  /**
  * Update the content associated to this event.
  *
  * @param content - The new content associated to this event.
  */
  public set text (content : string) {
    this.symbols.clear()
    this.symbols.size = content.length

    for (let index = 0; index < content.length; ++index) {
      this.symbols.push(content.codePointAt(index))
    }
  }

  /**
  * A part of this token as a javascript string.
  *
  * @param start - Number of symbols of this token to skip.
  * @param [length = this.symbols.size - start] - Number of symbols of this token to keep.
  *
  * @return The requested part of this token as a string.
  */
  public substring (start : number, length : number = this.symbols.size - start) : string {
    const buffer : CodePoint[] = []
    const from : number = start
    const to : number = start + length

    for (let index = from; index < to; ++index) {
      buffer.push(this.symbols.get(index))
    }

    return String.fromCodePoint(...buffer)
  }

  /**
  * @return This token as a string without invisible symbols.
  */
  public get debugText () : string {
    const buffer : CodePoint[] = []

    for (const codePoint of this.symbols) {
      switch (codePoint) {
        case CodePoint.NEW_LINE:
          buffer.push(CodePoint.COLON)
          buffer.push(CodePoint.n)
          break
        case CodePoint.CARRIAGE_RETURN:
          buffer.push(CodePoint.COLON)
          buffer.push(CodePoint.r)
          break
        case CodePoint.TABULATION:
          buffer.push(CodePoint.COLON)
          buffer.push(CodePoint.t)
          break
        case CodePoint.SPACE:
          buffer.push(CodePoint.COLON)
          buffer.push(CodePoint.s)
          break
        case CodePoint.FORM_FEED:
          buffer.push(CodePoint.COLON)
          buffer.push(CodePoint.f)
          break
        default:
          buffer.push(codePoint)
          break
      }
    }

    return String.fromCodePoint(...buffer)
  }

  /**
  * @see UnidocEvent.clone
  */
  public clone () : UnidocCommonEvent {
    const result : UnidocCommonEvent = new UnidocCommonEvent()
    result.copy(this)
    return result
  }

  /**
  * Deep copy an existing instance.
  *
  * @param toCopy - An instance to copy.
  */
  public copy (toCopy : UnidocCommonEvent) : void {
    this.timestamp = toCopy.timestamp
    this.type      = toCopy.type
    this.location.copy(toCopy.location)
    this.symbols.copy(toCopy.symbols)
  }

  /**
  * @see UnidocEvent.clear
  */
  public clear () : void {
    this.timestamp = Date.now()
    this.type      = UnidocEventType.DEFAULT_TYPE
    this.location.clear()
    this.symbols.clear()
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    let result : string = ''

    result += this.timestamp
    result += ' '
    result += UnidocEventType.toString(this.type)
    result += ' '
    result += this.location.toString()
    result += ' \"'
    result += this.debugText
    result += '\"'

    return result
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocCommonEvent) {
      return other.timestamp === this.timestamp &&
             other.type === this.type &&
             other.location.equals(this.location)
    }

    return false
  }
}

export namespace UnidocCommonEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocCommonEvent) : UnidocCommonEvent {
    return toCopy == null ? null : toCopy.clone()
  }
}
