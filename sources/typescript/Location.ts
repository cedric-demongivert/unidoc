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
  * The symbol index.
  */
  public index : number

  /**
  * Instantiate a new unidoc location.
  *
  * @param [line = 0] - Document line.
  * @param [column = 0] - Document column.
  * @param [index = 0] - Buffer index.
  */
  public constructor (
    line : number = 0,
    column : number = 0,
    index : number = 0
  ) {
    this.column = column
    this.line = line
    this.index = index
  }

  /**
  * Update this location.
  *
  * @param column - Document column.
  * @param line - Document line.
  * @param index - Buffer index.
  */
  public set (line : number, column : number, index : number) : void {
    this.column = column
    this.line = line
    this.index = index
  }

  /**
  * Copy another location.
  *
  * @param toCopy - Another instance to copy.
  */
  public copy (toCopy : Location) : void  {
    this.column = toCopy.column
    this.line = toCopy.line
    this.index = toCopy.index
  }

  /**
  * Reset this instance in order to reuse-it.
  */
  public reset () : void {
    this.column = 0
    this.line = 0
    this.index = 0
  }

  /**
  * @see Object#toString
  */
  public toString () : string {
    return `${this.line}:${this.column}/${this.index}`
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof Location) {
      return other.line === this.line &&
             other.column === this.column &&
             other.index === this.index
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
