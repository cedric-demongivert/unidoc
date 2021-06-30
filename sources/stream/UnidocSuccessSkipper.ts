import { UnidocFunction } from "./UnidocFunction"

/**
 * 
 */
export class UnidocSuccessSkipper<Input> extends UnidocFunction<Input> {
  /**
   * 
   */
  public start(): void {
    this.output.start()
  }

  /**
   * 
   */
  public next(value: Input): void {
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
    this.output.fail(error)
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
}