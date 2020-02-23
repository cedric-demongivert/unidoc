import { Subscriber } from 'rxjs'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocToken } from '../token/UnidocToken'
import { UnidocTokenType } from '../token/UnidocTokenType'

import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'
import { UnidocCommonEvent } from '../event/UnidocCommonEvent'
import { UnidocTagEvent } from '../event/UnidocTagEvent'
import { UnidocBlockEvent } from '../event/UnidocBlockEvent'

import { UnidocParserState } from './UnidocParserState'

/**
* A unidoc token stream parser.
*/
export class UnidocParser {
  /**
  * A set of subscriber to this lexer output.
  */
  private _subscribers : Set<Subscriber<UnidocEvent>>

  /**
  * Inner state of the parser.
  */
  private _state : Pack<UnidocParserState>

  /**
  * Pool of available token instances.
  */
  private _pool : Pack<UnidocToken>

  /**
  * Token buffer.
  */
  private _tokens : Pack<UnidocToken>

  /**
  * Unidoc common event instance for publication.
  */
  private _commonEvent : UnidocCommonEvent

  /**
  * Unidoc tag event instance for publication.
  */
  private _tagEvent : UnidocTagEvent

  /**
  * Unidoc block event instance for publication.
  */
  private _blockEvent : UnidocBlockEvent

  /**
  * Instantiate a new unidoc parser with a given token buffer capacity.
  *
  * @param [capacity = 32] - Initial token buffer capacity of the parser.
  */
  public constructor (capacity : number = 32) {
    this._state       = Pack.any(capacity)
    this._pool        = Pack.any(capacity)
    this._tokens      = Pack.any(capacity)
    this._subscribers = new Set<Subscriber<UnidocEvent>>()

    this._commonEvent = new UnidocCommonEvent()
    this._tagEvent    = new UnidocTagEvent()
    this._blockEvent  = new UnidocBlockEvent()

    this._state.push(UnidocParserState.START)

    while (this._pool.size < this._pool.capacity) {
      this._pool.push(new UnidocToken())
    }
  }

  /**
  * Feed this parser with the given token.
  *
  * @param token - The token to give to the parser.
  */
  public next (token : UnidocToken) : void {
    //console.log('------ ' + UnidocParserState.toString(this._state.last) + ' ' + token.toString())
    switch (this._state.last) {
      case UnidocParserState.ERROR:
        this.handleAfterError(token)
        break
      case UnidocParserState.WHITESPACE:
        this.handleAfterWhitespace(token)
        break
      case UnidocParserState.WORD:
        this.handleAfterWord(token)
        break
      case UnidocParserState.TAG_TYPE:
        this.handleAfterTagType(token)
        break
      case UnidocParserState.TAG_IDENTIFIER:
      case UnidocParserState.TAG_CLASSES:
        this.handleAfterTagClasses(token)
        break
      case UnidocParserState.BLOCK_IDENTIFIER:
      case UnidocParserState.BLOCK_CLASSES:
        this.handleAfterBlockClasses(token)
        break
      case UnidocParserState.START:
        this.handleAfterStart(token)
        break
      case UnidocParserState.DOCUMENT_CONTENT:
      case UnidocParserState.TAG_CONTENT:
      case UnidocParserState.BLOCK_CONTENT:
        this.handleAfterContent(token)
        break
      default:
        this.emitError(token)
    }
  }

