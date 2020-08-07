import { UnidocToken } from '../token/UnidocToken'
import { UnidocTokenType } from '../token/UnidocTokenType'

import { UnidocPath } from '../path/UnidocPath'
import { UnidocPathElementType } from '../path/UnidocPathElementType'

import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocValidation } from '../validation/UnidocValidation'

import { UnidocLocation } from '../UnidocLocation'

import { UnidocParserStateType } from './UnidocParserStateType'
import { UnidocParserEventType } from './UnidocParserEventType'
import { UnidocParserState } from './UnidocParserState'
import { UnidocParserStateBuffer } from './UnidocParserStateBuffer'

const DOCUMENT_TAG : string = 'document'
const BLOCK_TAG : string = 'block'
const ZERO_PATH : UnidocPath = (
  UnidocPath.create(1).pushStream(UnidocLocation.ZERO)
)

/***
* CORRIGER SINGLETON POUR SINGLETON + ELEMENT EN (SINGLETON) ONLY.
*/

/**
* A unidoc token stream parser.
*/
export class UnidocParser {
  /**
  * Inner state of the parser.
  */
  private _states : UnidocParserStateBuffer

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
  public readonly location : UnidocPath

  /**
  * Current path of this parser in its parent document.
  */
  public readonly path : UnidocPath

  /**
  * Instantiate a new unidoc parser with a given token buffer capacity.
  *
  * @param [capacity = 32] - Initial state buffer capacity of the parser.
  */
  public constructor (capacity : number = 32) {
    this.location             = new UnidocPath()
    this.path                 = new UnidocPath()

    this._states              = new UnidocParserStateBuffer(capacity)
    this._event               = new UnidocEvent()

    this._eventListeneners    = new Set<UnidocParser.EventListener>()
    this._validationListeners = new Set<UnidocParser.ValidationListener>()
    this._completionListeners = new Set<UnidocParser.CompletionListener>()
    this._errorListeners      = new Set<UnidocParser.ErrorListener>()

    this._validation = new UnidocValidation()

    this._states.push(UnidocParserStateType.START)
    this._states.last.at(ZERO_PATH)
  }

  /**
  * Feed this parser with the given token.
  *
  * @param token - The token to give to the parser.
  */
  public next (token : UnidocToken) : void {
    switch (this._states.last.type) {
      case UnidocParserStateType.START:
        this.handleAfterStart(token)
        break
      case UnidocParserStateType.STREAM_CONTENT:
        this.handleAfterStreamContent(token)
        break
      case UnidocParserStateType.BLOCK_CONTENT:
        this.handleAfterBlockContent(token)
        break
      case UnidocParserStateType.WHITESPACE:
        this.handleAfterWhitespace(token)
        break
      case UnidocParserStateType.WORD:
        this.handleAfterWord(token)
        break
      case UnidocParserStateType.CLASS_OF_TAG_WITHOUT_IDENTIFIER:
        this.handleAfterClassOfTagWithoutIdentifier(token)
        break
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_TAG_WITHOUT_IDENTIFIER:
        this.handleAfterWhitespaceAfterClassOfTagWithoutIdentifier(token)
        break
      case UnidocParserStateType.CLASS_OF_TAG_WITH_IDENTIFIER:
        this.handleAfterClassOfTagWithIdentifier(token)
        break
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_TAG_WITH_IDENTIFIER:
        this.handleAfterWhitespaceAfterClassOfTagWithIdentifier(token)
        break
      case UnidocParserStateType.ERROR:
        this.handleAfterError(token)
        break
      case UnidocParserStateType.LEADING_WHITESPACE:
        this.handleAfterLeadingWhitespace(token)
        break
      case UnidocParserStateType.CLASS_OF_STREAM_WITHOUT_IDENTIFIER:
        this.handleAfterClassOfStreamWithoutIdentifier(token)
        break
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_STREAM_WITHOUT_IDENTIFIER:
        this.handleAfterWhitespaceAfterClassOfStreamWithoutIdentifier(token)
        break
      case UnidocParserStateType.CLASS_OF_STREAM_WITH_IDENTIFIER:
        this.handleAfterClassOfStreamWithIdentifier(token)
        break
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_STREAM_WITH_IDENTIFIER:
        this.handleAfterWhitespaceAfterClassOfStreamWithIdentifier(token)
        break
      default:
        this.throwUhandledParserState(token)
    }

    this.location.copy(token.to)
  }

