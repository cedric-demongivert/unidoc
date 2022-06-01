import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Empty } from '@cedric-demongivert/gl-tool-utils'

import { UnidocToken } from '../token/UnidocToken'
import { UnidocTokenType } from '../token/UnidocTokenType'

import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocFunction } from '../stream/UnidocFunction'
import { UnidocSink } from '../stream/UnidocSink'

import { UnidocParserState } from './UnidocParserState'
import { UnidocPath, UnidocSection } from '../origin'
import { UTF32String } from '../symbol'

const DOCUMENT_TAG: UTF32String = UTF32String.fromString('document')
const BLOCK_TAG: UTF32String = UTF32String.fromString('block')

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
  private readonly _states: Pack<UnidocParserState>

  /**
  * Inner state of the parser.
  */
  private readonly _path: UnidocPath

  /**
  * Unidoc event instance for publication.
  */
  private readonly _event: UnidocEvent

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

    this._states = Pack.any(16, Empty.zero)
    this._event = new UnidocEvent()
    this._path = this._event.path

    this.pushState(UnidocParserState.START)
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
    switch (this._states.last) {
      case UnidocParserState.START:
        this.nextAfterStart(token)
        break
      case UnidocParserState.STREAM_CONTENT:
        this.nextAfterStreamContent(token)
        break
      case UnidocParserState.BLOCK_CONTENT:
        this.nextAfterBlockContent(token)
        break
      case UnidocParserState.WHITESPACE:
        this.nextAfterWhitespace(token)
        break
      case UnidocParserState.WORD:
        this.nextAfterWord(token)
        break
      case UnidocParserState.CLASS_OF_TAG_WITHOUT_IDENTIFIER:
        this.nextAfterClassOfTagWithoutIdentifier(token)
        break
      case UnidocParserState.WHITESPACE_AFTER_CLASS_OF_TAG_WITHOUT_IDENTIFIER:
        this.nextAfterWhitespaceAfterClassOfTagWithoutIdentifier(token)
        break
      case UnidocParserState.CLASS_OF_TAG_WITH_IDENTIFIER:
        this.nextAfterClassOfTagWithIdentifier(token)
        break
      case UnidocParserState.WHITESPACE_AFTER_CLASS_OF_TAG_WITH_IDENTIFIER:
        this.nextAfterWhitespaceAfterClassOfTagWithIdentifier(token)
        break
      case UnidocParserState.ERROR:
        this.nextAfterError(token)
        break
      case UnidocParserState.LEADING_WHITESPACE:
        this.nextAfterLeadingWhitespace(token)
        break
      case UnidocParserState.CLASS_OF_STREAM_WITHOUT_IDENTIFIER:
        this.nextAfterClassOfStreamWithoutIdentifier(token)
        break
      case UnidocParserState.WHITESPACE_AFTER_CLASS_OF_STREAM_WITHOUT_IDENTIFIER:
        this.nextAfterWhitespaceAfterClassOfStreamWithoutIdentifier(token)
        break
      case UnidocParserState.CLASS_OF_STREAM_WITH_IDENTIFIER:
        this.nextAfterClassOfStreamWithIdentifier(token)
        break
      case UnidocParserState.WHITESPACE_AFTER_CLASS_OF_STREAM_WITH_IDENTIFIER:
        this.nextAfterWhitespaceAfterClassOfStreamWithIdentifier(token)
        break
      default:
        this.throwUhandledParserState(token)
    }
  }

  private throwUhandledParserState(token: UnidocToken): void {
    throw new Error(
      `Unable to handle token of type ${UnidocTokenType.toDebugString(token.type)} ` +
      'because this parser does not  define an execution process when it has to ' +
      `handle a token when it is in ${UnidocParserState.toDebugString(this._states.last)} ` +
      'state.'
    )
  }

  /**
   * 
   */
  private enterState(state: UnidocParserState): void {
    this._states.set(this._states.size - 1, state)
  }

  /**
   * 
   */
  private pushState(state: UnidocParserState): void {
    this._states.push(state)
  }

  /**
   * 
   */
  private popState(): void {
    this._states.pop()
  }

  /**
  * Call when the stream of tokens reach it's end.
  */
  public success(): void {
    switch (this._states.last) {
      case UnidocParserState.START:
        this.emitVirtualDocumentStart()
        this.emitVirtualDocumentEnd()
        this._states.set(this._states.size - 1, UnidocParserState.TERMINATION)
        this.success()
        break
      case UnidocParserState.STREAM_CONTENT:
        this.emitTagEnd()
        this._states.set(this._states.size - 1, UnidocParserState.TERMINATION)
        this._path.last.origin.clear()
        this.success()
        break
      case UnidocParserState.BLOCK_CONTENT:
        // ERROR & RECOVER
        this.emitTagEnd()
        this._states.set(this._states.size - 1, UnidocParserState.TERMINATION)
        this._path.last.origin.clear()
        this.success()
        break
      case UnidocParserState.WHITESPACE:
        this.emitWhitespaceEvent()
        this._states.get(this._states.size - 2).origin.at(this._states.last.origin.to)
        this.popState()
        this.success()
        break
      case UnidocParserState.WORD:
        this.emitWordEvent()
        this._states.get(this._states.size - 2).origin.at(this._states.last.origin.to)
        this.popState()
        this.success()
        break
      case UnidocParserState.CLASS_OF_TAG_WITHOUT_IDENTIFIER:
      case UnidocParserState.CLASS_OF_TAG_WITH_IDENTIFIER:
        this.emitTagStart()
        this._states.last.origin.at(this._states.last.origin.to)
        this.emitTagEnd()
        this.popState()
        this.success()
        break
      case UnidocParserState.WHITESPACE_AFTER_CLASS_OF_TAG_WITHOUT_IDENTIFIER:
      case UnidocParserState.WHITESPACE_AFTER_CLASS_OF_TAG_WITH_IDENTIFIER:
        this.emitTagStart(this._states.get(this._states.size - 2))
        this._states.get(this._states.size - 2).origin.at(this._states.last.origin.from)
        this.emitTagEnd(this._states.get(this._states.size - 2))
        this.emitWhitespaceEvent()
        this.popState()
        this.popState()
        this.success()
        break
      case UnidocParserState.ERROR:
        this.throwUnhandledCompletionParserState()
        break
      case UnidocParserState.LEADING_WHITESPACE:
        this.emitVirtualDocumentStart()
        this.emitWhitespaceEvent()
        this.emitVirtualDocumentEnd()
        this._states.last.type = UnidocParserState.TERMINATION
        this._states.last.origin.at(this._states.last.origin.to)
        this.success()
        break
      case UnidocParserState.CLASS_OF_STREAM_WITHOUT_IDENTIFIER:
      case UnidocParserState.CLASS_OF_STREAM_WITH_IDENTIFIER:
        this.emitTagStart()
        this.emitVirtualDocumentEnd()
        this._states.last.type = UnidocParserState.TERMINATION
        this._states.last.origin.at(this._states.last.origin.to)
        this.success()
        break
      case UnidocParserState.WHITESPACE_AFTER_CLASS_OF_STREAM_WITHOUT_IDENTIFIER:
        this.emitTagStart(this._states.get(this._states.size - 2))
        this._states.get(this._states.size - 2).origin.at(this._states.last.origin.from)
        this.emitWhitespaceEvent()
        this.popState()
        this.emitVirtualDocumentEnd()
        this._states.last.type = UnidocParserState.TERMINATION
        this._states.last.origin.at(this._states.last.origin.to)
        this.success()
        break
      case UnidocParserState.TERMINATION:
        this.output.success()
        return
      default:
        this.throwUnhandledCompletionParserState()
    }
  }

  private throwUnhandledCompletionParserState(): void {
    throw new Error(
      'Unable to handle stream completion because this parser does not define ' +
      'an execution process when it has to handle a completion when it is in ' +
      UnidocParserState.toDebugString(this._states.last) + '.'
    )
  }

  /**
  * Handle the given token after start.
  *
  * @param token - A unidock token to handle.
  */
  private nextAfterStart(token: UnidocToken): void {
    this._event.origin.concat(token.origin)
    this._path.push(UnidocSection.DEFAULT)
    this._path.last.name.copy(DOCUMENT_TAG)
    this._path.last.origin.startOf(token.origin)

    switch (token.type) {
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
        this.enterState(UnidocParserState.LEADING_WHITESPACE)
        this._event.append(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.WORD:
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
        if (token.isTag(DOCUMENT_TAG)) {
          this.enterState(UnidocParserState.CLASS_OF_STREAM_WITHOUT_IDENTIFIER)
          this._path.last.origin.copy(token.origin)
        } else {
          this.emitVirtualDocumentStart()
          this.enterState(UnidocParserState.STREAM_CONTENT)
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
        this._event.append(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.WORD:
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
        if (token.isTag(DOCUMENT_TAG)) {
          this.enterState(UnidocParserState.CLASS_OF_STREAM_WITHOUT_IDENTIFIER)
          this._event.origin.copy(token.origin)
          this._event.symbols.copy(DOCUMENT_TAG)
        } else {
          this.emitVirtualDocumentStart()
          this.emitWhitespaceEvent()
          this.enterState(UnidocParserState.STREAM_CONTENT)
          this._event.origin.concat(token.origin)
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
        this.pushState(UnidocParserState.WHITESPACE_AFTER_CLASS_OF_STREAM_WITHOUT_IDENTIFIER)
        this._event.append(token)
        return
      case UnidocTokenType.IDENTIFIER:
        this._event.append(token)
        this.enterState(UnidocParserState.CLASS_OF_STREAM_WITH_IDENTIFIER)
        return
      case UnidocTokenType.CLASS:
        this._event.append(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.BLOCK_END:
        this.emitTagStart()
        this.enterState(UnidocParserState.STREAM_CONTENT)
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
        this._event.append(token)
        return
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
        this.popState()
        this.next(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.BLOCK_END:
        this.emitTagStart(this._states.get(this._states.size - 2))
        this.emitWhitespaceEvent()
        this.popState()
        this.enterState(UnidocParserState.STREAM_CONTENT)
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
        this.pushState(UnidocParserState.WHITESPACE_AFTER_CLASS_OF_STREAM_WITH_IDENTIFIER)
        this._event.append(token)
        return
      case UnidocTokenType.CLASS:
        this._event.append(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.BLOCK_END:
      case UnidocTokenType.IDENTIFIER:
        this.emitTagStart()
        this.enterState(UnidocParserState.STREAM_CONTENT)
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
        this._event.append(token)
        return
      case UnidocTokenType.CLASS:
        this.popState()
        this.next(token)
        return
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_START:
      case UnidocTokenType.BLOCK_END:
        this.emitTagStart() // @todo recheck why zero
        this.emitWhitespaceEvent()
        this.popState()
        this.enterState(UnidocParserState.STREAM_CONTENT)
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
        this._event.append(token)
        this.emitTagEnd()
        this.popState()
        break
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private nextAfterContent(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.TAG:
        this.pushState(UnidocParserState.CLASS_OF_TAG_WITHOUT_IDENTIFIER)
        this._event.append(token)
        break
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
        this.pushState(UnidocParserState.WHITESPACE)
        this._event.append(token)
        break
      case UnidocTokenType.WORD:
        this.pushState(UnidocParserState.WORD)
        this._event.append(token)
        break
      case UnidocTokenType.IDENTIFIER:
        this.pushState(UnidocParserState.CLASS_OF_TAG_WITH_IDENTIFIER)
        this._event.append(token)
        this._event.symbols.copy(BLOCK_TAG)
        break
      case UnidocTokenType.CLASS:
        this.pushState(UnidocParserState.CLASS_OF_TAG_WITHOUT_IDENTIFIER)
        this._event.append(token)
        this._event.symbols.copy(BLOCK_TAG)
        break
      case UnidocTokenType.BLOCK_START:
        this.pushState(UnidocParserState.BLOCK_CONTENT)
        this._event.append(token)
        this._event.symbols.copy(BLOCK_TAG)
        this.emitTagStart()
        break
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private nextAfterWhitespace(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._event.append(token)
        return
      default:
        this.emitWhitespaceEvent()
        this.popState()
        this.next(token)
        return
    }
  }

  private nextAfterWord(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.WORD:
        this._event.append(token)
        return
      default:
        this.emitWordEvent()
        this.popState()
        this.next(token)
        return
    }
  }

  private nextAfterClassOfTagWithoutIdentifier(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this.pushState(UnidocParserState.WHITESPACE_AFTER_CLASS_OF_TAG_WITHOUT_IDENTIFIER)
        this._event.append(token)
        return
      case UnidocTokenType.IDENTIFIER:
        this._event.append(token)
        this.enterState(UnidocParserState.CLASS_OF_TAG_WITH_IDENTIFIER)
        return
      case UnidocTokenType.CLASS:
        this._event.append(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_END:
        this.emitTagStart()
        this.emitTagEnd()
        this.popState()
        this.next(token)
        return
      case UnidocTokenType.BLOCK_START:
        this._event.append(token)
        this.emitTagStart()
        this.enterState(UnidocParserState.BLOCK_CONTENT)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private nextAfterWhitespaceAfterClassOfTagWithoutIdentifier(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._event.append(token)
        return
      case UnidocTokenType.IDENTIFIER:
      case UnidocTokenType.CLASS:
      case UnidocTokenType.BLOCK_START:
        this.popState()
        this.next(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_END:
        this.emitTagStart(this._states.get(this._states.size - 2))
        this._states.get(this._states.size - 2).origin.at(this._states.last.origin.from)
        this.emitTagEnd(this._states.get(this._states.size - 2))
        this.emitWhitespaceEvent()
        this.popState()
        this.popState()
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
        this.pushState(UnidocParserState.WHITESPACE_AFTER_CLASS_OF_TAG_WITH_IDENTIFIER)
        this._event.append(token)
        return
      case UnidocTokenType.CLASS:
        this._event.append(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_END:
      case UnidocTokenType.IDENTIFIER:
        this.emitTagStart()
        this.emitTagEnd()

        this.popState()
        this.next(token)
        return
      case UnidocTokenType.BLOCK_START:
        this._event.append(token)
        this.emitTagStart()
        this.enterState(UnidocParserState.BLOCK_CONTENT)
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private nextAfterWhitespaceAfterClassOfTagWithIdentifier(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
        this._event.append(token)
        return
      case UnidocTokenType.CLASS:
      case UnidocTokenType.BLOCK_START:
        this.popState()
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
        this.popState()
        this.popState()
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
      `The token type ${UnidocTokenType.toDebugString(token.type)} is currently not handled ` +
      `by this parser when it is in state ${UnidocParserState.toDebugString(this._states.last)}.`
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
    this.pushState(UnidocParserState.START)
    this._event.clear()
  }
}