  /**
  * Handle the given token after a block class.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterBlockClasses (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        break
      case UnidocTokenType.CLASS:
        this._blockEvent.classes.add(token.substring(1))
        break
      case UnidocTokenType.BLOCK_START:
        this.emitBlockStart(token)
        this._state.pop()
        this._state.push(UnidocParserState.BLOCK_CONTENT)
        break
      default:
        this._state.pop()
        this._state.push(UnidocParserState.ERROR)
        this.next(token)
        break
    }
  }

  /**
  * Handle the given token after a tag class.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterTagClasses (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        break
      case UnidocTokenType.CLASS:
        this._tagEvent.classes.add(token.substring(1))
        break
      case UnidocTokenType.BLOCK_START:
        this.emitTagStart(token)
        this._state.pop()
        this._state.push(UnidocParserState.TAG_CONTENT)
        break
      default:
        this._state.pop()
        this._state.push(UnidocParserState.ERROR)
        this.next(token)
        break
    }
  }

  /**
  * Handle the given token after a tag type.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterTagType (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        break
      case UnidocTokenType.IDENTIFIER:
        this._tagEvent.identifier = token.substring(1)
        this._state.pop()
        this._state.push(UnidocParserState.TAG_IDENTIFIER)
        break
      case UnidocTokenType.CLASS:
        this._state.pop()
        this._state.push(UnidocParserState.TAG_IDENTIFIER)
        this.next(token)
        break
      case UnidocTokenType.BLOCK_START:
        this.emitTagStart(token)
        this._state.pop()
        this._state.push(UnidocParserState.TAG_CONTENT)
        break
      default:
        this._state.pop()
        this._state.push(UnidocParserState.ERROR)
        this.next(token)
        break
    }
  }

  /**
  * Handle the given token after a whitespace.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterWhitespace (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this.bufferize(token)
        break
      default:
        this.emitWhitespaceEvent(token)
        this._state.pop()
        this.next(token)
        break
    }
  }

  /**
  * Handle the given token after a word.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterWord (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.WORD:
        this.bufferize(token)
        break
      default:
        this.emitWordEvent(token)
        this._state.pop()
        this.next(token)
        break
    }
  }

  /**
  * Handle the given token after error.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterError (token : UnidocToken) : void {
    this.emitError(token)
  }

  /**
  * Handle the given token after content.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterContent (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.TAG:
        this._tagEvent.clear()
        this._tagEvent.alias = token.substring(1)
        this._state.push(UnidocParserState.TAG_TYPE)
        break
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
        this.bufferize(token)
        this._state.push(UnidocParserState.WHITESPACE)
        break
      case UnidocTokenType.WORD:
        this.bufferize(token)
        this._state.push(UnidocParserState.WORD)
        break
      case UnidocTokenType.IDENTIFIER:
        this._blockEvent.clear()
        this._blockEvent.identifier = token.substring(1)
        this._state.push(UnidocParserState.BLOCK_IDENTIFIER)
        break
      case UnidocTokenType.CLASS:
        this._blockEvent.clear()
        this._state.push(UnidocParserState.BLOCK_CLASSES)
        this.next(token)
        break
      case UnidocTokenType.BLOCK_START:
        this._blockEvent.clear()
        this.emitBlockStart(token)
        this._state.push(UnidocParserState.BLOCK_CONTENT)
        break
      case UnidocTokenType.BLOCK_END:
        switch (this._state.last) {
          case UnidocParserState.BLOCK_CONTENT:
            this.emitBlockEnd(token)
            break
          case UnidocParserState.TAG_CONTENT:
            this.emitTagEnd(token)
            break

        }
        this._state.pop()
        break
    }
  }

  /**
  * Handle the given token after start.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterStart (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
      case UnidocTokenType.TAG:
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
      case UnidocTokenType.WORD:
        this.emitDocumentStart(token)
        this._state.pop()
        this._state.push(UnidocParserState.DOCUMENT_CONTENT)
        this.next(token)
        break
      default:
        this._state.pop()
        this._state.push(UnidocParserState.ERROR)
        this.next(token)
        break
    }
  }

  /**
  * Emit a unidoc block start event.
  *
  * @param marker - Token that marks the begining of the block.
  */
  private emitBlockStart (marker : UnidocToken) : void {
    this._blockEvent.location.copy(marker.from)
    this._blockEvent.timestamp = Date.now()
    this.emit(this._blockEvent)
  }

  /**
  * Emit a unidoc tag start event.
  *
  * @param marker - Token that marks the begining of the tag.
  */
  private emitTagStart (marker : UnidocToken) : void {
    this._tagEvent.location.copy(marker.from)
    this._tagEvent.timestamp = Date.now()
    this.emit(this._tagEvent)
  }

