import { UnidocProcess } from "./UnidocProcess"
import { UnidocProducer } from "./UnidocProducer"

/**
 * 
 */
export class UnidocSuccessSkipper<Product> extends UnidocProcess<Product> {
  /**
   * 
   */
  public start(): void {
    this.output.start()
  }

  /**
   * 
   */
  public next(value: Product): void {
    this.output.next(value)
  }

  /**
   * 
   */
  public success(): void {

  }

  /**
   * 
   */
  public failure(error: Error): void {
    this.output.failure(error)
  }
}

/**
 * 
 */
export namespace UnidocSuccessSkipper {
  /**
   * 
   */
  export function create<Produce>(): UnidocSuccessSkipper<Produce> {
    return new UnidocSuccessSkipper()
  }

  /**
   * 
   */
  export function skip<Product>(producer: UnidocProducer<Product>): UnidocProducer<Product> {
    const skipper: UnidocSuccessSkipper<Product> = UnidocSuccessSkipper.create()

    skipper.subscribe(producer)

    return skipper
  }
}