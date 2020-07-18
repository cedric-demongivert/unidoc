/**
* The location of a symbol in a unidoc document.
*/
export class UnidocLocation {
  /**
  * 0:0 location.
  */
  public static ZERO : UnidocLocation = new UnidocLocation(0, 0, 0)

  /**
  * Unknown location.
  */
  public static UNKNOWN : UnidocLocation = new UnidocLocation(-1, -1, -1)

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
  public constructor (line : number = 0, column : number = 0, index : number = 0) {
    this.column = column
    this.line = line
    this.index = index
  }

  /**
  * Set this location to unknown.
  */
  public asUnknown () : void {
    this.column = -1
    this.line   = -1
    this.index  = -1
  }

  /**
  * @return True if this location is unknown.
  */
  public isUnknown () : boolean {
    return this.index === -1
  }

  /**
  * Update this location by adding the given lines, columns and indices.
  *
  * Adding values to a unknown location let the location unknown.
  *
  * @param line - Lines to add.
  * @param column - Columns to add.
  * @param index - Indices to add.
  */
  public add (line : number, column : number, index : number) : void {
    if (this.index < 0) return

    this.column += column
    this.line += line
    this.index += index
  }

  /**
  * Update this location by subtracting the given lines, columns and indices.
  *
  * Subtracting values to a unknown location let the location unknown.
  *
  * @param line - Lines to subtract.
  * @param column - Columns to subtract.
  * @param index - Indices to subtract.
  */
  public subtract (line : number, column : number, index : number) : void {
    if (this.index < 0) return

    this.column = Math.max(this.column - column, 0)
    this.line = Math.max(this.line - line, 0)
    this.index = Math.max(this.index - index, 0)
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
  * @return A copy of this location.
  */
  public clone () : UnidocLocation  {
    const result : UnidocLocation = new UnidocLocation()
    result.copy(this)
    return result
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
    return this.index < 0 ? 'unknown'
                          : `${this.line}:${this.column}/${this.index}`
  }

  /**
  * @see Object#equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocLocation) {
      return other.index === -1 && this.index === - 1 ||
             other.line === this.line &&
             other.column === this.column &&
             other.index === this.index
    }

    return false
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
  export function copy (toCopy : UnidocLocation) : UnidocLocation
  export function copy (toCopy : null) : null
  export function copy (toCopy : UnidocLocation | null) : UnidocLocation | null {
    return toCopy == null ? toCopy : toCopy.clone()
  }
}
