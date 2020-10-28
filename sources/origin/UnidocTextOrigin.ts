import { UnidocLocation } from '../UnidocLocation'

import { UnidocOriginElementType } from './UnidocOriginElementType'
import { UnidocOriginElement } from './UnidocOriginElement'

/**
* An object that define a text at the origin of a unidoc value.
*/
export class UnidocTextOrigin implements UnidocOriginElement {
  /**
  * @see UnidocOriginElement.type
  */
  public readonly type : UnidocOriginElementType

  /**
  * The location in the text at the origin of the unidoc value.
  */
  public readonly line : number

  /**
  * The location in the text at the origin of the unidoc value.
  */
  public readonly column : number

  /**
  * The location in the text at the origin of the unidoc value.
  */
  public readonly index : number

  /**
  * Instantiate a new buffer origin.
  *
  * @param line - The location in the text at the origin of the unidoc value.
  * @param column - The location in the text at the origin of the unidoc value.
  * @param index - The location in the text at the origin of the unidoc value.
  */
  public constructor (line : number, column : number, index : number)
  public constructor (location : UnidocLocation)
  public constructor (...parameters : any[]) {
    this.type = UnidocOriginElementType.TEXT

    if (parameters.length === 1) {
      this.line = parameters[0].line
      this.column = parameters[0].column
      this.index = parameters[0].index
    } else {
      this.line = parameters[0]
      this.column = parameters[1]
      this.index = parameters[2]
    }
  }

  /**
  * @see UnidocOriginElement.toString
  */
  public toString () : string {
    return 'index ' + this.index + ' at line ' + this.line +
           ' and column ' + this.column
  }

  /**
  * @see UnidocOriginElement.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocTextOrigin) {
      return this.type === other.type &&
             this.index === other.index &&
             this.line === other.line &&
             this.column === other.column
    }

    return false
  }
}

export namespace UnidocTextOrigin {
  /**
  * Instantiate a new resource origin.
  *
  * @param line - The location in the text at the origin of the unidoc value.
  * @param column - The location in the text at the origin of the unidoc value.
  * @param index - The location in the text at the origin of the unidoc value.
  */
  export function create (line : number, column : number, index : number) : UnidocTextOrigin
  export function create (location : UnidocLocation) : UnidocTextOrigin
  export function create (a : any, b? : any, c? : any) : UnidocTextOrigin {
    return new UnidocTextOrigin(a, b, c)
  }
}
