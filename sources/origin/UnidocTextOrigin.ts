import { UnidocOriginType } from './UnidocOriginType'
import { UnidocOrigin } from './UnidocOrigin'

/**
* An object that define a text at the origin of a unidoc value.
*/
export class UnidocTextOrigin implements UnidocOrigin {
  /**
  * @see UnidocOrigin.type
  */
  public readonly type : UnidocOriginType

  /**
  * @see UnidocOrigin.origin
  */
  public readonly origin : UnidocOrigin | null

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
  public readonly character : number

  /**
  * Instantiate a new buffer origin.
  *
  * @param line - The location in the text at the origin of the unidoc value.
  * @param column - The location in the text at the origin of the unidoc value.
  * @param character - The location in the text at the origin of the unidoc value.
  * @param [origin = null] - An origin in the resource.
  */
  public constructor (
    line : number,
    column : number,
    character : number,
    origin : UnidocOrigin | null = null
  ) {
    this.type = UnidocOriginType.TEXT
    this.origin = origin
    this.line = line
    this.column = column
    this.character = character
  }

  /**
  * @see UnidocOrigin.toElementString
  */
  public toElementString () : string {
    return 'character ' + this.character + ' at line ' + this.line +
           ' and column ' + this.column
  }

  /**
  * @see UnidocOrigin.toString
  */
  public toString () : string {
    return UnidocOrigin.toString(this)
  }

  /**
  * @see UnidocOrigin.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocTextOrigin) {
      return this.type === other.type &&
             this.character === other.character &&
             this.line === other.line &&
             this.column === other.column &&
             UnidocOrigin.equals(this.origin, other.origin)
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
  * @param character - The location in the text at the origin of the unidoc value.
  * @param [origin = null] - An origin in the resource.
  */
  export function create (
    line : number,
    column : number,
    character : number,
    origin : UnidocOrigin | null = null
  ) : UnidocTextOrigin {
    return new UnidocTextOrigin(line, column, character, origin)
  }
}