  /**
  * Emit a unidoc whitespace event.
  */
  private emitWhitespaceEvent (marker : UnidocToken) : void {
    this._commonEvent.clear()
    this._commonEvent.timestamp = Date.now()
    this._commonEvent.type = UnidocEventType.WHITESPACE
    this._commonEvent.location.copy(marker.from)

    for (const token of this._tokens) {
      this._commonEvent.symbols.concat(token.symbols)
    }

    this.clearTokenBuffer()

    this.emit(this._commonEvent)
  }

  /**
  * Emit a unidoc word event.
  */
  private emitWordEvent (marker : UnidocToken) : void {
    this._commonEvent.clear()
    this._commonEvent.timestamp = Date.now()
    this._commonEvent.type = UnidocEventType.WORD
    this._commonEvent.location.copy(marker.from)

    for (const token of this._tokens) {
      this._commonEvent.symbols.concat(token.symbols)
    }

    this.clearTokenBuffer()

    this.emit(this._commonEvent)
  }

  /**
  * Emit a unidoc document start event.
  *
  * @param marker - Token that marks the begining of the document.
  */
  private emitDocumentStart (marker : UnidocToken) : void {
    this._commonEvent.clear()
    this._commonEvent.type = UnidocEventType.START_DOCUMENT
    this._commonEvent.location.copy(marker.from)
    this.emit(this._commonEvent)
  }

  /**
  * Emit a unidoc document termination event.
  *
  * @param marker - Token that marks the termination of the document.
  */
  private emitDocumentEnd (marker : UnidocToken) : void {
    this._commonEvent.clear()
    this._commonEvent.type = UnidocEventType.END_DOCUMENT
    this._commonEvent.location.copy(marker.from)
    this.emit(this._commonEvent)
  }

  /**
  * Emit a unidoc tag termination event.
  *
  * @param marker - Token that marks the termination of the tag.
  */
  private emitTagEnd (marker : UnidocToken) : void {
    this._commonEvent.clear()
    this._commonEvent.type = UnidocEventType.END_TAG
    this._commonEvent.location.copy(marker.from)
    this.emit(this._commonEvent)
  }

  /**
  * Emit a unidoc block termination event.
  *
  * @param marker - Token that marks the termination of the block.
  */
  private emitBlockEnd (marker : UnidocToken) : void {
    this._commonEvent.clear()
    this._commonEvent.type = UnidocEventType.END_BLOCK
    this._commonEvent.location.copy(marker.from)
    this.emit(this._commonEvent)
  }

  /**
  * Notify this parser's listeners that the given event was triggered.
  *
  * @param event - An event to publish.
  */
  private emit (event : UnidocEvent) : void {
    for (const subscriber of this._subscribers) {
      subscriber.next(event)
    }
  }

  /**
  * Empty this parser's token buffer.
  */
  private clearTokenBuffer () : void {
    for (const token of this._tokens) {
      this._pool.push(token)
    }

    this._tokens.clear()
  }

  /**
  * Bufferize the given token.
  *
  * @param token - A token to bufferize.
  */
  private bufferize (token : UnidocToken) : void {
    if (this._pool.size <= 0) {
      this._pool.reallocate(this._pool.capacity * 2)
      this._tokens.reallocate(this._tokens.capacity * 2)

      const length : number = this._tokens.size

      for (let index = 0; index < length; ++index) {
        this._pool.push(new UnidocToken())
      }
    }

    const next : UnidocToken = this._pool.pop()
    next.copy(token)
    this._tokens.push(next)
  }

  /**
  * Emit an error.
  */
  private emitError (token : UnidocToken) : void {
    console.log('error: ' + token.toString())
  }

  /**
  * Add the given listener.
  *
  * @param listener - A subscriber to add to the list of listeners.
  */
  public addEventListener (listener : Subscriber<UnidocEvent>) : void {
    this._subscribers.add(listener)
  }

  /**
  * Delete a registered listener.
  *
  * @param listener - A subscriber to delete from the list of listeners.
  */
  public deleteEventListener (listener : Subscriber<UnidocEvent>) : void {
    this._subscribers.delete(listener)
  }
}