  private throwUhandledParserState (token : UnidocToken) : void {
    throw new Error (
      'Unable to handle token of type #' + token.type + ' "' +
      UnidocTokenType.toString(token.type) + '" because this parser does not ' +
      'define an execution process when it has to handle a token when it is ' +
      'in #' + this._states.last.type + ' "' +
      UnidocParserStateType.toString(this._states.last.type) + '" state'
    )
  }

  /**
  * Call when the stream of tokens reach it's end.
  */
  public complete () : void {
    switch (this._states.last.type) {
      case UnidocParserStateType.START:
        this.emitVirtualDocumentStart()
        this.emitVirtualDocumentEnd()
        this._states.last.type = UnidocParserStateType.TERMINATION
        this.complete()
        break
      case UnidocParserStateType.STREAM_CONTENT:
        this.emitTagEnd()
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.at(this._states.last.to)
        this.complete()
        break
      case UnidocParserStateType.BLOCK_CONTENT:
        // ERROR & RECOVER
        this.emitTagEnd()
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.at(this._states.last.to)
        this.complete()
        break
      case UnidocParserStateType.WHITESPACE:
        this.emitWhitespaceEvent()
        this._states.pop()
        this.complete()
        break
      case UnidocParserStateType.WORD:
        this.emitWordEvent()
        this._states.pop()
        this.complete()
        break
      case UnidocParserStateType.CLASS_OF_TAG_WITHOUT_IDENTIFIER:
      case UnidocParserStateType.CLASS_OF_TAG_WITH_IDENTIFIER:
        this.emitTagStart()
        this._states.last.at(this._states.last.to)
        this.emitTagEnd()
        this._states.pop()
        this.complete()
        break
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_TAG_WITHOUT_IDENTIFIER:
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_TAG_WITH_IDENTIFIER:
        this.emitTagStart(this._states.get(this._states.size - 2))
        this._states.get(this._states.size - 2).at(this._states.last.from)
        this.emitTagEnd(this._states.get(this._states.size - 2))
        this.emitWhitespaceEvent()
        this._states.pop()
        this._states.pop()
        this.complete()
        break
      case UnidocParserStateType.ERROR:
        this.throwUnhandledCompletionParserState()
        break
      case UnidocParserStateType.LEADING_WHITESPACE:
        this.emitVirtualDocumentStart()
        this.emitWhitespaceEvent()
        this.emitVirtualDocumentEnd()
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.at(this._states.last.to)
        this.complete()
        break
      case UnidocParserStateType.CLASS_OF_STREAM_WITHOUT_IDENTIFIER:
      case UnidocParserStateType.CLASS_OF_STREAM_WITH_IDENTIFIER:
        this.emitTagStart()
        this.emitVirtualDocumentEnd()
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.at(this._states.last.to)
        this.complete()
        break
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_STREAM_WITHOUT_IDENTIFIER:
        this.emitTagStart(this._states.get(this._states.size - 2))
        this._states.get(this._states.size - 2).at(this._states.last.from)
        this.emitWhitespaceEvent()
        this._states.pop()
        this.emitVirtualDocumentEnd()
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.at(this._states.last.to)
        this.complete()
        break
      case UnidocParserStateType.TERMINATION:
        this.emitCompletion()
        return
      default:
        this.throwUnhandledCompletionParserState()
    }
  }

  private throwUnhandledCompletionParserState () : void {
    throw new Error (
      'Unable to handle stream completion because this parser does not ' +
      'define an execution process when it has to handle a completion when ' +
      'it is in #' + this._states.last.type + ' "' +
      UnidocParserStateType.toString(this._states.last.type) + '" state'
    )
  }

