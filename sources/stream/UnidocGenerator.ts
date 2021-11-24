import { Constructor } from '../Constructor'

/**
 * 
 */
export interface UnidocGenerator<Output> {
  /**
   * 
   */
  readonly current: Output | undefined

  /**
   * 
   */
  readonly running: boolean

  /**
   * 
   */
  skip(elements?: number | undefined): this

  /**
   * 
   */
  next(): Output | undefined

  /**
   * 
   */
  generator(): Generator<Output, void, unknown>
}

/**
 * 
 */
export function UnidocGenerator<Produce, BaseConstructor extends Constructor>(ProduceClass: Constructor<Produce>, BaseClass: BaseConstructor) {
  /**
   * 
   */
  return class UnidocGeneratorMixin extends BaseClass implements UnidocGenerator<Produce> {
    /**
     * 
     */
    public get current(): Produce | undefined {
      return undefined
    }

    /**
     * 
     */
    public get running(): boolean {
      return false
    }

    /**
     * 
     */
    public next(): Produce | undefined {
      return undefined
    }

    /**
     * 
     */
    public skip(elements: number = 1): this {
      for (let index = 0; index < elements; ++index) {
        this.next()
      }

      return this
    }

    /**
     * 
     */
    public * generator(): Generator<Produce, undefined, unknown> {
      while (this.running) {
        yield this.next()!
      }

      return undefined
    }
  }
}
