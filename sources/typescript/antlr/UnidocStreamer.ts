import { Subscriber } from 'rxjs'

import { ParserRuleContext } from 'antlr4ts/ParserRuleContext'

import { UnidocListener } from '@grammar/UnidocListener'
import { UnidocContext } from "@grammar/UnidocParser"
import { ContentContext } from "@grammar/UnidocParser"
import { BlockContext } from "@grammar/UnidocParser"
import { WordContext } from "@grammar/UnidocParser"
import { WhitespaceContext } from "@grammar/UnidocParser"
import { LinebreakContext } from "@grammar/UnidocParser"
import { SpaceContext } from "@grammar/UnidocParser"
import { TagContext } from "@grammar/UnidocParser"

import { UnidocEvent } from '@library/event/UnidocEvent'
import { UnidocBlockEvent } from '@library/event/UnidocBlockEvent'
import { UnidocDocumentEvent } from '@library/event/UnidocDocumentEvent'
import { UnidocTagEvent } from '@library/event/UnidocTagEvent'
import { UnidocWhitespaceEvent } from '@library/event/UnidocWhitespaceEvent'
import { UnidocWordEvent } from '@library/event/UnidocWordEvent'

import { Tag } from '@library/tag/Tag'
import { Alias } from '@library/alias'
import { Location } from '@library/Location'

const STATE_BLOCK      : number = 0
const STATE_TAG        : number = 1
const STATE_WHITESPACE : number = 2
const STATE_WORD       : number = 3
const STATE_ROOT       : number = 4

export class UnidocStreamer implements UnidocListener {
  private _subscriber      : Subscriber<UnidocEvent>

  private _blockEvent      : UnidocBlockEvent
  private _documentEvent   : UnidocDocumentEvent
  private _tagEvent        : UnidocTagEvent
  private _whitespaceEvent : UnidocWhitespaceEvent
  private _wordEvent       : UnidocWordEvent

  private _location : Location
  private _state : number[]
  private _tags : Alias.Mapping<Tag>

  public constructor (subscriber : Subscriber<UnidocEvent>) {
    this._subscriber      = subscriber

    this._blockEvent      = new UnidocBlockEvent()
    this._documentEvent   = new UnidocDocumentEvent()
    this._tagEvent        = new UnidocTagEvent()
    this._whitespaceEvent = new UnidocWhitespaceEvent()
    this._wordEvent       = new UnidocWordEvent()

    this._location = new Location()
    this._state = []
    this._tags = new Alias.Mapping<Tag>()
  }

  public get tags () : Alias.Mapping<Tag> {
    return this._tags
  }

  /**
  * Called when the listener enter into the document to parse.
  *
  * The unidoc rule is the root rule of the parser.
  *
  * @param context - Parsing information.
  */
	public enterUnidoc (context: UnidocContext) : void {
    this.updateLocationOnEntering(context)
    this.extractDocumentEvent(context)

    this._documentEvent.start()
    this._subscriber.next(this._documentEvent)

    this._state.push(STATE_ROOT)
  }

  /**
  * Called when the listener exit the document to parse.
  *
  * The unidoc rule is the root rule of the parser.
  *
  * @param context - Parsing information.
  */
	public exitUnidoc (context: UnidocContext) : void {
    this.updateLocationOnExiting(context)
    this.extractDocumentEvent(context)

    this._documentEvent.end()
    this._subscriber.next(this._documentEvent)
    this._subscriber.complete()

    this._state.pop()
  }

  /**
  * Extract a document event from the given context.
  *
  * @param context - A context from wich extracting a document event.
  */
  private extractDocumentEvent (context : UnidocContext) : void {
    this._documentEvent.reset()
    this._documentEvent.location = this._location
  }

  /**
  * Called when the parser enter a tag, a block, a whitespace or a word.
  *
  * @param context - Parsing information.
  */
	public enterContent (context : ContentContext) : void {
    this.updateLocationOnEntering(context)
  }

  /**
  * Called when the parser exit a tag, a block, a whitespace or a word.
  *
  * @param context - Parsing information.
  */
	public exitContent (context : ContentContext) : void {
    this.updateLocationOnExiting(context)
  }

  /**
  * Called when the parser enter a block.
  *
  * The block can belong to a tag, or be anonymous.
  *
  * @param context - Parsing information.
  */
	public enterBlock (context : BlockContext) : void {
    this.updateLocationOnEntering(context)

    if (this._state[this._state.length - 1] !== STATE_TAG) {
      this.extractBlockEvent(context)
      this._blockEvent.start()
      this._subscriber.next(this._blockEvent)
    }

    this._state.push(STATE_BLOCK)
  }

  /**
  * Called when the parser exit a block.
  *
  * The block can belong to a tag, or be anonymous.
  *
  * @param context - Parsing information.
  */
	public exitBlock (context : BlockContext) : void {
    this.updateLocationOnExiting(context)

    if (this._state[this._state.length - 2] !== STATE_TAG) {
      this.extractBlockEvent(context)
      this._blockEvent.end()
      this._subscriber.next(this._blockEvent)
    }

    this._state.pop()
  }

