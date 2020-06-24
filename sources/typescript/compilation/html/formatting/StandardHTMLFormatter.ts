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
  private _buffer : Pack<HTMLEvent>
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
    this._buffer = Pack.instance(HTMLEvent.ALLOCATOR, 68)
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

  }

  private handleWord (event : HTMLEvent) : void {

  }

  private handleTagStart (event : HTMLEvent) : void {
    if (event.block) {
      this.handleBlockStart(event)
    } else {
      this.handleInlineStart(event)
    }
  }

  private handleBlockStart (event : HTMLEvent) : void {
    this.flush()

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

  }

  private handleTagEnd (event : HTMLEvent) : void {
    if (event.block) {
      this.flush()
      this._depth -= 1
      this.publishBlockEnd(event)
    } else {
      this.handleInlineEnd(event)
    }
  }

  private handleInlineEnd (event : HTMLEvent) : void {

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
    this.publish(event.content)
    this.publish('-->')
    this._state = HTMLContentType.COMMENT
  }

  private publishBlockEnd (event : HTMLEvent) : void {
    if (this._state !== HTMLContentType.DOCUMENT_START) {
      this.publish(NEWLINE)
    }

    this.publish(this.pad(this._depth))

    this.publish('</')
    this.publish(event.tag)
    this.publish('>')
    this._state = HTMLContentType.BLOCK_END
  }

  private publishInlineBlockStart (event : HTMLEvent) : void {
    if (this._state !== HTMLContentType.DOCUMENT_START) {
      this.publish(NEWLINE)
    }

    this.publish(this.pad(this._depth))

    this.publish('<')
    this.publish(event.tag)

    for (const attribute of event.attributes.keys()) {
      this.publish(' ')
      this.publish(attribute)
      this.publish('="')
      this.publish(event.attributes.get(attribute).toString())
      this.publish('"')
    }

    this.publish('>')
    this._state = HTMLContentType.BLOCK_START
  }

  private publishMultilineBlockStart (event : HTMLEvent) : void {
    if (this._state !== HTMLContentType.DOCUMENT_START) {
      this.publish(NEWLINE)
    }

    this.publish(this.pad(this._depth))

    this.publish('<')
    this.publish(event.tag)
    this.publish(NEWLINE)

    for (const attribute of event.attributes.keys()) {
      this.publish(this.pad(this._depth + 1))
      this.publish(attribute)
      this.publish('="')
      this.publish(event.attributes.get(attribute).toString())
      this.publish('"')
      this.publish(NEWLINE)
    }

    this.publish(this.pad(this._depth))
    this.publish('>')
    this._state = HTMLContentType.BLOCK_START
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

  private sizeof (event : HTMLEvent) : number {
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
    }
  }

  private sizeofWhitespace (event : HTMLEvent) : number {
    return 1
  }

  private sizeofWord (event : HTMLEvent) : number {
    return event.content.length
  }

  private sizeofTagStart (event : HTMLEvent) : number {
    let result : number = 1 + event.tag.length

    for (const attribute of event.attributes.keys()) {
      result += 1
      result += attribute.length
      result += 2
      result += event.attributes.get(attribute).toString().length
      result += 1
    }

    return result + 1
  }

  private sizeofTagEnd (event : HTMLEvent) : number {
    return 1
  }

  private sizeofComment (event : HTMLEvent) : number {
    return 4 + event.content.length + 3
  }

  public flush () : void {

  }

  /**
  * @see HTMLFormatter.complete
  */
  public complete () : void {
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
