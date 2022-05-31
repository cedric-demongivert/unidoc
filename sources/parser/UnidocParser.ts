import { UnidocToken } from '../token/UnidocToken'
import { UnidocTokenType } from '../token/UnidocTokenType'

import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventBuilder } from '../event/UnidocEventBuilder'

import { UnidocFunction } from '../stream/UnidocFunction'
import { UnidocSink } from '../stream/UnidocSink'

import { UnidocParserStateType } from './UnidocParserStateType'
import { UnidocParserState } from './UnidocParserState'
import { UnidocParserStateBuffer } from './UnidocParserStateBuffer'

const DOCUMENT_TAG: string = 'document'
const BLOCK_TAG: string = 'block'

/***
* CORRIGER SINGLETON POUR SINGLETON + ELEMENT EN (SINGLETON) ONLY.
*/

/**
* A unidoc token stream parser.
*/
export class UnidocParser extends UnidocFunction<UnidocToken, UnidocEvent>
{
  /**
  * Inner state of the parser.
  */
  private _states: UnidocParserStateBuffer

  /**
  * Unidoc event instance for publication.
  */
  private _event: UnidocEventBuilder

  /**
  * Unidoc validation instance for publication.
  */
  //private _validation: UnidocValidation

  /**
  * Instantiate a new unidoc parser with a given token buffer capacity.
  *
  * @param [capacity = 32] - Initial state buffer capacity of the parser.
  */
  public constructor(capacity: number = 32) {
    super()

    this._states = new UnidocParserStateBuffer(capacity)
    this._event = new UnidocEventBuilder()

    this._states.push(UnidocParserStateType.START)
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public start(): void {

  }

  /**
  * @see UnidocConsumer.handleFailure
  */
  public failure(error: Error): void {
    this.output.fail(error)
  }

  /**
  * Feed this parser with the given token.
  *
  * @param token - The token to give to the parser.
  */
  public next(token: UnidocToken): void {
    switch (this._states.last.type) {
      case UnidocParserStateType.START:
        this.nextAfterStart(token)
        break
      case UnidocParserStateType.STREAM_CONTENT:
        this.nextAfterStreamContent(token)
        break
      case UnidocParserStateType.BLOCK_CONTENT:
        this.nextAfterBlockContent(token)
        break
      case UnidocParserStateType.WHITESPACE:
        this.nextAfterWhitespace(token)
        break
      case UnidocParserStateType.WORD:
        this.nextAfterWord(token)
        break
      case UnidocParserStateType.CLASS_OF_TAG_WITHOUT_IDENTIFIER:
        this.nextAfterClassOfTagWithoutIdentifier(token)
        break
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_TAG_WITHOUT_IDENTIFIER:
        this.nextAfterWhitespaceAfterClassOfTagWithoutIdentifier(token)
        break
      case UnidocParserStateType.CLASS_OF_TAG_WITH_IDENTIFIER:
        this.nextAfterClassOfTagWithIdentifier(token)
        break
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_TAG_WITH_IDENTIFIER:
        this.nextAfterWhitespaceAfterClassOfTagWithIdentifier(token)
        break
      case UnidocParserStateType.ERROR:
        this.nextAfterError(token)
        break
      case UnidocParserStateType.LEADING_WHITESPACE:
        this.nextAfterLeadingWhitespace(token)
        break
      case UnidocParserStateType.CLASS_OF_STREAM_WITHOUT_IDENTIFIER:
        this.nextAfterClassOfStreamWithoutIdentifier(token)
        break
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_STREAM_WITHOUT_IDENTIFIER:
        this.nextAfterWhitespaceAfterClassOfStreamWithoutIdentifier(token)
        break
      case UnidocParserStateType.CLASS_OF_STREAM_WITH_IDENTIFIER:
        this.nextAfterClassOfStreamWithIdentifier(token)
        break
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_STREAM_WITH_IDENTIFIER:
        this.nextAfterWhitespaceAfterClassOfStreamWithIdentifier(token)
        break
      default:
        this.throwUhandledParserState(token)
    }
  }

  private throwUhandledParserState(token: UnidocToken): void {
    throw new Error(
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
  public success(): void {
    switch (this._states.last.type) {
      case UnidocParserStateType.START:
        this.emitVirtualDocumentStart()
        this.emitVirtualDocumentEnd()
        this._states.last.type = UnidocParserStateType.TERMINATION
        this.success()
        break
      case UnidocParserStateType.STREAM_CONTENT:
        this.emitTagEnd()
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.origin.at(this._states.last.origin.to)
        this.success()
        break
      case UnidocParserStateType.BLOCK_CONTENT:
        // ERROR & RECOVER
        this.emitTagEnd()
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.origin.at(this._states.last.origin.to)
        this.success()
        break
      case UnidocParserStateType.WHITESPACE:
        this.emitWhitespaceEvent()
        this._states.get(this._states.size - 2).origin.at(this._states.last.origin.to)
        this._states.pop()
        this.success()
        break
      case UnidocParserStateType.WORD:
        this.emitWordEvent()
        this._states.get(this._states.size - 2).origin.at(this._states.last.origin.to)
        this._states.pop()
        this.success()
        break
      case UnidocParserStateType.CLASS_OF_TAG_WITHOUT_IDENTIFIER:
      case UnidocParserStateType.CLASS_OF_TAG_WITH_IDENTIFIER:
        this.emitTagStart()
        this._states.last.origin.at(this._states.last.origin.to)
        this.emitTagEnd()
        this._states.pop()
        this.success()
        break
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_TAG_WITHOUT_IDENTIFIER:
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_TAG_WITH_IDENTIFIER:
        this.emitTagStart(this._states.get(this._states.size - 2))
        this._states.get(this._states.size - 2).origin.at(this._states.last.origin.from)
        this.emitTagEnd(this._states.get(this._states.size - 2))
        this.emitWhitespaceEvent()
        this._states.pop()
        this._states.pop()
        this.success()
        break
      case UnidocParserStateType.ERROR:
        this.throwUnhandledCompletionParserState()
        break
      case UnidocParserStateType.LEADING_WHITESPACE:
        this.emitVirtualDocumentStart()
        this.emitWhitespaceEvent()
        this.emitVirtualDocumentEnd()
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.origin.at(this._states.last.origin.to)
        this.success()
        break
      case UnidocParserStateType.CLASS_OF_STREAM_WITHOUT_IDENTIFIER:
      case UnidocParserStateType.CLASS_OF_STREAM_WITH_IDENTIFIER:
        this.emitTagStart()
        this.emitVirtualDocumentEnd()
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.origin.at(this._states.last.origin.to)
        this.success()
        break
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_STREAM_WITHOUT_IDENTIFIER:
        this.emitTagStart(this._states.get(this._states.size - 2))
        this._states.get(this._states.size - 2).origin.at(this._states.last.origin.from)
        this.emitWhitespaceEvent()
        this._states.pop()
        this.emitVirtualDocumentEnd()
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.origin.at(this._states.last.origin.to)
        this.success()
        break
      case UnidocParserStateType.TERMINATION:
        this.output.success()
        return
      default:
        this.throwUnhandledCompletionParserState()
    }
  }

  private throwUnhandledCompletionParserState(): void {
    throw new Error(
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
  private nextAfterStart(token: UnidocToken): void {
    this._states.last.origin.at(token.origin.from)
    this._states.last.tag = DOCUMENT_TAG

    switch (token.type) {
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
        this._states.last.type = UnidocParserStateType.LEADING_WHITESPACE
        this._states.last.append(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.WORD:
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
        if (token.isTag(DOCUMENT_TAG)) {
          this._states.last.type = UnidocParserStateType.CLASS_OF_STREAM_WITHOUT_IDENTIFIER
          this._states.last.origin.to.copy(token.origin.to)
        } else {
          this.emitVirtualDocumentStart()
          this._states.last.type = UnidocParserStateType.STREAM_CONTENT
          this.next(token)
        }
        return
      case UnidocTokenType.BLOCK_END:
        this.emitDocumentStartWithBlockEndingError()
        this.recoverFromDocumentStartWithBlockEndingError(token)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private nextAfterLeadingWhitespace(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
        this._states.last.append(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.WORD:
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
        if (token.isTag(DOCUMENT_TAG)) {
          this._states.last.type = UnidocParserStateType.CLASS_OF_STREAM_WITHOUT_IDENTIFIER
          this._states.last.origin.to.copy(token.origin.to)
          this._states.last.content.clear()
        } else {
          this.emitVirtualDocumentStart()
          this.emitWhitespaceEvent()
          this._states.last.type = UnidocParserStateType.STREAM_CONTENT
          this._states.last.origin.at(token.origin.from)
          this.next(token)
        }
        return
      case UnidocTokenType.BLOCK_END:
        this.emitDocumentStartWithBlockEndingError()
        this.recoverFromDocumentStartWithBlockEndingError(token)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private nextAfterClassOfStreamWithoutIdentifier(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.push(UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_STREAM_WITHOUT_IDENTIFIER)
        this._states.last.origin.at(token.origin.from)
        this._states.last.append(token)
        return
      case UnidocTokenType.IDENTIFIER:
        this._states.last.append(token)
        this._states.last.type = UnidocParserStateType.CLASS_OF_STREAM_WITH_IDENTIFIER
        return
      case UnidocTokenType.CLASS:
        this._states.last.append(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.BLOCK_END:
        this.emitTagStart()
        this._states.last.type = UnidocParserStateType.STREAM_CONTENT
        this._states.last.origin.at(token.origin.from)
        this.next(token)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private nextAfterWhitespaceAfterClassOfStreamWithoutIdentifier(token: UnidocToken): void {
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
        this._states.last.origin.at(token.origin.from)
        this.next(token)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private nextAfterClassOfStreamWithIdentifier(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.push(UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_STREAM_WITH_IDENTIFIER)
        this._states.last.origin.at(token.origin.from)
        this._states.last.append(token)
        return
      case UnidocTokenType.CLASS:
        this._states.last.append(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.BLOCK_END:
      case UnidocTokenType.IDENTIFIER:
        this.emitTagStart()
        this._states.last.type = UnidocParserStateType.STREAM_CONTENT
        this._states.last.origin.at(token.origin.from)
        this.next(token)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private nextAfterWhitespaceAfterClassOfStreamWithIdentifier(token: UnidocToken): void {
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
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.BLOCK_END:
        this.emitTagStart(this._states.get(0))
        this.emitWhitespaceEvent()
        this._states.pop()
        this._states.last.type = UnidocParserStateType.STREAM_CONTENT
        this._states.last.origin.at(token.origin.from)
        this.next(token)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private nextAfterStreamContent(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.TAG:
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
      case UnidocTokenType.WORD:
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
      case UnidocTokenType.BLOCK_START:
        this.nextAfterContent(token)
        return
      case UnidocTokenType.BLOCK_END:
        throw new Error('Trying to terminate a stream of content.')
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private nextAfterBlockContent(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.TAG:
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
      case UnidocTokenType.WORD:
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
      case UnidocTokenType.BLOCK_START:
        this.nextAfterContent(token)
        return
      case UnidocTokenType.BLOCK_END:
        this._states.last.append(token)
        this.emitTagEnd()
        this._states.pop()
        this._states.last.origin.at(token.origin.to)
        break
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private nextAfterContent(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.TAG:
        this._states.push(UnidocParserStateType.CLASS_OF_TAG_WITHOUT_IDENTIFIER)
        this._states.last.origin.at(token.origin.from)
        this._states.last.append(token)
        break
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
        this._states.push(UnidocParserStateType.WHITESPACE)
        this._states.last.origin.at(token.origin.from)
        this._states.last.append(token)
        break
      case UnidocTokenType.WORD:
        this._states.push(UnidocParserStateType.WORD)
        this._states.last.origin.at(token.origin.from)
        this._states.last.append(token)
        break
      case UnidocTokenType.IDENTIFIER:
        this._states.push(UnidocParserStateType.CLASS_OF_TAG_WITH_IDENTIFIER)
        this._states.last.origin.at(token.origin.from)
        this._states.last.append(token)
        this._states.last.tag = BLOCK_TAG
        break
      case UnidocTokenType.CLASS:
        this._states.push(UnidocParserStateType.CLASS_OF_TAG_WITHOUT_IDENTIFIER)
        this._states.last.origin.at(token.origin.from)
        this._states.last.append(token)
        this._states.last.tag = BLOCK_TAG
        break
      case UnidocTokenType.BLOCK_START:
        this._states.push(UnidocParserStateType.BLOCK_CONTENT)
        this._states.last.origin.at(token.origin.from)
        this._states.last.append(token)
        this._states.last.tag = BLOCK_TAG
        this.emitTagStart()
        this._states.last.origin.from.copy(token.origin.to)
        break
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private nextAfterWhitespace(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.last.append(token)
        return
      default:
        this.emitWhitespaceEvent()
        this._states.pop()
        this._states.last.origin.at(token.origin.from)
        this.next(token)
        return
    }
  }

  private nextAfterWord(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.WORD:
        this._states.last.append(token)
        return
      default:
        this.emitWordEvent()
        this._states.pop()
        this._states.last.origin.at(token.origin.from)
        this.next(token)
        return
    }
  }

  private nextAfterClassOfTagWithoutIdentifier(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.push(UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_TAG_WITHOUT_IDENTIFIER)
        this._states.last.origin.at(token.origin.from)
        this._states.last.append(token)
        return
      case UnidocTokenType.IDENTIFIER:
        this._states.last.append(token)
        this._states.last.type = UnidocParserStateType.CLASS_OF_TAG_WITH_IDENTIFIER
        return
      case UnidocTokenType.CLASS:
        this._states.last.append(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_END:
        this.emitTagStart()
        this._states.last.origin.at(this._states.last.origin.to)
        this.emitTagEnd()
        this._states.pop()
        this.next(token)
        return
      case UnidocTokenType.BLOCK_START:
        this._states.last.append(token)
        this.emitTagStart()
        this._states.last.type = UnidocParserStateType.BLOCK_CONTENT
        this._states.last.origin.at(token.origin.to)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private nextAfterWhitespaceAfterClassOfTagWithoutIdentifier(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.last.append(token)
        return
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
      case UnidocTokenType.BLOCK_START:
        this._states.pop()
        this._states.last.origin.to.copy(token.origin.from)
        this.next(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_END:
        this.emitTagStart(this._states.get(this._states.size - 2))
        this._states.get(this._states.size - 2).origin.at(this._states.last.origin.from)
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

  private nextAfterClassOfTagWithIdentifier(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.push(UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_TAG_WITH_IDENTIFIER)
        this._states.last.origin.at(token.origin.from)
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
        this._states.last.origin.at(this._states.last.origin.to)
        this.emitTagEnd()

        this._states.pop()
        this.next(token)
        return
      case UnidocTokenType.BLOCK_START:
        this._states.last.append(token)
        this.emitTagStart()
        this._states.last.type = UnidocParserStateType.BLOCK_CONTENT
        this._states.last.origin.at(token.origin.to)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private nextAfterWhitespaceAfterClassOfTagWithIdentifier(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._states.last.append(token)
        return
      case UnidocTokenType.CLASS:
      case UnidocTokenType.BLOCK_START:
        this._states.pop()
        this._states.last.origin.to.copy(token.origin.from)
        this.next(token)
        return
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_END:
        this.emitTagStart(this._states.get(this._states.size - 2))
        this._states.get(this._states.size - 2).origin.at(this._states.last.origin.from)
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
  private nextAfterError(token: UnidocToken): void {
    this.throwUnhandledTokenType(token)
  }

  private throwUnhandledTokenType(token: UnidocToken): void {
    throw new Error(
      'The token type #' + token.type + ' "' +
      UnidocTokenType.toString(token.type) + '" is currently not handled by ' +
      'this parser when it is in state #' + this._states.last.type + ' "' +
      UnidocParserStateType.toString(this._states.last.type) + '".'
    )
  }

  private recoverFromDocumentStartWithBlockEndingError(token: UnidocToken): void {
    this._states.last.origin.from.copy(token.origin.to)
  }

  private emitDocumentStartWithBlockEndingError() {
    //this._validation.clear()
    //this._validation.asError('An unidoc document cannot start with a block ending character.')
    //this.emitValidation(this._validation)
    /** @TODO */
  }

  private emitVirtualDocumentStart(state: UnidocParserState = this._states.last) {
    this._event.setOrigin(state.origin.from)
      .asTagStart(DOCUMENT_TAG)

    this.emit()
  }

  private emitVirtualDocumentEnd(state: UnidocParserState = this._states.last) {
    this._event.setOrigin(state.origin.to)
      .asTagEnd(DOCUMENT_TAG)

    this.emit()
  }

  private emitTagStart(state: UnidocParserState = this._states.last): void {
    this._event.setOrigin(state.origin.from, state.origin.to)
      .asTagStart(state.tag)
      .setClasses(state.classes)
      .setIdentifier(state.identifier)

    this.emit()
  }

  /**
  * Emit a unidoc tag termination event.
  */
  private emitTagEnd(state: UnidocParserState = this._states.last): void {
    this._event.setOrigin(state.origin.from, state.origin.to)
      .asTagEnd(state.tag)
      .setClasses(state.classes)
      .setIdentifier(state.identifier)

    this.emit()
  }

  /**
  * Emit a unidoc whitespace event.
  */
  private emitWhitespaceEvent(state: UnidocParserState = this._states.last): void {
    this._event.setOrigin(state.origin.from, state.origin.to)
      .asWhitespace()
      .setSymbols(state.content)

    this.emit()
  }

  /**
  * Emit a unidoc word event.
  */
  private emitWordEvent(state: UnidocParserState = this._states.last): void {
    this._event.setOrigin(state.origin.from, state.origin.to)
      .asWord()
      .setSymbols(state.content)

    this.emit()
  }

  /**
   * 
   */
  private emit(): void {
    const event: UnidocEventBuilder = this._event
    const output: UnidocSink<UnidocEvent> = this.output

    if (event.index === 0) {
      output.start()
    }

    output.next(event.get())

    event.incrementIndex()
  }

  /**
  * Reset this parser in order to reuse-it.
  */
  public clear(): void {
    this.off()
    this._states.clear()
    this._states.push(UnidocParserStateType.START)
    this._event.clear()
  }
}

