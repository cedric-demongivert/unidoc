import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'

import { UnidocKissValidatorOutput } from './UnidocKissValidatorOutput'

export class UnidocKissValidatorOutputBuilder {
  /**
  *
  */
  private readonly _output: UnidocKissValidatorOutput

  /**
  *
  */
  public constructor() {
    this._output = new UnidocKissValidatorOutput()
  }

  /**
  *
  */
  public asCurrent(): UnidocKissValidatorOutputBuilder {
    this._output.asCurrent()
    return this
  }

  /**
  *
  */
  public asNext(): UnidocKissValidatorOutputBuilder {
    this._output.asNext()
    return this
  }

  /**
  *
  */
  public asEmit(event: UnidocValidationEvent): UnidocKissValidatorOutputBuilder {
    this._output.asEmit(event)
    return this
  }

  /**
  *
  */
  public asEnd(): UnidocKissValidatorOutputBuilder {
    this._output.asEnd()
    return this
  }

  /**
  *
  */
  public build(): UnidocKissValidatorOutput {
    return this._output.clone()
  }

  /**
  *
  */
  public get(): UnidocKissValidatorOutput {
    return this._output
  }

  /**
  *
  */
  public configure(message: UnidocKissValidatorOutput): void {
    message.copy(this._output)
  }

  /**
  * Clear this event instance in order to reuse it.
  */
  public clear(): void {
    this._output.clear()
  }

  /**
  *
  */
  public copy(toCopy: UnidocKissValidatorOutput | UnidocKissValidatorOutputBuilder): UnidocKissValidatorOutputBuilder {
    if (toCopy instanceof UnidocKissValidatorOutputBuilder) {
      this._output.copy(toCopy._output)
    } else {
      this._output.copy(toCopy)
    }

    return this
  }

  /**
  * Return a copy of this instance.
  *
  * @return A copy of this instance.
  */
  public clone(): UnidocKissValidatorOutputBuilder {
    const result: UnidocKissValidatorOutputBuilder = new UnidocKissValidatorOutputBuilder()
    result.copy(this)
    return result
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocKissValidatorOutputBuilder) {
      return this._output.equals(other._output)
    }

    return false
  }
}

export namespace UnidocKissValidatorOutputBuilder {
  /**
  *
  */
  export const INSTANCE: UnidocKissValidatorOutputBuilder = new UnidocKissValidatorOutputBuilder()

  /**
  *
  */
  export function create(): UnidocKissValidatorOutputBuilder {
    return new UnidocKissValidatorOutputBuilder()
  }

  /**
  *
  */
  export function get(): UnidocKissValidatorOutputBuilder {
    return INSTANCE
  }
}
