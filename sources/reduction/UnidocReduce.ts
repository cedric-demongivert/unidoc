import { UnidocElement, UnidocFunction } from '../stream'
import { UnidocEvent } from '../event'

import { UnidocReducer } from './UnidocReducer'
import { UnidocReduction } from './UnidocReduction'

/**
 * 
 */
export class UnidocReduce<Product> extends UnidocFunction<UnidocEvent, Product> {
  /**
   * 
   */
  private readonly _element: UnidocElement<Readonly<UnidocEvent>>

  /**
   *
   */
  public readonly reducer: UnidocReducer<Product>

  /**
   *
   */
  private _reduction: UnidocReduction<Product> | null

  /**
   * 
   */
  private _result: UnidocReduction.Result<Product> | null

  /**
   *
   */
  public constructor(reducer: UnidocReducer<Product>) {
    super()

    this.reducer = reducer
    this._element = new UnidocElement()
    this._reduction = null
    this._result = null
  }

  /**
   * 
   */
  public start(): void {
    this._reduction = this.reducer()

    try {
      this._result = UnidocReduction.push(UnidocElement.start(), this._reduction)
    } catch (error) {
      this.handleReductionFailure(error)
    }
  }

  /**
   * 
   */
  public next(event: Readonly<UnidocEvent>): void {
    const reduction: UnidocReduction<Product> | null = this._reduction

    if (reduction == null) {
      throw new Error(
        `Unable to reduce event ${event.toString()} because no reduction process was instantiated, ` +
        `please initialize the consumer by calling the ${this.start.name} method.`
      )
    }

    if (this._result != null && this._result.done) return

    try {
      this._result = UnidocReduction.push(this._element.asNext(event), reduction)
    } catch (error) {
      this.handleReductionFailure(error)
    }
  }

  /**
   * 
   */
  public success(): void {
    const reduction: UnidocReduction<Product> | null = this._reduction

    if (reduction == null) {
      throw new Error(
        `Unable to finalize the reduction process because no reduction process was instantiated, ` +
        `please initialize the consumer by calling the ${this.start.name} method.`
      )
    }

    if (this._result != null && this._result.done) {
      return this.handleReductionSuccess(this._result.value)
    }

    try {
      const result: UnidocReduction.Result<Product> = UnidocReduction.push(UnidocElement.success(), reduction)

      if (result.done) {
        return this.handleReductionSuccess(result.value)
      }
    } catch (error) {
      return this.handleReductionFailure(error)
    }

    throw new Error(
      `Unable to finalize the reduction process because the underlying process as not finished yet, ` +
      `please look at your reducer logic, all reducers must stop after the reception of a success event.`
    )
  }

  /**
   * 
   */
  public failure(error: Error): void {
    const process: UnidocReduction<Product> | null = this._reduction

    if (process == null) {
      throw new Error(
        `Unable to interupt the reduction process because no reduction process was instantiated, ` +
        `please initialize the consumer by calling the ${this.start.name} method.`
      )
    }

    if (this._result != null && this._result.done) {
      return this.handleReductionSuccess(this._result.value)
    }

    this.handleReductionFailure(error)
  }

  /**
   * 
   */
  private handleReductionSuccess(product: Product): void {
    this.output.start()
    this.output.next(product)
    this.output.success()

    this._reduction = null
    this._result = null
  }

  /**
   * 
   */
  private handleReductionFailure(error: Error): void {
    this.output.start()
    this.output.fail(error)

    this._reduction = null
    this._result = null
  }
}

/**
 * 
 */
export namespace UnidocReduce {
  /**
   * 
   */
  export function create<Product>(reducer: UnidocReducer<Product>): UnidocReduce<Product> {
    return new UnidocReduce(reducer)
  }
}
