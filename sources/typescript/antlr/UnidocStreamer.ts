import { Subscriber } from 'rxjs'

import { ParserRuleContext } from 'antlr4ts/ParserRuleContext'

import { UnidocListener } from '@grammar/UnidocListener'
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
import { TagContext } from '@library/context/TagContext'
import { BlockContext } from '@library/context/BlockContext'
import { Location } from '@library/Location'

const STATE_BLOCK : number = 0
const STATE_TAG : number = 1
const STATE_WHITESPACE : number = 2
const STATE_WORD : number = 3
const STATE_ROOT : number = 4

export class UnidocStreamer implements UnidocListener {
  private _subscriber : Subscriber<Context>
  private _tagContext : TagContext
  private _documentContext : DocumentContext
  private _blockContext : BlockContext
  private _location : Location
  private _skipNextBlock : boolean
  private _state : number[]

  public constructor (subscriber : Subscriber<Context>) {
    this._subscriber = subscriber
    this._documentContext = new DocumentContext()
    this._tagContext = new TagContext()
    this._blockContext = new BlockContext()
    this._location = new Location()
    this._skipNextBlock = false
    this._state = []
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

  }

	public exitWord (context : ANTLRWordContext) : void {
    this.updateLocationOnExiting(context)

  }

	public enterWhitespace (context : ANTLRWhitespaceContext) : void {
    this.updateLocationOnEntering(context)

  }

	public exitWhitespace (context : ANTLRWhitespaceContext) : void {
    this.updateLocationOnExiting(context)

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

    this.extractTagContext(context)
    this._tagContext.entering = true
    this._subscriber.next(this._tagContext)

    this._state.push(STATE_TAG)
  }

	public exitTag (context : ANTLRTagContext) : void {
    this.updateLocationOnExiting(context)

    this.extractTagContext(context)
    this._tagContext.exiting = true
    this._subscriber.next(this._tagContext)

    this._state.pop()
  }

  private extractTagContext (context : ANTLRTagContext) : void {
    this._tagContext.clear()
    this._tagContext.name = context._type.text

    const blockContext : ANTLRBlockContext = context.block()

    if (blockContext._identifier) {
      this._tagContext.identifier = blockContext._identifier.text
    }

    if (blockContext._classes) {
      for (const clazz of blockContext._classes) {
        this._tagContext.classes.add(clazz.text)
      }
    }

    this._tagContext.location = this._location
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
