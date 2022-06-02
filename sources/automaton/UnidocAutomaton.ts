
import { UnidocEvent, UnidocEventType } from '../event'
import { UnidocFunction } from '../stream'

import { UnidocAutomatonSchema } from "./UnidocAutomatonSchema"

/**
 * 
 */
export class UnidocAutomaton<Product> extends UnidocFunction<UnidocEvent, Product> {
  /**
   * 
   */
  private _depth: number = 0

  /**
   * 
   */
  public constructor() {
    super()
    this._depth = 0
  }

  /**
   * @see UnidocConsumer.prototype.next
   */
  public next(event: UnidocEvent): void {
    if (this._depth === 0) {
      this.handleNextContent(event)

      switch (event.type) {
        case UnidocEventType.WHITESPACE:
          return this.handleNextWhitespace(event)
        case UnidocEventType.WORD:
          return this.handleNextWord(event)
        case UnidocEventType.START_TAG:
          this._depth += 1
          return this.handleTagStart(event)
        case UnidocEventType.END_TAG:
          return this.throwIllegalTagEnd(event)
      }
    } else {
      switch (event.type) {
        case UnidocEventType.START_TAG:
          this._depth += 1
        case UnidocEventType.WHITESPACE:
        case UnidocEventType.WORD:
          this.handleChildContent(event)
          break
        case UnidocEventType.END_TAG:
          this._depth -= 1
          if (this._depth === 0) {
            this.handleTagEnd(event)
          } else {
            this.handleChildContent(event)
          }
          break
      }
    }
  }

  /**
   * 
   */
  public throwIllegalTagEnd(event: UnidocEvent): void {
    throw new Error(`Illegal tag termination ${event} : this event does not match any known opened tag.`)
  }

  /**
   * 
   */
  public handleChildContent(event: UnidocEvent): void {

  }

  /**
   * 
   */
  public handleTagStart(event: UnidocEvent): void {

  }

  /**
   * 
   */
  public handleTagEnd(event: UnidocEvent): void {

  }

  /**
   * 
   */
  public handleNextContent(event: UnidocEvent): void {

  }

  /**
   * 
   */
  public handleNextWhitespace(event: UnidocEvent): void {

  }

  /**
   * 
   */
  public handleNextWord(event: UnidocEvent): void {

  }
}

/**
 * 
 */
export namespace UnidocAutomaton {
  /**
   * 
   */
  export function start(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    UnidocAutomatonSchema.get(target.constructor).startListeners.add(propertyKey)

    return target
  }

  /**
   * 
   */
  export function whitespaces(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    UnidocAutomatonSchema.get(target.constructor).whitespaceListeners.add(propertyKey)

    return target
  }

  /**
   * 
   */
  export function words(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    UnidocAutomatonSchema.get(target.constructor).wordListeners.add(propertyKey)

    return target
  }

  /**
   * 
   */
  export function events(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    UnidocAutomatonSchema.get(target.constructor).eventListeners.add(propertyKey)

    return target
  }

  /**
   * 
   */
  export function success(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    UnidocAutomatonSchema.get(target.constructor).successListeners.add(propertyKey)

    return target
  }

  /**
   * 
   */
  export function result(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const metadata: UnidocAutomatonSchema = UnidocAutomatonSchema.get(target.constructor)

    if (metadata.resultProvider != null) {
      throw new Error(
        `Unable to register ${target.name}.${propertyKey} as a result provider because a provider was ` +
        `already registered (${metadata.resultProvider}).`
      )
    }

    metadata.resultProvider = propertyKey

    return target
  }
}