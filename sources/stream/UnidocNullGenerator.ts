import { UnidocGenerator } from "./UnidocGenerator"

/**
 * 
 */
export class UnidocNullGenerator<T> implements UnidocGenerator<T> {
  /**
   * @see UnidocGenerator.current
   */
  public get current(): undefined {
    return undefined
  }

  /**
   * @see UnidocGenerator.running
   */
  public get running(): boolean {
    return false
  }

  /**
   * @see UnidocGenerator.skip
   */
  public skip(elements: number = 1): this {
    return this
  }

  /**
   * @see UnidocGenerator.next
   */
  public next(): undefined {
    return undefined
  }

  /**
   * @see UnidocGenerator.generator
   */
  public * generator(): Generator<T, void, unknown> {

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
  export function create<T>(): UnidocNullGenerator<T> {
    return INSTANCE
  }
}
