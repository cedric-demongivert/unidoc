import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { HTMLEvent } from '../event/HTMLEvent'
import { HTMLEventType } from '../event/HTMLEventType'

import { ListenableHTMLFormatter } from './ListenableHTMLFormatter'
import { HTMLContentType } from './HTMLContentType'

const TAB_LENGTH : number = 2
const NEWLINE : string = '\r\n'

export class StandardHTMLFormatter extends ListenableHTMLFormatter {
  /**
  * Buffer of events to fill until a title was discovered.
  */
  private _buffer : Pack<string>
  private _bufferWidth : number
  private _spaces : number

  private _state : HTMLContentType
  private _depth : number

  public pageWidth : number
  public minimumLineWidth : number

  /**
  *
  */
  public constructor () {
    super()
    this._buffer = Pack.any(32)
    this._bufferWidth = 0
    this._spaces = 0
    this._state = HTMLContentType.DOCUMENT_START
    this._depth = 0
    this.pageWidth = 80
    this.minimumLineWidth = 50
  }

  /**
  * @see HTMLFormatter.start
  */
  public start () : void {
    this._buffer.clear()
    this._state = HTMLContentType.DOCUMENT_START
    this._bufferWidth = 0
    this._spaces = 0
    this._depth = 0
  }

  /**
  * @see HTMLFormatter.next
  */
  public next (event : HTMLEvent) : void {
    switch (event.type) {
      case HTMLEventType.WHITESPACE:
        return this.handleWhitespace(event)
      case HTMLEventType.WORD:
        return this.handleWord(event)
      case HTMLEventType.START_TAG:
        return this.handleTagStart(event)
      case HTMLEventType.END_TAG:
        return this.handleTagEnd(event)
      case HTMLEventType.COMMENT:
        return this.handleComment(event)
    }
  }

  private handleWhitespace (event : HTMLEvent) : void {
    if (this._buffer.size <= 0) return

    const availableSpace : number = this.availableSpace() - this._bufferWidth
    const tokenSize : number = this.sizeofWhitespace(event)

    if (tokenSize > availableSpace) {
      this.publishInlineContent()
    } else {
      this._buffer.push(' ')
      this._spaces += 1
      this._bufferWidth += tokenSize
    }
  }

  private handleWord (event : HTMLEvent) : void {
    const availableSpace : number = this.availableSpace() - this._bufferWidth
    const tokenSize : number = this.sizeofWord(event)

    if (tokenSize > availableSpace) {
      this.publishInlineContent()
    }

    this._buffer.push(event.content as string)
    this._bufferWidth += tokenSize
  }

  private handleTagStart (event : HTMLEvent) : void {
    if (event.block) {
      this.handleBlockStart(event)
    } else {
      this.handleInlineStart(event)
    }
  }

  private handleBlockStart (event : HTMLEvent) : void {
    this.publishInlineContentIfExists()

    const length : number = this.sizeofTagStart(event)
    const availableSpace : number = this.availableSpace()

    if (length < availableSpace) {
      this.publishInlineBlockStart(event)
    } else {
      this.publishMultilineBlockStart(event)
    }

    this._depth += 1
  }

  private handleInlineStart (event : HTMLEvent) : void {
    const availableSpace : number = this.availableSpace() - this._bufferWidth
    const tokenSize : number = this.sizeofTagStart(event)

    if (tokenSize > availableSpace) {
      this.publishInlineContentIfExists()
    }

    this._buffer.push('<')
    this._buffer.push(event.tag as string)

    for (const attribute of event.attributes.keys()) {
      this._buffer.push(' ')
      this._buffer.push(attribute)
      this._buffer.push('="')
      this._buffer.push((event.attributes.get(attribute) as (string | boolean)).toString())
      this._buffer.push('"')
    }

    this._buffer.push('>')
    this._bufferWidth += tokenSize
  }

  private handleTagEnd (event : HTMLEvent) : void {
    if (event.block) {
      this.publishInlineContentIfExists()
      this._depth -= 1
      this.publishBlockEnd(event)
    } else {
      this.handleInlineEnd(event)
    }
  }

  private handleInlineEnd (event : HTMLEvent) : void {
    const availableSpace : number = this.availableSpace() - this._bufferWidth
    const tokenSize : number = this.sizeofTagEnd(event)

    if (tokenSize > availableSpace) {
      this.publishInlineContentIfExists()
    }

    this._buffer.push('</')
    this._buffer.push(event.tag as string)
    this._buffer.push('>')
    this._bufferWidth += tokenSize
  }

  private handleComment (event : HTMLEvent) : void {
    this.publishCommentary(event)
  }

