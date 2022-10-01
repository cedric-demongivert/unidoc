import { UnidocListener } from "./UnidocListener"
import { UnidocElement } from "./UnidocElement"
import { UnidocProducer } from "./UnidocProducer"

/**
 * 
 */
export class UnidocBufferizer<Element> extends UnidocListener<Element> {
  /**
   * 
   */
  public output: Array<UnidocElement<Element>>

  /**
   * 
   */
  public constructor(output: Array<UnidocElement<Element>>) {
    super()
    this.output = output
  }

  /**
   * @see UnidocListener.start
   */
  public start(): void {
    this.output.push(UnidocElement.start())
  }

  /**
   * @see UnidocListener.next
   */
  public next(element: Element): void {
    this.output.push(UnidocElement.next(element))
  }

  /**
   * @see UnidocListener.success
   */
  public success(): void {
    this.output.push(UnidocElement.success())
  }

  /**
   * @see UnidocListener.failure
   */
  public failure(error: Error): void {
    this.output.push(UnidocElement.failure(error))
  }
}

/**
 * 
 */
export namespace UnidocBufferizer {
  /**
   * 
   */
  export function create<Element>(output: Array<UnidocElement<Element>>): UnidocBufferizer<Element> {
    return new UnidocBufferizer(output)
  }

  /**
   * 
   */
  export function bufferize<Element>(producer: UnidocProducer<Element>): Array<UnidocElement<Element>> {
    const output: Array<UnidocElement<Element>> = []
    const bufferizer: UnidocBufferizer<Element> = UnidocBufferizer.create(output)
    bufferizer.subscribe(producer)
    return output
  }
}