/**
* The location of a symbol in a unidoc document.
*/
export class Location {
  /**
  * 0:0 location.
  */
  public static ZERO : Location = new Location()

  /**
  * The symbol column.
  */
  public column : number

  /**
  * The symbol line.
  */
  public line : number

  /**
  * Instantiate a new unidoc location.
  *
  * @param [column = 0] - Document column.
  * @param [line = 0] - Document line.
  */
  public constructor (column : number = 0, line : number = 0) {
    this.column = column
    this.line = line
  }

  /**
  * Update this location.
  *
  * @param column - Document column.
  * @param line - Document line.
  */
  public set (column : number, line : number) : void {
    this.column = column
    this.line = line
  }

  /**
  * Copy another location.
  *
  * @param toCopy - Another instance to copy.
  */
  public copy (toCopy : Location) : void  {
    this.column = toCopy.column
    this.line = toCopy.line
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return `${this.column}:${this.line}`
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof Location) {
      return other.line === this.line &&
             other.column === this.column
    }
  }
}

export namespace Location {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : Location) : Location {
    const result : Location = new Location()
    result.copy(toCopy)

    return result
  }
}
