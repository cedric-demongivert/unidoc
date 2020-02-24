/**
* The location of a symbol in a unidoc document.
*/
export class UnidocLocation {
  /**
  * 0:0 location.
  */
  public static ZERO : UnidocLocation = new UnidocLocation()

  /**
  * A document stream column.
  */
  public column : number

  /**
  * A document stream line.
  */
  public line : number

  /**
  * A document stream code point.
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
  * Update this location by adding the given lines, columns and indices.
  *
  * @param line - Lines to add.
  * @param column - Columns to add.
  * @param index - Indices to add.
  */
  public add (line : number, column : number, index : number) : void {
    this.column += column
    this.line += line
    this.index += index
  }

  /**
  * Update this location by subtracting the given lines, columns and indices.
  *
  * @param line - Lines to add.
  * @param column - Columns to add.
  * @param index - Indices to add.
  */
  public subtract (line : number, column : number, index : number) : void {
    this.column -= column
    this.line -= line
    this.index -= index
  }

  /**
  * Update this location.
  *
  * @param line - Document line.
  * @param column - Document column.
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
  public copy (toCopy : UnidocLocation) : void  {
    this.column = toCopy.column
    this.line = toCopy.line
    this.index = toCopy.index
  }

  /**
  * Reset this instance in order to reuse-it.
  */
  public clear () : void {
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

    if (other instanceof UnidocLocation) {
      return other.line === this.line &&
             other.column === this.column &&
             other.index === this.index
    }
  }
}

export namespace UnidocLocation {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy (toCopy : UnidocLocation) : UnidocLocation {
    const result : UnidocLocation = new UnidocLocation()
    result.copy(toCopy)

    return result
  }
}