  private publishCommentary (event : HTMLEvent) : void {
    if (this._state === HTMLContentType.COMMENT) {
      this.publish(NEWLINE)
      this.publish(this.pad(this._depth))
    }

    this.publish('<!--')
    this.publish(event.content as string)
    this.publish('-->')
    this._state = HTMLContentType.COMMENT
  }

  private publishBlockEnd (event : HTMLEvent) : void {
    if (this._state !== HTMLContentType.DOCUMENT_START) {
      this.publish(NEWLINE)
    }

    this.publish(this.pad(this._depth))

    this.publish('</')
    this.publish(event.tag as string)
    this.publish('>')
    this._state = HTMLContentType.BLOCK_END
  }

  private publishInlineBlockStart (event : HTMLEvent) : void {
    if (this._state !== HTMLContentType.DOCUMENT_START) {
      this.publish(NEWLINE)
      this.publish(NEWLINE)
    }

    this.publish(this.pad(this._depth))

    this.publish('<')
    this.publish(event.tag as string)

    for (const attribute of event.attributes.keys()) {
      this.publish(' ')
      this.publish(attribute)
      this.publish('="')
      this.publish((event.attributes.get(attribute) as (string | boolean)).toString())
      this.publish('"')
    }

    this.publish('>')
    this._state = HTMLContentType.BLOCK_START
  }

  private publishMultilineBlockStart (event : HTMLEvent) : void {
    if (this._state !== HTMLContentType.DOCUMENT_START) {
      this.publish(NEWLINE)
      this.publish(NEWLINE)
    }

    this.publish(this.pad(this._depth))

    this.publish('<')
    this.publish(event.tag as string)
    this.publish(NEWLINE)

    for (const attribute of event.attributes.keys()) {
      this.publish(this.pad(this._depth + 1))
      this.publish(attribute)
      this.publish('="')
      this.publish((event.attributes.get(attribute) as (string | boolean)).toString())
      this.publish('"')
      this.publish(NEWLINE)
    }

    this.publish(this.pad(this._depth))
    this.publish('>')
    this._state = HTMLContentType.BLOCK_START
  }

  public publishInlineContentIfExists () : void {
    if (this._bufferWidth > 0) {
      this.publishInlineContent()
    }
  }

  public publishInlineContent () : void {
    this.publish(NEWLINE)
    this.publish(this.pad(this._depth))

    for (const token of this._buffer) {
      this.publish(token)
    }

    this._buffer.clear()
    this._bufferWidth = 0
    this._spaces = 0

    this._state = HTMLContentType.INLINE
  }

  private pad (length : number) : string {
    return ' '.repeat(TAB_LENGTH).repeat(length)
  }

  private availableSpace () : number {
    return Math.max(
      this.pageWidth - this._depth * TAB_LENGTH,
      this.minimumLineWidth
    )
  }

  private sizeof (event : HTMLEvent) : number | undefined {
    switch (event.type) {
      case HTMLEventType.WHITESPACE:
        return this.sizeofWhitespace(event)
      case HTMLEventType.WORD:
        return this.sizeofWord(event)
      case HTMLEventType.START_TAG:
        return this.sizeofTagStart(event)
      case HTMLEventType.END_TAG:
        return this.sizeofTagEnd(event)
      case HTMLEventType.COMMENT:
        return this.sizeofComment(event)
      default:
        return undefined
    }
  }

  private sizeofWhitespace (event : HTMLEvent) : number {
    return 1
  }

  private sizeofWord (event : HTMLEvent) : number {
    return (event.content as string).length
  }

  private sizeofTagStart (event : HTMLEvent) : number {
    let result : number = 1 + (event.tag as string).length

    for (const attribute of event.attributes.keys()) {
      result += 1
      result += attribute.length
      result += 2
      result += (event.attributes.get(attribute) as (string | boolean)).toString().length
      result += 1
    }

    return result + 1
  }

  private sizeofTagEnd (event : HTMLEvent) : number {
    return 2 + (event.tag as string).length + 1
  }

  private sizeofComment (event : HTMLEvent) : number {
    return 4 + (event.content as string).length + 3
  }

  /**
  * @see HTMLFormatter.complete
  */
  public complete () : void {
    this.publishInlineContentIfExists()
    this.publishCompletion()
  }

  /**
  * @see HTMLFormatter.reset
  */
  public reset () : void {
    this._buffer.clear()
    this._bufferWidth = 0
    this._state = HTMLContentType.DOCUMENT_START
    this._spaces = 0
    this._depth = 0
  }

  /**
  * @see HTMLFormatter.clear
  */
  public clear () : void {
    super.clear()
    this._buffer.clear()
    this._bufferWidth = 0
    this._spaces = 0
    this._state = HTMLContentType.DOCUMENT_START
    this._depth = 0
  }
}
