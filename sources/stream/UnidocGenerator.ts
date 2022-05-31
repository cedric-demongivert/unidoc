import { Constructor } from '@cedric-demongivert/gl-tool-utils'

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
export function UnidocGenerator<Product, BaseConstructor extends Constructor>(ProduceClass: Constructor<Product>, BaseClass: BaseConstructor) {
  /**
   * 
   */
  return class UnidocGeneratorMixin extends BaseClass implements UnidocGenerator<Product> {
    /**
     * 
     */
    public get current(): Product | undefined {
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
    public next(): Product | undefined {
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
    public * generator(): Generator<Product, undefined, unknown> {
      while (this.running) {
        yield this.next()!
      }

      return undefined
    }
  }
}
