import { UnidocLocation } from '../UnidocLocation'

import { UnidocTokenBuffer } from '../token/UnidocTokenBuffer'
import { UnidocToken } from '../token/UnidocToken'
import { UnidocTokenType } from '../token/UnidocTokenType'

import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocValidation } from '../validation/UnidocValidation'
import { UnidocValidationType } from '../validation/UnidocValidationType'

import { UnidocParserState } from './UnidocParserState'
import { UnidocParserStateType } from './UnidocParserStateType'

import { UnidocParserEventType } from './UnidocParserEventType'

import { UnidocParserStateBuffer } from './UnidocParserStateBuffer'

/**
* A unidoc token stream parser.
*/
export class UnidocParser {
  /**
  * Inner state of the parser.
  */
  private _states : UnidocParserStateBuffer

  /**
  * Unidoc token buffer.
  */
  private _tokens : UnidocTokenBuffer

  /**
  * Unidoc event instance for publication.
  */
  private _event : UnidocEvent

  /**
  * Unidoc validation instance for publication.
  */
  private _validation : UnidocValidation

  /**
  * A set of listeners of the 'event' event.
  */
  private _eventListeneners : Set<UnidocParser.EventListener>

  /**
  * A set of listeners of the 'validation' event.
  */
  private _validationListeners : Set<UnidocParser.ValidationListener>

  /**
  * A set of listeners of the 'completion' event.
  */
  private _completionListeners : Set<UnidocParser.CompletionListener>

  /**
  * A set of listeners of the 'error' event.
  */
  private _errorListeners : Set<UnidocParser.ErrorListener>

  /**
  * Current location of this parser in its parent document.
  */
  public readonly location : UnidocLocation

  /**
  * Instantiate a new unidoc parser with a given token buffer capacity.
  *
  * @param [capacity = 32] - Initial token buffer capacity of the parser.
  */
  public constructor (capacity : number = 32) {
    this.location             = new UnidocLocation()

    this._states              = new UnidocParserStateBuffer(capacity)
    this._tokens              = new UnidocTokenBuffer(capacity)
    this._event               = new UnidocEvent()

    this._eventListeneners    = new Set<UnidocParser.EventListener>()
    this._validationListeners = new Set<UnidocParser.ValidationListener>()
    this._completionListeners = new Set<UnidocParser.CompletionListener>()
    this._errorListeners      = new Set<UnidocParser.ErrorListener>()

    this._states.push(UnidocParserStateType.START)
  }

  /**
  * Feed this parser with the given token.
  *
  * @param token - The token to give to the parser.
  */
  public next (token : UnidocToken) : void {
    switch (this._states.last.type) {
      case UnidocParserStateType.ERROR:
        this.handleAfterError(token)
        break
      case UnidocParserStateType.WHITESPACE:
        this.handleAfterWhitespace(token)
        break
      case UnidocParserStateType.WORD:
        this.handleAfterWord(token)
        break
      case UnidocParserStateType.TAG_TYPE:
        this.handleAfterTagType(token)
        break
      case UnidocParserStateType.TAG_IDENTIFIER:
      case UnidocParserStateType.TAG_CLASSES:
        this.handleAfterTagClasses(token)
        break
      case UnidocParserStateType.BLOCK_IDENTIFIER:
      case UnidocParserStateType.BLOCK_CLASSES:
        this.handleAfterBlockClasses(token)
        break
      case UnidocParserStateType.START:
        this.handleAfterStart(token)
        break
      case UnidocParserStateType.DOCUMENT_CONTENT:
      case UnidocParserStateType.TAG_CONTENT:
      case UnidocParserStateType.BLOCK_CONTENT:
        this.handleAfterContent(token)
        break
      default:
        this.emitError(token)
    }
  }

