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

const DOCUMENT_TAG : string = 'document'
const BLOCK_TAG : string = 'block'

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
    this.location.asUnknown()

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
      case UnidocParserStateType.START:
        this.handleAfterStart(token)
        break
      case UnidocParserStateType.START_WHITESPACE:
        this.handleAfterStartingWhitespace(token)
        break
      case UnidocParserStateType.START_CLASSES_BEFORE_IDENTIFIER:
        this.handleAfterStartingClassesBeforeIdentifier(token)
        break
      case UnidocParserStateType.START_CLASSES_AFTER_IDENTIFIER:
        this.handleAfterStartingClassesAfterIdentifier(token)
        break
      case UnidocParserStateType.STREAM_CONTENT:
        this.handleAfterStreamingContent(token)
        break
      case UnidocParserStateType.BLOCK_CONTENT:
        this.handleAfterBlockContent(token)
        break
      case UnidocParserStateType.SINGLETON_CONTENT:
        this.handleAfterSingletonContent(token)
        break
      case UnidocParserStateType.SINGLETON_TERMINATION:
        this.handleAfterSingletonTermination(token)
        break
      case UnidocParserStateType.WHITESPACE:
        this.handleAfterWhitespace(token)
        break
      case UnidocParserStateType.WORD:
        this.handleAfterWord(token)
        break
      case UnidocParserStateType.TAG_CLASSES_BEFORE_IDENTIFIER:
        this.handleAfterTagClassesBeforeIdentifier(token)
        break
      case UnidocParserStateType.TAG_CLASSES_AFTER_IDENTIFIER:
        this.handleAfterTagClassesAfterIdentifier(token)
        break
      case UnidocParserStateType.ERROR:
        this.handleAfterError(token)
        break
      default:
        //this.emitError(token)
    }
  }

  /**
  * Call when the stream of tokens reach it's end.
  */
  public complete () : void {
    switch (this._states.last.type) {
      case UnidocParserStateType.START:
        this._states.last.from.copy(UnidocLocation.ZERO)
        this._states.last.tag = DOCUMENT_TAG
        this.location.copy(UnidocLocation.ZERO)
        this.emitTagStart()
        this.emitTagEnd(UnidocLocation.ZERO, UnidocLocation.ZERO)
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.from.copy(UnidocLocation.ZERO)
        return
      case UnidocParserStateType.START_WHITESPACE:
        this.location.copy(this._tokens.from)
        this.emitTagStart()
        this.location.copy(this._tokens.to)
        this.emitWhitespaceEvent()
        this.emitTagEnd(this._tokens.to, this._tokens.to)
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.from.copy(UnidocLocation.ZERO)
        return
      case UnidocParserStateType.START_CLASSES_BEFORE_IDENTIFIER:
      case UnidocParserStateType.START_CLASSES_AFTER_IDENTIFIER:
        this.emitTagStart()
        this.emitTagEnd(this.location, this.location)
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.from.copy(UnidocLocation.ZERO)
        return
      case UnidocParserStateType.STREAM_CONTENT:
        this.emitTagEnd(this.location, this.location)
        this._states.last.type = UnidocParserStateType.TERMINATION
        return
      case UnidocParserStateType.SINGLETON_CONTENT:
      case UnidocParserStateType.SINGLETON_TERMINATION:
        this.emitTagEnd(this.location, this.location)
        this._states.pop()
        this.complete()
        return
      case UnidocParserStateType.BLOCK_CONTENT:
        // unclosed error
        this.emitTagEnd(this.location, this.location)
        this._states.pop()
        this.complete()
        return
      case UnidocParserStateType.WHITESPACE:
        this.emitWhitespaceEvent()
        this._tokens.clear()
        this._states.pop()
        this.complete()
        return
      case UnidocParserStateType.WORD:
        this.emitWordEvent()
        this._tokens.clear()
        this._states.pop()
        this.complete()
        return
      case UnidocParserStateType.TAG_CLASSES_BEFORE_IDENTIFIER:
      case UnidocParserStateType.TAG_CLASSES_AFTER_IDENTIFIER:
        this.emitTagStart()
        this.emitTagEnd(this.location, this.location)
        this.complete()
        return
      case UnidocParserStateType.TERMINATION:
      case UnidocParserStateType.ERROR:
        return
    }
  }

  /**
  * Handle the given token after start.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterStart (token : UnidocToken) : void {
    this._states.last.from.copy(token.from)
    this._states.last.tag = DOCUMENT_TAG
    this.location.copy(token.from)

    switch (token.type) {
      case UnidocTokenType.NEW_LINE    :
      case UnidocTokenType.SPACE       :
        this._states.last.type = UnidocParserStateType.START_WHITESPACE
        this._tokens.push(token)
        this.location.copy(token.to)
        return
      case UnidocTokenType.TAG         :
      case UnidocTokenType.BLOCK_START :
      case UnidocTokenType.WORD        :
      case UnidocTokenType.IDENTIFIER  :
      case UnidocTokenType.CLASS       :
        if (token.isTag(DOCUMENT_TAG)) {
          this._states.last.type = UnidocParserStateType.START_CLASSES_BEFORE_IDENTIFIER
          this.location.copy(token.to)
        } else {
          this.emitTagStart()
          this._states.last.type = UnidocParserStateType.STREAM_CONTENT
          this.next(token)
        }
        return
      case UnidocTokenType.BLOCK_END   :
        this.emitDocumentStartWithBlockEndingError()
        this.recoverFromDocumentStartWithBlockEndingError(token)
        return
    }
  }

  /**
  * Handle the given token after starting whitespaces.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterStartingWhitespace (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.NEW_LINE    :
      case UnidocTokenType.SPACE       :
        this._tokens.push(token)
        this.location.copy(token.to)
        return
      case UnidocTokenType.TAG         :
      case UnidocTokenType.BLOCK_START :
      case UnidocTokenType.WORD        :
      case UnidocTokenType.IDENTIFIER  :
      case UnidocTokenType.CLASS       :
        if (token.isTag(DOCUMENT_TAG)) {
          this._states.last.type = UnidocParserStateType.START_CLASSES_BEFORE_IDENTIFIER
          this.location.copy(token.to)
        } else {
          this.location.copy(this._tokens.from)
          this.emitTagStart()
          this._states.last.type = UnidocParserStateType.STREAM_CONTENT
          this.location.copy(this._tokens.to)
          this.emitWhitespaceEvent()
          this._tokens.clear()
          this.next(token)
        }
        return
      case UnidocTokenType.BLOCK_END   :
        this.emitDocumentStartWithBlockEndingError()
        this.recoverFromDocumentStartWithBlockEndingError(token)
        return
    }
  }

  /**
  * Handle the given token after starting document classes.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterStartingClassesBeforeIdentifier (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.NEW_LINE    :
      case UnidocTokenType.SPACE       :
        this._tokens.push(token)
        this.location.copy(token.to)
        return
      case UnidocTokenType.CLASS       :
        this._states.last.classes.add(token.substring(1))
        this.location.copy(token.to)
        this._tokens.clear()
        return
      case UnidocTokenType.IDENTIFIER  :
        this._states.last.identifier = token.substring(1)
        this._states.last.type = UnidocParserStateType.START_CLASSES_AFTER_IDENTIFIER
        this.location.copy(token.to)
        this._tokens.clear()
        return
      case UnidocTokenType.TAG         :
      case UnidocTokenType.BLOCK_START :
      case UnidocTokenType.WORD        :
        if (this._tokens.size > 0) {
          this.location.copy(this._tokens.from)
          this.emitTagStart()
          this.location.copy(this._tokens.to)
          this.emitWhitespaceEvent()
          this._tokens.clear()
        } else {
          this.emitTagStart()
        }

        this._states.last.type = UnidocParserStateType.STREAM_CONTENT
        this.next(token)
        return
      case UnidocTokenType.BLOCK_END   :
        this.emitDocumentStartWithBlockEndingError()
        this.recoverFromDocumentStartWithBlockEndingError(token)
        return
    }
  }

  /**
  * Handle the given token after starting document classes.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterStartingClassesAfterIdentifier (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.NEW_LINE    :
      case UnidocTokenType.SPACE       :
        this._tokens.push(token)
        this.location.copy(token.to)
        return
      case UnidocTokenType.CLASS       :
        this._states.last.classes.add(token.substring(1))
        this.location.copy(token.to)
        this._tokens.clear()
        return
      case UnidocTokenType.IDENTIFIER  :
      case UnidocTokenType.TAG         :
      case UnidocTokenType.BLOCK_START :
      case UnidocTokenType.WORD        :
        if (this._tokens.size > 0) {
          this.location.copy(this._tokens.from)
          this.emitTagStart()
          this.location.copy(this._tokens.to)
          this.emitWhitespaceEvent()
          this._tokens.clear()
        } else {
          this.emitTagStart()
        }

        this._states.last.type = UnidocParserStateType.STREAM_CONTENT
        this.next(token)
        return
      case UnidocTokenType.BLOCK_END   :
        this.emitDocumentStartWithBlockEndingError()
        this.recoverFromDocumentStartWithBlockEndingError(token)
        return
    }
  }

  /**
  * Handle the given token into a stream of content.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterStreamingContent (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.TAG:
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
      case UnidocTokenType.WORD:
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
      case UnidocTokenType.BLOCK_START:
        this.handleBasicContent(token)
        return
      case UnidocTokenType.BLOCK_END:
        //this.emitUnstartedTagTermination()
        //this.recoverFromUnstartedTagTermination(token)
        break
    }
  }

  /**
  * Handle the given token into a block content.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterBlockContent (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.TAG:
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
      case UnidocTokenType.WORD:
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
      case UnidocTokenType.BLOCK_START:
        this.handleBasicContent(token)
        return
      case UnidocTokenType.BLOCK_END:
        this.emitTagEnd(token.from, token.to)
        this._states.pop()
        this.location.copy(token.to)
        break
    }
  }

  /**
  * Handle the given token into a singleton content.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterSingletonContent (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
        this.location.copy(token.to)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
        this._states.last.type = UnidocParserStateType.SINGLETON_TERMINATION
        this.handleBasicContent(token)
        return
      case UnidocTokenType.BLOCK_END:
      case UnidocTokenType.BLOCK_START:
        //ERROR
    }
  }

  /**
  * Handle the given token after a singleton content.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterSingletonTermination (token : UnidocToken) : void {
    this.emitTagEnd(token.from, token.from)
    this._states.pop()
    this.next(token)
  }

  private handleBasicContent (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.TAG:
        this._states.push(UnidocParserStateType.TAG_CLASSES_BEFORE_IDENTIFIER)
        this._states.last.tag = token.substring(1)
        this._states.last.from.copy(token.from)
        this.location.copy(token.to)
        break
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
        this._tokens.push(token)
        this._states.push(UnidocParserStateType.WHITESPACE)
        this._states.last.from.copy(token.from)
        this.location.copy(token.to)
        break
      case UnidocTokenType.WORD:
        this._tokens.push(token)
        this._states.push(UnidocParserStateType.WORD)
        this._states.last.from.copy(token.from)
        this.location.copy(token.to)
        break
      case UnidocTokenType.IDENTIFIER:
        this._states.push(UnidocParserStateType.TAG_CLASSES_AFTER_IDENTIFIER)
        this._states.last.identifier = token.substring(1)
        this._states.last.tag = BLOCK_TAG
        this._states.last.from.copy(token.from)
        this.location.copy(token.to)
        break
      case UnidocTokenType.CLASS:
        this._states.push(UnidocParserStateType.TAG_CLASSES_BEFORE_IDENTIFIER)
        this._states.last.classes.add(token.substring(1))
        this._states.last.tag = BLOCK_TAG
        this._states.last.from.copy(token.from)
        this.location.copy(token.to)
        break
      case UnidocTokenType.BLOCK_START:
        this._states.push(UnidocParserStateType.BLOCK_CONTENT)
        this._states.last.tag = BLOCK_TAG
        this._states.last.from.copy(token.from)
        this.location.copy(token.to)
        this.emitTagStart()
        this._states.last.from.copy(token.to)
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
        this.location.copy(token.to)
        return
      default:
        this.emitWhitespaceEvent()
        this._tokens.clear()
        this._states.pop()
        this.next(token)
        return
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
        this.location.copy(token.to)
        return
      default:
        this.emitWordEvent()
        this._tokens.clear()
        this._states.pop()
        this.next(token)
        return
    }
  }

  /**
  * Handle the given token after a tag type.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterTagClassesBeforeIdentifier (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._tokens.push(token)
        this.location.copy(token.to)
        return
      case UnidocTokenType.IDENTIFIER:
        this._states.last.identifier = token.substring(1)
        this._states.last.type = UnidocParserStateType.TAG_CLASSES_AFTER_IDENTIFIER
        this._tokens.clear()
        this.location.copy(token.to)
        return
      case UnidocTokenType.CLASS:
        this._states.last.classes.add(token.substring(1))
        this._tokens.clear()
        this.location.copy(token.to)
        return
      case UnidocTokenType.TAG :
      case UnidocTokenType.WORD :
        this._states.last.type = UnidocParserStateType.SINGLETON_CONTENT
        this.emitTagStart()
        this.location.copy(token.to)
        this._tokens.clear()
        this.next(token)
        return
      case UnidocTokenType.BLOCK_START:
        this._states.last.type = UnidocParserStateType.BLOCK_CONTENT
        this.location.copy(token.to)
        this._tokens.clear()
        this.emitTagStart()
        return
      case UnidocTokenType.BLOCK_END :
        this._states.last.type = UnidocParserStateType.SINGLETON_CONTENT

        // warning
        if (this._tokens.size > 0) {
          this.location.copy(this._tokens.from)
          this.emitTagStart()
          this.emitTagEnd(this._tokens.from, this._tokens.from)
          this.location.copy(this._tokens.to)
          this.emitWhitespaceEvent()
          this._tokens.clear()
        } else {
          this.emitTagStart()
          this.emitTagEnd(token.from, token.from)
        }

        this._states.pop()
        this.next(token)
        return
    }
  }

  /**
  * Handle the given token after a tag type.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterTagClassesAfterIdentifier (token : UnidocToken) : void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._tokens.push(token)
        this.location.copy(token.to)
        return
      case UnidocTokenType.CLASS:
        this._states.last.classes.add(token.substring(1))
        this._tokens.clear()
        this.location.copy(token.to)
        return
      case UnidocTokenType.TAG :
      case UnidocTokenType.WORD :
        this._states.last.type = UnidocParserStateType.SINGLETON_CONTENT
        this.emitTagStart()
        this.location.copy(token.to)
        this._tokens.clear()
        this.next(token)
        return
      case UnidocTokenType.BLOCK_START:
        this._states.last.type = UnidocParserStateType.BLOCK_CONTENT
        this.location.copy(token.to)
        this._tokens.clear()
        this.emitTagStart()
        return
      case UnidocTokenType.BLOCK_END :
        this._states.last.type = UnidocParserStateType.SINGLETON_CONTENT

        // warning
        if (this._tokens.size > 0) {
          this.location.copy(this._tokens.from)
          this.emitTagStart()
          this.emitTagEnd(this._tokens.from, this._tokens.from)
          this.location.copy(this._tokens.to)
          this.emitWhitespaceEvent()
          this._tokens.clear()
        } else {
          this.emitTagStart()
          this.emitTagEnd(token.from, token.from)
        }

        this._states.pop()
        this.next(token)
        return
      case UnidocTokenType.IDENTIFIER:
        this._states.last.type = UnidocParserStateType.SINGLETON_CONTENT
        this.emitTagStart()
        this._tokens.clear()

        this._states.push(UnidocParserStateType.TAG_CLASSES_AFTER_IDENTIFIER)
        this._states.last.identifier = token.substring(1)
        this._states.last.tag = BLOCK_TAG
        this._states.last.from.copy(token.from)
        this.location.copy(token.to)
        return
    }
  }

  /**
  * Handle the given token after error.
  *
  * @param token - A unidock token to handle.
  */
  private handleAfterError (token : UnidocToken) : void {
    //this.emitError(token)
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
  * Emit an unidoc tag start event built from the current parser state.
  */
  private emitTagStart () : void {
    this._event.clear()
    this._event.type = UnidocEventType.START_TAG
    this._event.from.copy(this._states.last.from)
    this._event.to.copy(this.location)
    this._event.addClasses(this._states.last.classes)
    this._event.identifier = this._states.last.identifier
    this._event.tag = this._states.last.tag

    this.emit(this._event)
  }

  /**
  * Emit a unidoc whitespace event.
  */
  private emitWhitespaceEvent () : void {
    this._event.clear()
    this._event.type = UnidocEventType.WHITESPACE
    this._event.from.copy(this._tokens.first.from)
    this._event.to.copy(this._tokens.last.to)

    for (const token of this._tokens) {
      this._event.symbols.concat(token.symbols)
    }

    this.emit(this._event)
  }

  /**
  * Emit a unidoc word event.
  */
  private emitWordEvent () : void {
    this._event.clear()
    this._event.type = UnidocEventType.WORD
    this._event.from.copy(this._tokens.first.from)
    this._event.to.copy(this._tokens.last.to)

    for (const token of this._tokens) {
      this._event.symbols.concat(token.symbols)
    }

    this.emit(this._event)
  }

  /**
  * Emit a unidoc tag termination event.
  */
  private emitTagEnd (from : UnidocLocation, to : UnidocLocation) : void {
    this._event.clear()
    this._event.type = UnidocEventType.END_TAG
    this._event.from.copy(from)
    this._event.to.copy(to)
    this._event.addClasses(this._states.last.classes)
    this._event.identifier = this._states.last.identifier
    this._event.tag = this._states.last.tag

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
    this.location.asUnknown()
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
