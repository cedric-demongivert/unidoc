import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocLocation } from '../location/UnidocLocation'

import { UnidocOriginElement } from './UnidocOriginElement'

export class UnidocOrigin {
  public readonly elements : Pack<UnidocOriginElement>

  public constructor (capacity : number = 8) {
    this.elements = Pack.any(capacity)
  }

  public reallocate (capacity : number) : void {
    this.elements.reallocate(capacity)
  }

  public text (line : number, column : number, character : number) : UnidocOrigin
  public text (location : UnidocLocation) : UnidocOrigin
  public text (a : any, b? : any, c? : any) : UnidocOrigin {
    this.elements.push(UnidocOriginElement.text(a, b, c))
    return this
  }

  public buffer (byte : number) : UnidocOrigin {
    this.elements.push(UnidocOriginElement.buffer(byte))
    return this
  }

  public resource (unifiedResourceIdentifier : string) : UnidocOrigin {
    this.elements.push(UnidocOriginElement.resource(unifiedResourceIdentifier))
    return this
  }

  public network (address : string) : UnidocOrigin {
    this.elements.push(UnidocOriginElement.network(address))
    return this
  }

  public runtime () : UnidocOrigin {
    this.elements.push(UnidocOriginElement.runtime())
    return this
  }

  public concat (toCopy : UnidocOrigin) : void {
    this.elements.concat(toCopy.elements)
  }

  public copy (toCopy : UnidocOrigin) : void {
    this.elements.copy(toCopy.elements)
  }

  public clone () : UnidocOrigin {
    const result : UnidocOrigin = new UnidocOrigin(this.elements.capacity)

    result.copy(this)

    return result
  }

  public clear () : void {
    this.elements.clear()
  }

  /**
  * @see Object.toString
  */
  public toString () : string {
    if (this.elements.size > 0) {
      let result : string = this.elements.first.toString()

      for (let index = 1; index < this.elements.size; ++index) {
        result += ' at ' + this.elements.get(index).toString()
      }

      return result
    } else {
      return 'undefined origin'
    }
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocOrigin) {
      return other.elements.equals(this.elements)
    }

    return false
  }
}

export namespace UnidocOrigin {
  export const Element = UnidocOriginElement

  export const RUNTIME : UnidocOrigin = new UnidocOrigin(1).runtime()

  export function runtime () : UnidocOrigin {
    return RUNTIME
  }
}