  /**
  * Call when the stream of tokens reach it's end.
  */
  public complete () : void {
    switch (this._state.last) {
      case UnidocParserStateType.DOCUMENT_CONTENT:
      case UnidocParserStateType.START:
        this._state.set(0, UnidocParserStateType.END)
        this.emitDocumentEnd()
      default:
        throw new Error('')
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
        this._states.last.classes.add(token.substring(1))
        break
      case UnidocTokenType.BLOCK_START:
        this.emitBlockStart(this._states.last)
        this._states.push(UnidocParserStateType.BLOCK_CONTENT)
        break
      default:
        this._states.pop()
        this._states.push(UnidocParserStateType.ERROR)
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
        this._state.push(UnidocParserStateType.TAG_CONTENT)
        break
      default:
        this._state.pop()
        this._state.push(UnidocParserStateType.ERROR)
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
        this._state.push(UnidocParserStateType.TAG_IDENTIFIER)
        break
      case UnidocTokenType.CLASS:
        this._state.pop()
        this._state.push(UnidocParserStateType.TAG_IDENTIFIER)
        this.next(token)
        break
      case UnidocTokenType.BLOCK_START:
        this.emitTagStart(token)
        this._state.pop()
        this._state.push(UnidocParserStateType.TAG_CONTENT)
        break
      default:
        this._state.pop()
        this._state.push(UnidocParserStateType.ERROR)
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
        this._tokens.push(token)
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
        this._tokens.push(token)
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
        this._tagEvent.tag = token.substring(1)
        this._state.push(UnidocParserStateType.TAG_TYPE)
        break
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
        this._tokens.push(token)
        this._state.push(UnidocParserStateType.WHITESPACE)
        break
      case UnidocTokenType.WORD:
        this._tokens.push(token)
        this._state.push(UnidocParserStateType.WORD)
        break
      case UnidocTokenType.IDENTIFIER:
        this._blockEvent.clear()
        this._blockEvent.identifier = token.substring(1)
        this._state.push(UnidocParserStateType.BLOCK_IDENTIFIER)
        break
      case UnidocTokenType.CLASS:
        this._blockEvent.clear()
        this._state.push(UnidocParserStateType.BLOCK_CLASSES)
        this.next(token)
        break
      case UnidocTokenType.BLOCK_START:
        this._blockEvent.clear()
        this.emitBlockStart(token)
        this._state.push(UnidocParserStateType.BLOCK_CONTENT)
        break
      case UnidocTokenType.BLOCK_END:
        switch (this._state.last) {
          case UnidocParserStateType.BLOCK_CONTENT:
            this.emitBlockEnd(token)
            break
          case UnidocParserStateType.TAG_CONTENT:
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
        this._states.last.from.copy(token.from)
        this.emitDocumentStart(this._states.last)

        this._states.push(UnidocParserStateType.DOCUMENT_CONTENT)
        this._states.last.from.copy(token.from)

        this.next(token)
        break
      case UnidocTokenType.BLOCK_END:
        this.emitDocumentStartWithBlockEndingError()
        this.recoverFromDocumentStartWithBlockEndingError(token)
        break
    }
  }

  private recoverFromDocumentStartWithBlockEndingError (token : UnidocToken) : void {
    this._states.last.from.copy(token.to)
  }

  /**
  * Emit an error 
  *
  */
  private emitDocumentStartWithBlockEndingError () {
    this._validation.clear()
    this._validation.asError('An unidoc document cannot start with a block ending character.')
    this.emitValidation(this._validation)
  }

  /**
  * Emit a unidoc block start event.
  *
  * @param marker - Token that marks the begining of the block.
  */
  private emitBlockStart (state : UnidocParserState) : void {
    this._event.clear()
    this._event.type = UnidocEventType.START_BLOCK
    this._event.from.copy(state.from)
    this._event.to.copy(this.location)
    this._event.addClasses(state.classes)
    this._event.identifier = state.identifier

    this.emit(this._event)
  }

  /**
  * Emit a unidoc tag start event.
  *
  * @param marker - Token that marks the begining of the tag.
  */
  private emitTagStart (state : UnidocParserState) : void {
    this._event.clear()
    this._event.type = UnidocEventType.START_TAG
    this._event.from.copy(state.from)
    this._event.to.copy(this.location)
    this._event.addClasses(state.classes)
    this._event.identifier = state.identifier
    this._event.tag = state.tag

    this.emit(this._event)
  }

  /**
  * Emit a unidoc whitespace event.
  */
  private emitWhitespaceEvent (state : UnidocParserState) : void {
    this._commonEvent.clear()
    this._commonEvent.timestamp = Date.now()
    this._commonEvent.type = UnidocEventType.WHITESPACE
    this._commonEvent.location.copy(marker.from)

    for (const token of this._tokens.tokens) {
      this._commonEvent.symbols.concat(token.symbols)
    }

    this._tokens.clear()

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

    for (const token of this._tokens.tokens) {
      this._commonEvent.symbols.concat(token.symbols)
    }

    this._tokens.clear()

    this.emit(this._commonEvent)
  }

  /**
  * Emit a unidoc document starting event.
  *
  * @param state - State to use in order to build the event.
  */
  private emitDocumentStart (state : UnidocParserState) : void {
    this._event.clear()
    this._event.type = UnidocEventType.START_DOCUMENT
    this._event.from.copy(state.from)
    this._event.to.copy(state.from)
    this.emit(this._event)
  }

  /**
  * Emit a unidoc document termination event.
  *
  * @param state - State to use in order to build the event.
  */
  private emitDocumentEnd (state : UnidocParserState) : void {
    this._event.clear()
    this._event.type = UnidocEventType.END_DOCUMENT
    this._event.from.copy(this.location)
    this._event.to.copy(this.location)
    this.emit(this._event)
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
    for (const callback of this._eventListeneners) {
      callback(event)
    }
  }

  /**
  * Emit a validation.
  */
  private emitValidation (validation : UnidocValidation) : void {
    for (const callback of this._validationListeners) {
      callback(validation)
    }
  }

  /**
  * Add the given listener to this lexer set of listeners.
  *
  * @param type - Type of event to listen to.
  * @param listener - A listener to call then the given type of event happens.
  */
  public addEventListener (type : 'event', listener : UnidocParser.EventListener) : void
  public addEventListener (type : 'validation', listener : UnidocParser.ValidationListener) : void
  public addEventListener (type : 'completion', listener : UnidocParser.CompletionListener) : void
  public addEventListener (type : 'error', listener : UnidocParser.ErrorListener) : void
  public addEventListener (type : UnidocParserEventType, listener : any) : void {
    if (type === UnidocParserEventType.EVENT) {
      this._eventListeneners.add(listener)
    } else if (type === UnidocParserEventType.VALIDATION) {
      this._validationListeners.add(listener)
    } else if (type === UnidocParserEventType.COMPLETION) {
      this._completionListeners.add(listener)
    } else if (type === UnidocParserEventType.ERROR) {
      this._errorListeners.add(listener)
    } else {
      throw new Error(
        'Unable to add the given listener for the "' + type +
        '" type of event because "' + type + '" is not a valid unidoc parser ' +
        'event type, valid event types are : ' +
        UnidocParserEventType.ALL.join(', ') + '.'
      )
    }
  }

  /**
  * Remove a registered event listener.
  *
  * @param type - Type of event to stop to listen to.
  * @param listener - A listener to remove.
  */
  public removeEventListener (type : 'event', listener : UnidocParser.EventListener) : void
  public removeEventListener (type : 'validation', listener : UnidocParser.ValidationListener) : void
  public removeEventListener (type : 'completion', listener : UnidocParser.CompletionListener) : void
  public removeEventListener (type : 'error', listener : UnidocParser.ErrorListener) : void
  public removeEventListener (type : UnidocParserEventType, listener : any) : void {
    if (type === UnidocParserEventType.EVENT) {
      this._eventListeneners.delete(listener)
    } else if (type === UnidocParserEventType.VALIDATION) {
      this._validationListeners.delete(listener)
    } else if (type === UnidocParserEventType.COMPLETION) {
      this._completionListeners.delete(listener)
    } else if (type === UnidocParserEventType.ERROR) {
      this._errorListeners.delete(listener)
    } else {
      throw new Error(
        'Unable to remove the given listener for the "' + type +
        '" type of event because "' + type + '" is not a valid unidoc parser ' +
        'event type, valid event types are : ' +
        UnidocParserEventType.ALL.join(', ') + '.'
      )
    }
  }

  /**
  * Reset this parser in order to reuse-it.
  */
  public clear () : void {
    this.location.clear()
    this._tokens.clear()
    this._states.clear()
    this._eventListeneners.clear()
    this._validationListeners.clear()
    this._completionListeners.clear()
    this._errorListeners.clear()

    this._states.push(UnidocParserStateType.START)
  }
}

export namespace UnidocParser {
  export type EventListener      = (token : UnidocEvent) => void
  export type ValidationListener = (validation : UnidocValidation) => void
  export type CompletionListener = () => void
  export type ErrorListener      = (error : Error) => void
}