  /**
  * Extract a block event from the given context.
  *
  * @param context - A context from wich extracting the block event.
  */
  private extractBlockEvent (context : BlockContext) : void {
    this._blockEvent.reset()

    if (context._identifier) {
      this._blockEvent.identifier = context._identifier.text
    }

    if (context._classes) {
      for (const clazz of context._classes) {
        this._blockEvent.classes.add(clazz.text)
      }
    }

    this._blockEvent.location = this._location
  }

  /**
  * Called when the parser enter a non-whitespace content.
  *
  * @param context - Parsing information.
  */
	public enterWord (context : WordContext) : void {
    this.updateLocationOnEntering(context)
    this.extractWordEvent(context)

    this._wordEvent.start()
    this._subscriber.next(this._wordEvent)

    this._state.push(STATE_WORD)
  }

  /**
  * Called when the parser exit a non-whitespace content.
  *
  * @param context - Parsing information.
  */
	public exitWord (context : WordContext) : void {
    this.updateLocationOnExiting(context)
    this.extractWordEvent(context)

    this._wordEvent.end()
    this._subscriber.next(this._wordEvent)

    this._state.pop()
  }

  /**
  * Extract a word event from the given context.
  *
  * @param context - A context from wich extracting the word event.
  */
  private extractWordEvent (context : WordContext) : void {
    this._wordEvent.reset()
    this._wordEvent.location = this._location
    this._wordEvent.value = context.text
  }

  /**
  * Called when the parser enter a combination of whitespace and line-breaks.
  *
  * @param context - Parsing information.
  */
	public enterWhitespace (context : WhitespaceContext) : void {
    this.updateLocationOnEntering(context)
    this.extractWhitespaceEvent(context)

    this._whitespaceEvent.start()
    this._subscriber.next(this._whitespaceEvent)

    this._state.push(STATE_WHITESPACE)
  }

  /**
  * Called when the parser exit a combination of whitespace and line-breaks.
  *
  * @param context - Parsing information.
  */
	public exitWhitespace (context : WhitespaceContext) : void {
    this.updateLocationOnExiting(context)
    this.extractWhitespaceEvent(context)

    this._whitespaceEvent.end()
    this._subscriber.next(this._whitespaceEvent)

    this._state.pop()
  }

  /**
  * Extract a whitespace event from the given context.
  *
  * @param context - A context from which extracting a whitespace event.
  */
  private extractWhitespaceEvent (context : WhitespaceContext) : void {
    this._whitespaceEvent.reset()
    this._whitespaceEvent.location = this._location
    this._whitespaceEvent.value = context.text
  }

  /**
  * Called when the parser enter a line-break symbol.
  *
  * @param context - Parsing information.
  */
  public enterLinebreak (context : LinebreakContext) : void {
    this.updateLocationOnEntering(context)
  }

  /**
  * Called when the parser exit a line-break symbol.
  *
  * @param context - Parsing information.
  */
  public exitLinebreak (context : LinebreakContext) : void {
    this._location.line += 1
    this._location.column = 0
    this._location.index = context.sourceInterval.b
  }

  /**
  * Called when the parser enter a space symbol.
  *
  * @param context - Parsing information.
  */
  public enterSpace (context : SpaceContext) : void {
    this.updateLocationOnEntering(context)
  }

  /**
  * Called when the parser exit a space symbol.
  *
  * @param context - Parsing information.
  */
  public exitSpace (context : SpaceContext) : void {
    this.updateLocationOnExiting(context)
  }

  /**
  * Called when the parser enter a tag.
  *
  * @param context - Parsing information.
  */
	public enterTag (context : TagContext) : void {
    this.updateLocationOnEntering(context)
    this.extractTagEvent(context)

    this._tagEvent.start()
    this._subscriber.next(this._tagEvent)

    this._state.push(STATE_TAG)
  }

  /**
  * Called when the parser exit a tag.
  *
  * @param context - Parsing information.
  */
	public exitTag (context : TagContext) : void {
    this.updateLocationOnExiting(context)
    this.extractTagEvent(context)

    this._tagEvent.end()
    this._subscriber.next(this._tagEvent)

    this._state.pop()
  }

  /**
  * Extract a tag event from the given context.
  *
  * @param context - A context from wich extracting a tag event.
  */
  private extractTagEvent (context : TagContext) : void {
    this._tagEvent.reset()
    this._tagEvent.alias = context._type.text
    this._tagEvent.tag = this._tags.get(this._tagEvent.alias)

    const blockContext : BlockContext = context.block()

    if (blockContext._identifier) {
      this._tagEvent.identifier = blockContext._identifier.text
    }

    if (blockContext._classes) {
      for (const clazz of blockContext._classes) {
        this._tagEvent.classes.add(clazz.text)
      }
    }

    this._tagEvent.location = this._location
  }

  /**
  * Called in order to track the parsing location for the current context when
  * the parser enter a rule.
  *
  * @param context - UnidocEvent of the current rule.
  */
  private updateLocationOnEntering (context : ParserRuleContext) : void {
    this._location.column += context.sourceInterval.a - this._location.index
    this._location.index = context.sourceInterval.a
  }

  /**
  * Called in order to track the parsing location for the current context when
  * the parser exit a rule.
  *
  * @param context - UnidocEvent of the current rule.
  */
  private updateLocationOnExiting (context : ParserRuleContext) : void {
    this._location.column += context.sourceInterval.b - this._location.index
    this._location.index = context.sourceInterval.b
  }
}
