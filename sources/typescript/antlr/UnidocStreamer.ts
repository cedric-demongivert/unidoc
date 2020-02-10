import { Subscriber } from 'rxjs'

import { ParserRuleContext } from 'antlr4ts/ParserRuleContext'

import { UnidocListener as ANTLRUnidocListener } from '@grammar/UnidocListener'
import { UnidocContext as ANTLRUnidocContext } from "@grammar/UnidocParser"
import { ContentContext as ANTLRContentContext } from "@grammar/UnidocParser"
import { BlockContext as ANTLRBlockContext } from "@grammar/UnidocParser"
import { WordContext as ANTLRWordContext } from "@grammar/UnidocParser"
import { WhitespaceContext as ANTLRWhitespaceContext } from "@grammar/UnidocParser"
import { LinebreakContext as ANTLRLinebreakContext } from "@grammar/UnidocParser"
import { SpaceContext as ANTLRSpaceContext } from "@grammar/UnidocParser"
import { TagContext as ANTLRTagContext } from "@grammar/UnidocParser"

import { Context } from '@library/context/Context'
import { DocumentContext } from '@library/context/DocumentContext'
import { UnknownTagContext } from '@library/context/UnknownTagContext'
import { KnownTagContext } from '@library/context/KnownTagContext'
import { BlockContext } from '@library/context/BlockContext'
import { WordContext } from '@library/context/WordContext'
import { WhitespaceContext } from '@library/context/WhitespaceContext'

import { Tag } from '@library/tag/Tag'
import { Alias } from '@library/alias'
import { Location } from '@library/Location'

const STATE_BLOCK : number = 0
const STATE_TAG : number = 1
const STATE_WHITESPACE : number = 2
const STATE_WORD : number = 3
const STATE_ROOT : number = 4

export class UnidocStreamer implements ANTLRUnidocListener {
  private _subscriber : Subscriber<Context>

  private _unknownTagContext : UnknownTagContext
  private _knownTagContext : KnownTagContext
  private _documentContext : DocumentContext
  private _wordContext : WordContext
  private _whitespaceContext : WhitespaceContext
  private _blockContext : BlockContext

  private _location : Location
  private _state : number[]
  private _tags : Alias.Mapping<Tag>

  public constructor (subscriber : Subscriber<Context>) {
    this._subscriber = subscriber

    this._documentContext = new DocumentContext()
    this._unknownTagContext = new UnknownTagContext()
    this._knownTagContext = new KnownTagContext()
    this._blockContext = new BlockContext()
    this._wordContext = new WordContext()
    this._whitespaceContext = new WhitespaceContext()

    this._location = new Location()
    this._state = []
    this._tags = new Alias.Mapping<Tag>()
  }

  public get tags () : Alias.Mapping<Tag> {
    return this._tags
  }

	public enterUnidoc (context: ANTLRUnidocContext) : void {
    this.updateLocationOnEntering(context)

    this._documentContext.clear()
    this._documentContext.entering = true
    this._documentContext.location = this._location
    this._subscriber.next(this._documentContext)

    this._state.push(STATE_ROOT)
  }

	public exitUnidoc (context: ANTLRUnidocContext) : void {
    this.updateLocationOnExiting(context)

    this._documentContext.clear()
    this._documentContext.exiting = true
    this._documentContext.location = this._location
    this._subscriber.next(this._documentContext)
    this._subscriber.complete()

    this._state.pop()
  }

	public enterContent (context : ANTLRContentContext) : void {
    this.updateLocationOnEntering(context)
  }

	public exitContent (context : ANTLRContentContext) : void {
    this.updateLocationOnExiting(context)
  }

	public enterBlock (context : ANTLRBlockContext) : void {
    this.updateLocationOnEntering(context)

    if (this._state[this._state.length - 1] !== STATE_TAG) {
      this.extractBlockContext(context)
      this._blockContext.entering = true
      this._subscriber.next(this._blockContext)
    }

    this._state.push(STATE_BLOCK)
  }

	public exitBlock (context : ANTLRBlockContext) : void {
    this.updateLocationOnExiting(context)

    if (this._state[this._state.length - 2] !== STATE_TAG) {
      this.extractBlockContext(context)
      this._blockContext.exiting = true
      this._subscriber.next(this._blockContext)
    }

    this._state.pop()
  }

  private extractBlockContext (context : ANTLRBlockContext) : void {
    this._blockContext.clear()

    if (context._identifier) {
      this._blockContext.identifier = context._identifier.text
    }

    if (context._classes) {
      for (const clazz of context._classes) {
        this._blockContext.classes.add(clazz.text)
      }
    }

    this._blockContext.location = this._location
  }

