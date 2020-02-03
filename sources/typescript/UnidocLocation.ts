/**
* The location of a symbol in a unidoc document.
*/
export class UnidocLocation {
  public static ZERO : UnidocLocation = new UnidocLocation()

  /**
  * The symbol column.
  */
  public column : number

  /**
  * The symbol line.
  */
  public line : number

  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  public static copy (toCopy : UnidocLocation) : UnidocLocation {
    const result : UnidocLocation = new UnidocLocation()
    result.copy(toCopy)

    return result
  }

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
  public copy (toCopy : UnidocLocation) : void  {
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

    if (other instanceof UnidocLocation) {
      return other.line === this.line &&
             other.column === this.column
    }
  }
}
