import { Clonable } from "@cedric-demongivert/gl-tool-utils"
import { UnidocListener } from "./UnidocListener"
import { UnidocElement } from "./UnidocElement"
import { UnidocProducer } from "./UnidocProducer"

/**
 * 
 */
export class UnidocDuplicator<Element extends Clonable<Element>> extends UnidocListener<Element> {
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
    this.output.push(UnidocElement.next(element.clone()))
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
export namespace UnidocDuplicator {
  /**
   * 
   */
  export function create<Element extends Clonable<Element>>(output: Array<UnidocElement<Element>>): UnidocDuplicator<Element> {
    return new UnidocDuplicator(output)
  }

  /**
   * 
   */
  export function duplicate<Element extends Clonable<Element>>(producer: UnidocProducer<Element>): Array<UnidocElement<Element>> {
    const output: Array<UnidocElement<Element>> = []
    const duplicator: UnidocDuplicator<Element> = UnidocDuplicator.create(output)
    duplicator.subscribe(producer)
    return output
  }
}