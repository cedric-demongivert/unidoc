import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocEvent } from '../../../event/UnidocEvent'
import { UnidocEventType } from '../../../event/UnidocEventType'

import { Paragraph } from '../../../standard/Paragraph'
import { Title } from '../../../standard/Title'
import { Emphasize } from '../../../standard/Emphasize'

import { ListenableHTMLCompiler } from './ListenableHTMLCompiler'
import { HTMLTag } from '../event/HTMLTag'
import { HTMLEvent } from '../event/HTMLEvent'
import { HTMLEventType } from '../event/HTMLEventType'
import { HTMLAttribute } from '../event/HTMLAttribute'

export class ParagraphHTMLCompiler extends ListenableHTMLCompiler {
  /**
  * Buffer of events to fill until a title was discovered.
  */
  private _buffer : Pack<HTMLEvent>

  /**
  * An html event instance for event manipulation.
  */
  private _event : HTMLEvent

  /**
  * True if the previous state was a whitespace.
  */
  private _wasWhitespace : boolean

  /**
  * True if a title was discovered.
  */
  private _wasTitleDiscovered : boolean

  /**
  *
  */
  public constructor () {
    super()
    this._buffer = Pack.instance(HTMLEvent.ALLOCATOR, 68)
    this._wasWhitespace = true
    this._wasTitleDiscovered = false
    this._event = new HTMLEvent()
  }

  /**
  * @see HTMLCompiler.start
  */
  public start () : void {
    this._buffer.clear()
    this._wasWhitespace = true
    this._wasTitleDiscovered = false
  }

  /**
  * @see HTMLCompiler.next
  */
  public next (event : UnidocEvent) : void {
    switch (event.type) {
      case UnidocEventType.WHITESPACE:
        return this.handleWhitespace(event)
      default:
        return this.handleContent(event)
    }
  }

  public handleContent (event : UnidocEvent) : void {
    this._wasWhitespace = false

    switch (event.type) {
      case UnidocEventType.WORD:
        return this.handleWord(event)
      case UnidocEventType.START_TAG:
        return this.handleTagStart(event)
      case UnidocEventType.END_TAG:
        return this.handleTagEnd(event)
      default:
        throw new Error(
          'Unhandled unidoc event type : ' +
          UnidocEventType.toString(event.type) + '.'
        )
    }
  }

  private handleTagStart (event : UnidocEvent) : void {
    this._wasWhitespace = true
    this._event.clear()
    this._event.type = HTMLEventType.START_TAG

    if (event.identifier != null) {
      this._event.attributes.set(HTMLAttribute.IDENTIFIER, event.identifier)
    }

    if (event.classes.size > 0) {
      this._event.appendClasses(event.classes)
    }

    switch (event.tag) {
      case Paragraph.TAG:
        this._event.tag = HTMLTag.PARAGRAPH
        this._event.block = true
        return this.publish(this._event)
      case Emphasize.TAG:
        this._event.tag = HTMLTag.STRONG
        this._event.block = false
        return this.publishOrBufferize(this._event)
      case Title.TAG:
        this._wasTitleDiscovered = true
        this._event.tag = HTMLTag.EMPHASIZE
        this._event.block = false
        this._event.prependClass('paragraph-heading')
        this._event.prependClass('paragraph')
        return this.publish(this._event)
      default:
        throw new Error('Unhandled unidoc tag : ' + event.tag + '.')
    }
  }

  private handleTagEnd (event : UnidocEvent) : void {
    this._event.clear()
    this._event.type = HTMLEventType.END_TAG

    switch (event.tag) {
      case Paragraph.TAG:
        this._wasWhitespace = true
        this._event.tag = HTMLTag.PARAGRAPH
        this._event.block = true

        if (!this._wasTitleDiscovered) {
          this.flush()
          this._wasTitleDiscovered = true
        }

        this.publish(this._event)
        break
      case Emphasize.TAG:
        this._event.tag = HTMLTag.STRONG
        this._event.block = false
        this.publishOrBufferize(this._event)
        break
      case Title.TAG:
        this._event.tag = HTMLTag.EMPHASIZE
        this._event.block = false
        this.publish(this._event)
        break
      default:
        throw new Error('Unhandled unidoc tag : ' + event.tag + '.')
    }

    if (event.identifier != null || event.classes.size > 0) {
      let content : string = ' /'

      if (event.identifier != null) {
        content += '#' + event.identifier
      }

      if (event.classes.size > 0) {
        for (const clazz of event.classes) {
          content += '.' + clazz
        }
      }

      content += ' '

      this._event.clear()
      this._event.type = HTMLEventType.COMMENT
      this._event.content = content
      this.publishOrBufferize(this._event)
    }
  }

  private handleWord (event : UnidocEvent) : void {
    this._event.clear()
    this._event.type = HTMLEventType.WORD
    this._event.content = event.text
    this._event.block = false
    this.publishOrBufferize(this._event)
  }

  private handleWhitespace (event : UnidocEvent) : void {
    if (!this._wasWhitespace) {
      this._wasWhitespace = true
      this._event.clear()
      this._event.type  = HTMLEventType.WHITESPACE
      this._event.block = false
      this.publishOrBufferize(this._event)
    }
  }

  /**
  * Publish the content of this compiler internal buffer and then clear it.
  */
  private flush () : void {
    for (let index = 0, size = this._buffer.size; index < size; ++index) {
      this.publish(this._buffer.get(index))
    }

    this._buffer.clear()
  }

  /**
  * Publish or bufferize the given event.
  *
  * @param event - An event to publish or bufferize.
  */
  private publishOrBufferize (event : HTMLEvent) : void {
    if (this._wasTitleDiscovered) {
      this.publish(event)
    } else {
      if (this._buffer.capacity == this._buffer.size) {
          this._buffer.reallocate(this._buffer.capacity * 2)
      }

      this._buffer.push(event)
    }
  }

  /**
  * @see HTMLCompiler.complete
  */
  public complete () : void {
    this.publishCompletion()
  }

  /**
  * @see HTMLCompiler.reset
  */
  public reset () : void {
    this._buffer.clear()
    this._wasWhitespace = true
    this._wasTitleDiscovered = false
  }

  /**
  * @see HTMLCompiler.clear
  */
  public clear () : void {
    super.clear()
    this._buffer.clear()
    this._wasWhitespace = true
    this._wasTitleDiscovered = false
  }
}
