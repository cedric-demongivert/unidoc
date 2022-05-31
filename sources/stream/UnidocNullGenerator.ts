import { UnidocGenerator } from "./UnidocGenerator"

/**
 * 
 */
export class UnidocNullGenerator<Product> implements UnidocGenerator<Product> {
  /**
   * @see UnidocGenerator.prototype.current
   */
  public get current(): undefined {
    return undefined
  }

  /**
   * @see UnidocGenerator.prototype.running
   */
  public get running(): boolean {
    return false
  }

  /**
   * @see UnidocGenerator.prototype.skip
   */
  public skip(elements: number = 1): this {
    return this
  }

  /**
   * @see UnidocGenerator.prototype.next
   */
  public next(): undefined {
    return undefined
  }

  /**
   * @see UnidocGenerator.prototype.generator
   */
  public * generator(): Generator<Product, void, unknown> {

  }
}

/**
 * 
 */
export namespace UnidocNullGenerator {
  /**
   * 
   */
  const INSTANCE: UnidocNullGenerator<any> = new UnidocNullGenerator<any>()

  /**
   * 
   */
  export function create<Product>(): UnidocNullGenerator<Product> {
    return INSTANCE
  }
}
