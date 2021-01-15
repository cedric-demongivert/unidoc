import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../event/UnidocEvent'
import { UnidocEventType } from '../../event/UnidocEventType'

import { UnidocReductionInputType } from './UnidocReductionInputType'

export class UnidocReductionInput {
  /**
  *
  */
  public type: UnidocReductionInputType

  /**
  *
  */
  public readonly event: UnidocEvent

  /**
  *
  */
  public group: any

  /**
  *
  */
  public constructor() {
    this.type = UnidocReductionInputType.DEFAULT
    this.event = new UnidocEvent()
    this.group = undefined
  }

  /**
  *
  */
  public isStart(): boolean {
    return this.type === UnidocReductionInputType.START
  }

  /**
  *
  */
  public isEnd(): boolean {
    return this.type === UnidocReductionInputType.END
  }

  /**
  *
  */
  public isEvent(): boolean {
    return this.type === UnidocReductionInputType.EVENT
  }

  /**
  *
  */
  public isWhitespace(): boolean {
    return (
      this.type === UnidocReductionInputType.EVENT &&
      this.event.type === UnidocEventType.WHITESPACE
    )
  }

  /**
  *
  */
  public isWord(content: string): boolean {
    return (
      this.type === UnidocReductionInputType.EVENT &&
      this.event.type === UnidocEventType.WORD &&
      this.event.text === content
    )
  }

  /**
  *
  */
  public isAnyWord(): boolean {
    return (
      this.type === UnidocReductionInputType.EVENT &&
      this.event.type === UnidocEventType.WORD
    )
  }

  /**
  *
  */
  public isStartOfTag(tag: string): boolean {
    return (
      this.type === UnidocReductionInputType.EVENT &&
      this.event.type === UnidocEventType.START_TAG &&
      this.event.tag === tag
    )
  }

  /**
  *
  */
  public isEndOfTag(tag: string): boolean {
    return (
      this.type === UnidocReductionInputType.EVENT &&
      this.event.type === UnidocEventType.END_TAG &&
      this.event.tag === tag
    )
  }

  /**
  *
  */
  public isStartOfAnyTag(): boolean {
    return (
      this.type === UnidocReductionInputType.EVENT &&
      this.event.type === UnidocEventType.START_TAG
    )
  }

  /**
  *
  */
  public isEndOfAnyTag(): boolean {
    return (
      this.type === UnidocReductionInputType.EVENT &&
      this.event.type === UnidocEventType.END_TAG
    )
  }

  /**
  *
  */
  public isStartOfAnyGroup(): boolean {
    return this.type === UnidocReductionInputType.GROUP_START
  }

  /**
  *
  */
  public isStartOfGroup(group: any): boolean {
    return (
      this.type === UnidocReductionInputType.GROUP_START &&
      this.group === group
    )
  }

  /**
  *
  */
  public isEndOfAnyGroup(): boolean {
    return this.type === UnidocReductionInputType.GROUP_END
  }

  /**
  *
  */
  public isEndOfGroup(group: any): boolean {
    return (
      this.type === UnidocReductionInputType.GROUP_END &&
      this.group === group
    )
  }


  /**
  *
  */
  public asStart(): UnidocReductionInput {
    this.type = UnidocReductionInputType.START
    this.event.clear()
    this.group = undefined
    return this
  }

  /**
  *
  */
  public asEvent(event: UnidocEvent): UnidocReductionInput {
    this.type = UnidocReductionInputType.EVENT
    this.event.copy(event)
    this.group = undefined
    return this
  }

  /**
  *
  */
  public asGroupStart(group: any): UnidocReductionInput {
    this.type = UnidocReductionInputType.GROUP_START
    this.event.clear()
    this.group = group
    return this
  }

  /**
  *
  */
  public asGroupEnd(group: any): UnidocReductionInput {
    this.type = UnidocReductionInputType.GROUP_END
    this.event.clear()
    this.group = group
    return this
  }

  /**
  *
  */
  public asEnd(): UnidocReductionInput {
    this.type = UnidocReductionInputType.END
    this.event.clear()
    this.group = undefined
    return this
  }

  /**
  *
  */
  public copy(toCopy: UnidocReductionInput): void {
    this.type = toCopy.type
    this.event.copy(toCopy.event)
    this.group = toCopy.group
  }

  /**
  *
  */
  public clear(): void {
    this.type = UnidocReductionInputType.DEFAULT
    this.event.clear()
    this.group = undefined
  }

  /**
  *
  */
  public clone(): UnidocReductionInput {
    const result: UnidocReductionInput = new UnidocReductionInput()
    result.copy(this)
    return result
  }

  /**
  *
  */
  public toString(): string {
    let result: string = this.constructor.name

    result += ' '
    result += UnidocReductionInputType.toDebugString(this.type)

    switch (this.type) {
      case UnidocReductionInputType.START:
      case UnidocReductionInputType.END:
        return result
      case UnidocReductionInputType.EVENT:
        return result + ' ' + this.event.toString()
      case UnidocReductionInputType.GROUP_START:
      case UnidocReductionInputType.GROUP_END:
        return result + ' ' + this.group
      default:
        throw new Error(
          'Unable to stringify reduction event of type ' +
          UnidocReductionInputType.toDebugString(this.type) + ' ' +
          'because no procedure was defined for that.'
        )
    }
  }

  /**
  *
  */
  public equals(other: any): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocReductionInput) {
      return (
        other.type === this.type &&
        other.event.equals(this.event) &&
        other.group === this.group
      )
    }

    return false
  }
}

export namespace UnidocReductionInput {
  /**
  *
  */
  export const START: UnidocReductionInput = new UnidocReductionInput().asStart()

  /**
  *
  */
  export const END: UnidocReductionInput = new UnidocReductionInput().asEnd()

  /**
  *
  */
  export function create(): UnidocReductionInput {
    return new UnidocReductionInput()
  }

  /**
  *
  */
  export function event(event: UnidocEvent): UnidocReductionInput {
    return new UnidocReductionInput().asEvent(event)
  }

  /**
  * Return a deep copy of the given instance.
  *
  * @param toCopy - An instance to copy.
  *
  * @return A deep copy of the given instance.
  */
  export function copy(toCopy: UnidocReductionInput): UnidocReductionInput
  export function copy(toCopy: null): null
  export function copy(toCopy: undefined): undefined
  export function copy(toCopy: UnidocReductionInput | null | undefined): UnidocReductionInput | null | undefined
  export function copy(toCopy: UnidocReductionInput | null | undefined): UnidocReductionInput | null | undefined {
    return toCopy == null ? toCopy : toCopy.clone()
  }

  /**
  *
  */
  export const ALLOCATOR: Allocator<UnidocReductionInput> = Allocator.fromFactory(create)

  /**
  * Return true if both object instances are equals.
  *
  * @param left - The first operand.
  * @param right - The second operand.
  *
  * @return True if both operand are equals.
  */
  export function equals(left?: UnidocReductionInput, right?: UnidocReductionInput): boolean {
    return left == null ? left == right : left.equals(right)
  }
}