  /**
  * Handle the given token after start.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterStart (token : UnidocToken) : void {
    this._states.last.at(token.from)
    this._states.last.tag = DOCUMENT_TAG

    switch (token.type) {
      case UnidocTokenType.NEW_LINE    :
      case UnidocTokenType.SPACE       :
        this._states.last.type = UnidocParserStateType.LEADING_WHITESPACE
        this._states.last.append(token)
        return
      case UnidocTokenType.TAG         :
      case UnidocTokenType.BLOCK_START :
      case UnidocTokenType.WORD        :
      case UnidocTokenType.IDENTIFIER  :
      case UnidocTokenType.CLASS       :
        if (token.isTag(DOCUMENT_TAG)) {
          this._states.last.type = UnidocParserStateType.CLASS_OF_STREAM_WITHOUT_IDENTIFIER
          this._states.last.append(token)
        } else {
          this.emitVirtualDocumentStart()
          this._states.last.type = UnidocParserStateType.STREAM_CONTENT
          this.next(token)
        }
        return
      case UnidocTokenType.BLOCK_END   :
        this.emitDocumentStartWithBlockEndingError()
        this.recoverFromDocumentStartWithBlockEndingError(token)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private handleAfterLeadingWhitespace (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.NEW_LINE    :
      case UnidocTokenType.SPACE       :
        this._states.last.append(token)
        return
      case UnidocTokenType.TAG         :
      case UnidocTokenType.BLOCK_START :
      case UnidocTokenType.WORD        :
      case UnidocTokenType.IDENTIFIER  :
      case UnidocTokenType.CLASS       :
        if (token.isTag(DOCUMENT_TAG)) {
          this._states.last.type = UnidocParserStateType.CLASS_OF_STREAM_WITHOUT_IDENTIFIER
          this._states.last.append(token)
          this._states.last.content.clear()
        } else {
          this.emitVirtualDocumentStart()
          this.emitWhitespaceEvent()
          this._states.last.type = UnidocParserStateType.STREAM_CONTENT
          this._states.last.at(token.from)
          this.next(token)
        }
        return
      case UnidocTokenType.BLOCK_END   :
        this.emitDocumentStartWithBlockEndingError()
        this.recoverFromDocumentStartWithBlockEndingError(token)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private handleAfterClassOfStreamWithoutIdentifier (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.push(UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_STREAM_WITHOUT_IDENTIFIER)
        this._states.last.at(token.from)
        this._states.last.append(token)
        return
      case UnidocTokenType.IDENTIFIER:
        this._states.last.append(token)
        this._states.last.type = UnidocParserStateType.CLASS_OF_STREAM_WITH_IDENTIFIER
        return
      case UnidocTokenType.CLASS:
        this._states.last.append(token)
        return
      case UnidocTokenType.TAG :
      case UnidocTokenType.WORD :
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.BLOCK_END :
        this.emitTagStart()
        this._states.last.type = UnidocParserStateType.STREAM_CONTENT
        this._states.last.at(token.from)
        this.next(token)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private handleAfterWhitespaceAfterClassOfStreamWithoutIdentifier (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.last.append(token)
        return
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
        this._states.pop()
        this.next(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.BLOCK_END:
        this.emitTagStart(this._states.get(this._states.size - 2))
        this.emitWhitespaceEvent()
        this._states.pop()
        this._states.last.type = UnidocParserStateType.STREAM_CONTENT
        this._states.last.at(token.from)
        this.next(token)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private handleAfterClassOfStreamWithIdentifier (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.push(UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_STREAM_WITH_IDENTIFIER)
        this._states.last.at(token.from)
        this._states.last.append(token)
        return
      case UnidocTokenType.CLASS:
        this._states.last.append(token)
        return
      case UnidocTokenType.TAG :
      case UnidocTokenType.WORD :
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.BLOCK_END :
      case UnidocTokenType.IDENTIFIER:
        this.emitTagStart()
        this._states.last.type = UnidocParserStateType.STREAM_CONTENT
        this._states.last.at(token.from)
        this.next(token)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private handleAfterWhitespaceAfterClassOfStreamWithIdentifier (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.last.append(token)
        return
      case UnidocTokenType.CLASS:
        this._states.pop()
        this.next(token)
        return
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.TAG :
      case UnidocTokenType.WORD :
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.BLOCK_END :
        this.emitTagStart(this._states.get(0))
        this.emitWhitespaceEvent()
        this._states.pop()
        this._states.last.type = UnidocParserStateType.STREAM_CONTENT
        this._states.last.at(token.from)
        this.next(token)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private handleAfterStreamContent (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.TAG:
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
      case UnidocTokenType.WORD:
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
      case UnidocTokenType.BLOCK_START:
        this.handleAfterContent(token)
        return
      case UnidocTokenType.BLOCK_END:
        throw new Error('Trying to terminate a stream of content.')
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private handleAfterBlockContent (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.TAG:
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
      case UnidocTokenType.WORD:
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
      case UnidocTokenType.BLOCK_START:
        this.handleAfterContent(token)
        return
      case UnidocTokenType.BLOCK_END:
        this._states.last.append(token)
        this.emitTagEnd()
        this._states.pop()
        this._states.last.at(token.to)
        break
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private handleAfterContent (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.TAG:
        this._states.push(UnidocParserStateType.CLASS_OF_TAG_WITHOUT_IDENTIFIER)
        this._states.last.at(token.from)
        this._states.last.append(token)
        break
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
        this._states.push(UnidocParserStateType.WHITESPACE)
        this._states.last.at(token.from)
        this._states.last.append(token)
        break
      case UnidocTokenType.WORD:
        this._states.push(UnidocParserStateType.WORD)
        this._states.last.at(token.from)
        this._states.last.append(token)
        break
      case UnidocTokenType.IDENTIFIER:
        this._states.push(UnidocParserStateType.CLASS_OF_TAG_WITH_IDENTIFIER)
        this._states.last.at(token.from)
        this._states.last.append(token)
        this._states.last.tag = BLOCK_TAG
        break
      case UnidocTokenType.CLASS:
        this._states.push(UnidocParserStateType.CLASS_OF_TAG_WITHOUT_IDENTIFIER)
        this._states.last.at(token.from)
        this._states.last.append(token)
        this._states.last.tag = BLOCK_TAG
        break
      case UnidocTokenType.BLOCK_START:
        this._states.push(UnidocParserStateType.BLOCK_CONTENT)
        this._states.last.at(token.from)
        this._states.last.append(token)
        this._states.last.tag = BLOCK_TAG
        this.emitTagStart()
        this._states.last.from.copy(token.to)
        break
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private handleAfterWhitespace (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.last.append(token)
        return
      default:
        this.emitWhitespaceEvent()
        this._states.pop()
        this._states.last.at(token.from)
        this.next(token)
        return
    }
  }

  private handleAfterWord (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.WORD:
        this._states.last.append(token)
        return
      default:
        this.emitWordEvent()
        this._states.pop()
        this._states.last.at(token.from)
        this.next(token)
        return
    }
  }

  private handleAfterClassOfTagWithoutIdentifier (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.push(UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_TAG_WITHOUT_IDENTIFIER)
        this._states.last.at(token.from)
        this._states.last.append(token)
        return
      case UnidocTokenType.IDENTIFIER:
        this._states.last.append(token)
        this._states.last.type = UnidocParserStateType.CLASS_OF_TAG_WITH_IDENTIFIER
        return
      case UnidocTokenType.CLASS:
        this._states.last.append(token)
        return
      case UnidocTokenType.TAG :
      case UnidocTokenType.WORD :
      case UnidocTokenType.BLOCK_END :
        this.emitTagStart()
        this._states.last.at(this._states.last.to)
        this.emitTagEnd()
        this._states.pop()
        this.next(token)
        return
      case UnidocTokenType.BLOCK_START:
        this._states.last.append(token)
        this.emitTagStart()
        this._states.last.type = UnidocParserStateType.BLOCK_CONTENT
        this._states.last.at(token.to)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private handleAfterWhitespaceAfterClassOfTagWithoutIdentifier (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.last.append(token)
        return
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
      case UnidocTokenType.BLOCK_START:
        this._states.pop()
        this._states.last.to.copy(token.from)
        this.next(token)
        return
      case UnidocTokenType.TAG :
      case UnidocTokenType.WORD :
      case UnidocTokenType.BLOCK_END :
        this.emitTagStart(this._states.get(this._states.size - 2))
        this._states.get(this._states.size - 2).at(this._states.last.from)
        this.emitTagEnd(this._states.get(this._states.size - 2))
        this.emitWhitespaceEvent()
        this._states.pop()
        this._states.pop()
        this.next(token)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private handleAfterClassOfTagWithIdentifier (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.push(UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_TAG_WITH_IDENTIFIER)
        this._states.last.at(token.from)
        this._states.last.append(token)
        return
      case UnidocTokenType.CLASS:
        this._states.last.append(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_END:
      case UnidocTokenType.IDENTIFIER:
        this.emitTagStart()
        this._states.last.at(this._states.last.to)
        this.emitTagEnd()

        this._states.pop()
        this.next(token)
        return
      case UnidocTokenType.BLOCK_START:
        this._states.last.append(token)
        this.emitTagStart()
        this._states.last.type = UnidocParserStateType.BLOCK_CONTENT
        this._states.last.at(token.to)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private handleAfterWhitespaceAfterClassOfTagWithIdentifier (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.last.append(token)
        return
      case UnidocTokenType.CLASS:
      case UnidocTokenType.BLOCK_START:
        this._states.pop()
        this._states.last.to.copy(token.from)
        this.next(token)
        return
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.TAG :
      case UnidocTokenType.WORD :
      case UnidocTokenType.BLOCK_END :
        this.emitTagStart(this._states.get(this._states.size - 2))
        this._states.get(this._states.size - 2).at(this._states.last.from)
        this.emitTagEnd(this._states.get(this._states.size - 2))
        this.emitWhitespaceEvent()
        this._states.pop()
        this._states.pop()
        this.next(token)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  /**
  * Handle the given token after error.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterError (token : UnidocToken) : void {
    this.throwUnhandledTokenType(token)
  }

  private throwUnhandledTokenType (token : UnidocToken) : void {
    throw new Error(
      'The token type #' + token.type + ' "' +
      UnidocTokenType.toString(token.type) + '" is currently not handled by ' +
      'this parser when it is in state #' + this._states.last.type + ' "' +
      UnidocParserStateType.toString(this._states.last.type) + '".'
    )
  }

  private recoverFromDocumentStartWithBlockEndingError (token : UnidocToken) : void {
    this._states.last.from.copy(token.to)
  }

  private emitDocumentStartWithBlockEndingError () {
    this._validation.clear()
    //this._validation.asError('An unidoc document cannot start with a block ending character.')
    this.emitValidation(this._validation)
  }

  private emitVirtualDocumentStart (state : UnidocParserState = this._states.last) {
    this._event.clear()
    this._event.type = UnidocEventType.START_TAG
    this._event.from.copy(state.from)
    this._event.to.copy(state.from)
    this._event.tag = DOCUMENT_TAG
    this._event.path.copy(this.path)

    this.emit(this._event)

    this.path.size += 1
    this.path.last.type = UnidocPathElementType.TAG
    this.path.last.name = this._event.tag
    this.path.last.identifier = this._event.identifier
    this.path.last.addClasses(this._event.classes)
    this.path.last.from.copy(this._event.from.last.from)
    this.path.last.to.asUnknown()
  }

  private emitVirtualDocumentEnd (state : UnidocParserState = this._states.last) {
    this._event.clear()
    this._event.type = UnidocEventType.END_TAG
    this._event.from.copy(state.to)
    this._event.to.copy(state.to)
    this._event.tag = DOCUMENT_TAG
    this._event.path.copy(this.path)
    this._event.path.size -= 1

    this.emit(this._event)

    this.path.size -= 1
  }

  private emitTagStart (state : UnidocParserState = this._states.last) : void {
    this._event.clear()
    this._event.type = UnidocEventType.START_TAG
    this._event.from.copy(state.from)
    this._event.to.copy(state.to)
    this._event.addClasses(state.classes)
    this._event.identifier = state.identifier
    this._event.tag = state.tag
    this._event.path.copy(this.path)

    this.emit(this._event)

    this.path.size += 1
    this.path.last.type = UnidocPathElementType.TAG
    this.path.last.name = this._event.tag
    this.path.last.identifier = this._event.identifier
    this.path.last.addClasses(this._event.classes)
    this.path.last.from.copy(this._event.from.last.from)
    this.path.last.to.asUnknown()
  }
    /**
    * Emit a unidoc tag termination event.
    */
    private emitTagEnd (state : UnidocParserState = this._states.last) : void {
      this._event.clear()
      this._event.type = UnidocEventType.END_TAG
      this._event.from.copy(state.from)
      this._event.to.copy(state.to)
      this._event.addClasses(state.classes)
      this._event.identifier = state.identifier
      this._event.tag = state.tag
      this._event.path.copy(this.path)
      this._event.path.size -= 1

      this.emit(this._event)

      this.path.size -= 1
    }

  /**
  * Emit a unidoc whitespace event.
  */
  private emitWhitespaceEvent (state : UnidocParserState = this._states.last) : void {
    this._event.clear()
    this._event.type = UnidocEventType.WHITESPACE
    this._event.from.copy(state.from)
    this._event.to.copy(state.to)
    this._event.symbols.concat(state.content)
    this._event.path.copy(this.path)

    this.emit(this._event)
  }

  /**
  * Emit a unidoc word event.
  */
  private emitWordEvent (state : UnidocParserState = this._states.last) : void {
    this._event.clear()
    this._event.type = UnidocEventType.WORD
    this._event.from.copy(state.from)
    this._event.to.copy(state.to)
    this._event.symbols.concat(state.content)
    this._event.path.copy(this.path)

    this.emit(this._event)
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

  private emitCompletion () : void {
    for (const callback of this._completionListeners) {
      callback()
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