	public enterWord (context : ANTLRWordContext) : void {
    this.updateLocationOnEntering(context)

    this.extractWordContext(context)
    this._wordContext.entering = true
    this._subscriber.next(this._wordContext)

    this._state.push(STATE_WORD)
  }

	public exitWord (context : ANTLRWordContext) : void {
    this.updateLocationOnExiting(context)

    this.extractWordContext(context)
    this._wordContext.entering = false
    this._subscriber.next(this._wordContext)

    this._state.pop()
  }

  private extractWordContext (context : ANTLRWordContext) : void {
    this._wordContext.clear()
    this._wordContext.location = this._location
    this._wordContext.value = context.text
  }

	public enterWhitespace (context : ANTLRWhitespaceContext) : void {
    this.updateLocationOnEntering(context)

    this.extractWhitespaceContext(context)
    this._whitespaceContext.entering = true
    this._subscriber.next(this._whitespaceContext)

    this._state.push(STATE_WHITESPACE)
  }

	public exitWhitespace (context : ANTLRWhitespaceContext) : void {
    this.updateLocationOnExiting(context)

    this.extractWhitespaceContext(context)
    this._whitespaceContext.entering = false
    this._subscriber.next(this._whitespaceContext)

    this._state.pop()
  }

  private extractWhitespaceContext (context : ANTLRWhitespaceContext) : void {
    this._whitespaceContext.clear()
    this._whitespaceContext.location = this._location
    this._whitespaceContext.value = context.text
  }

  public enterLinebreak (context : ANTLRLinebreakContext) : void {
    this.updateLocationOnEntering(context)
  }

  public exitLinebreak (context : ANTLRLinebreakContext) : void {
    this._location.line += 1
    this._location.column = 0
    this._location.index = context.sourceInterval.b
  }

  public enterSpace (context : ANTLRSpaceContext) : void {
    this.updateLocationOnEntering(context)

  }

  public exitSpace (context : ANTLRSpaceContext) : void {
    this.updateLocationOnExiting(context)

  }

	public enterTag (context : ANTLRTagContext) : void {
    this.updateLocationOnEntering(context)

    const name : string = context._type.text
    const type : Tag = this._tags.get(name)

    if (type == null) {
      this.extractUnknownTagContext(context)
      this._unknownTagContext.entering = true
      this._subscriber.next(this._unknownTagContext)
    } else {
      this.extractKnownTagContext(context)
      this._knownTagContext.entering = true
      this._knownTagContext.type = type
      this._subscriber.next(this._knownTagContext)
    }

    this._state.push(STATE_TAG)
  }

	public exitTag (context : ANTLRTagContext) : void {
    this.updateLocationOnExiting(context)

    const name : string = context._type.text
    const type : Tag = this._tags.get(name)

    if (type == null) {
      this.extractUnknownTagContext(context)
      this._unknownTagContext.exiting = true
      this._subscriber.next(this._unknownTagContext)
    } else {
      this.extractKnownTagContext(context)
      this._knownTagContext.exiting = true
      this._knownTagContext.type = type
      this._subscriber.next(this._knownTagContext)
    }

    this._state.pop()
  }

  private extractKnownTagContext (context : ANTLRTagContext) : void {
    this._knownTagContext.clear()
    this._knownTagContext.name = context._type.text

    const blockContext : ANTLRBlockContext = context.block()

    if (blockContext._identifier) {
      this._knownTagContext.identifier = blockContext._identifier.text
    }

    if (blockContext._classes) {
      for (const clazz of blockContext._classes) {
        this._knownTagContext.classes.add(clazz.text)
      }
    }

    this._knownTagContext.location = this._location
  }

  private extractUnknownTagContext (context : ANTLRTagContext) : void {
    this._unknownTagContext.clear()
    this._unknownTagContext.name = context._type.text

    const blockContext : ANTLRBlockContext = context.block()

    if (blockContext._identifier) {
      this._unknownTagContext.identifier = blockContext._identifier.text
    }

    if (blockContext._classes) {
      for (const clazz of blockContext._classes) {
        this._unknownTagContext.classes.add(clazz.text)
      }
    }

    this._unknownTagContext.location = this._location
  }

  /**
  * Called in order to track the parsing location for the current context when
  * the parser enter a rule.
  *
  * @param context - Context of the current rule.
  */
  private updateLocationOnEntering (context : ParserRuleContext) : void {
    this._location.column += context.sourceInterval.a - this._location.index
    this._location.index = context.sourceInterval.a
  }

  /**
  * Called in order to track the parsing location for the current context when
  * the parser exit a rule.
  *
  * @param context - Context of the current rule.
  */
  private updateLocationOnExiting (context : ParserRuleContext) : void {
    this._location.column += context.sourceInterval.b - this._location.index
    this._location.index = context.sourceInterval.b
  }
}
