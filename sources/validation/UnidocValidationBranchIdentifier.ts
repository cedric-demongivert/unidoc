export class UnidocValidationBranchIdentifier {
  /**
  * An identifier that is unique over the entire validation tree.
  */
  public global: number

  /**
  * An identifier that is unique between the initialization of the branch and it's completion.
  */
  public local: number

  /**
  * Instantiate a new validation branch identifier.
  */
  public constructor() {
    this.global = 0
    this.local = 0
  }

  public set(globalIdentifier: number, localIdentifier: number): UnidocValidationBranchIdentifier {
    this.global = globalIdentifier
    this.local = localIdentifier
    return this
  }

  /**
  * Copy an existing branch identifier instance.
  *
  * @param toCopy - A branch identifier instance to copy.
  */
  public copy(toCopy: UnidocValidationBranchIdentifier): void {
    this.global = toCopy.global
    this.local = toCopy.local
  }

  /**
  * Reset this instance to it's initial state.
  */
  public clear(): void {
    this.global = 0
    this.local = 0
  }

  /**
  * @return A deep copy of this validation branch identifier.
  */
  public clone(): UnidocValidationBranchIdentifier {
    const result: UnidocValidationBranchIdentifier = new UnidocValidationBranchIdentifier()
    result.copy(this)
    return result
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    return this.global + ':' + this.local
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocValidationBranchIdentifier) {
      return other.global === this.global && other.local === this.local
    }

    return false
  }
}

export namespace UnidocValidationBranchIdentifier {
  /**
  * Instantiate a new validation branch identifier.
  *
  * @return A new validation branch identifier instance.
  */
  export function create(): UnidocValidationBranchIdentifier {
    return new UnidocValidationBranchIdentifier()
  }
}
