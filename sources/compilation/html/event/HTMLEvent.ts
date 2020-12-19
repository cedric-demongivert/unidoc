import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { HTMLEventType } from './HTMLEventType'
import { HTMLTag } from './HTMLTag'
import { HTMLAttribute } from './HTMLAttribute'

export class HTMLEvent {
  public tag: HTMLTag | null
  public content: string | null
  public block: boolean
  public type: HTMLEventType
  public readonly attributes: Map<HTMLAttribute, string | boolean>

  public constructor() {
    this.tag = null
    this.content = null
    this.block = false
    this.type = HTMLEventType.WHITESPACE
    this.attributes = new Map<HTMLAttribute, string | boolean>()
  }

  public appendClass(clazz: string): void {
    if (!this.attributes.has(HTMLAttribute.CLASS)) {
      this.attributes.set(HTMLAttribute.CLASS, clazz)
    } else {
      const value: string = this.attributes.get(HTMLAttribute.CLASS) as string
      this.attributes.set(HTMLAttribute.CLASS, value + ' ' + clazz)
    }
  }

  public appendClasses(classes: Iterable<string>): void {
    for (const clazz of classes) {
      this.appendClass(clazz)
    }
  }

  public prependClass(clazz: string): void {
    if (!this.attributes.has(HTMLAttribute.CLASS)) {
      this.attributes.set(HTMLAttribute.CLASS, clazz)
    } else {
      const value: string = this.attributes.get(HTMLAttribute.CLASS) as string
      this.attributes.set(HTMLAttribute.CLASS, clazz + ' ' + value)
    }
  }

  public prependClasses(classes: Iterable<string>): void {
    for (const clazz of classes) {
      this.prependClass(clazz)
    }
  }

  /**
  * Copy the state of an existing event such as both event instance are equals.
  *
  * @param toCopy - The event to copy.
  */
  public copy(toCopy: HTMLEvent): void {
    this.tag = toCopy.tag
    this.content = toCopy.content
    this.block = toCopy.block
    this.type = toCopy.type
    this.attributes.clear()

    for (const key of toCopy.attributes.keys()) {
      this.attributes.set(key, toCopy.attributes.get(key) as (string | boolean))
    }
  }

  /**
  * Make a clone of this instance and return it.
  *
  * @return A clone of this instance.
  */
  public clone(): HTMLEvent {
    const result: HTMLEvent = new HTMLEvent()

    result.copy(this)

    return result
  }

  /**
  * Reset this instance inner state to the state it was in after it's
  * instantiation.
  */
  public clear(): void {
    this.tag = null
    this.content = null
    this.block = false
    this.type = HTMLEventType.WHITESPACE
    this.attributes.clear()
  }

  /**
  * @see Object.toString
  */
  public toString(): string {
    switch (this.type) {
      case HTMLEventType.WHITESPACE:
        return ':s'
      case HTMLEventType.WORD:
        return this.content as string
      case HTMLEventType.START_TAG:
        let result: string = '<'
        result += this.tag

        for (const key of this.attributes.keys()) {
          result += ' '
          result += key
          result += '="'
          result += (this.attributes.get(key) as (string | boolean)).toString()
          result += '"'
        }

        result += '>'
        return result
      case HTMLEventType.END_TAG:
        return '</' + this.tag + '>'
      case HTMLEventType.COMMENT:
        return '<!--' + this.content + '-->'
      default:
        throw new Error(
          'Unhandled event type : ' + HTMLEventType.toString(this.type) + '.'
        )
    }
  }

  /**
  * @see Object.equals
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof HTMLEvent) {
      if (other.attributes.size !== this.attributes.size) {
        return false
      }

      for (const key of other.attributes.keys()) {
        if (
          !this.attributes.has(key) ||
          this.attributes.get(key) !== other.attributes.get(key)
        ) { return false }
      }

      return this.tag === other.tag &&
        this.content === other.content &&
        this.block === other.block &&
        this.type === other.type
    }

    return false
  }
}

export namespace HTMLEvent {
  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy(toCopy: HTMLEvent): HTMLEvent {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  export function create(): HTMLEvent {
    return new HTMLEvent()
  }

  export const ALLOCATOR: Allocator<HTMLEvent> = Allocator.fromFactory(create)

  export function equals(left: HTMLEvent, right: HTMLEvent): boolean {
    return left == null ? left == right : left.equals(right)
  }
}
