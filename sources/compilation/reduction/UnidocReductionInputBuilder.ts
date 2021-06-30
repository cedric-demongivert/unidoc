import { UnidocEvent } from '../../event/UnidocEvent'

import { UnidocReductionInput } from './UnidocReductionInput'

export class UnidocReductionInputBuilder {
  /**
   *
   */
  private readonly _event: UnidocReductionInput

  /**
   * Instantiate a new unidoc event.
   */
  public constructor() {
    this._event = new UnidocReductionInput()
  }

  /**
   *
   */
  public asStart(): this {
    this._event.copy(UnidocReductionInput.START)
    return this
  }

  /**
   *
   */
  public asEvent(event: UnidocEvent): this {
    this._event.asEvent(event)
    return this
  }

  /**
   *
   */
  public asGroupStart(group: any): this {
    this._event.asGroupStart(group)
    return this
  }

  /**
   *
   */
  public asGroupEnd(group: any): this {
    this._event.asGroupEnd(group)
    return this
  }

  /**
   *
   */
  public asEnd(): this {
    this._event.copy(UnidocReductionInput.END)
    return this
  }

  /**
   * 
   */
  public get(): UnidocReductionInput {
    return this._event
  }

  /**
   * 
   */
  public build(): UnidocReductionInput {
    return this._event.clone()
  }

  /**
   *
   */
  public clear(): void {
    this._event.clear()
  }
}

/**
 * 
 */
export namespace UnidocReductionInputProducer {
  /**
  *
  */
  export function create(): UnidocReductionInputBuilder {
    return new UnidocReductionInputBuilder()
  }
}
