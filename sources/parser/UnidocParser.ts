import { UnidocToken } from '../token/UnidocToken'
import { UnidocTokenType } from '../token/UnidocTokenType'

import { UnidocEvent } from '../event/UnidocEvent'
import { UnidocEventType } from '../event/UnidocEventType'

import { UnidocEventProducer } from '../event/UnidocEventProducer'

import { UnidocProducer } from '../producer/UnidocProducer'
import { UnidocProducerEvent } from '../producer/UnidocProducerEvent'

import { SubscribableUnidocConsumer } from '../consumer/SubscribableUnidocConsumer'

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
export class UnidocParser
  extends SubscribableUnidocConsumer<UnidocToken>
  implements UnidocProducer<UnidocEvent>
{
  /**
  * Inner state of the parser.
  */
  private _states: UnidocParserStateBuffer

  /**
  * Unidoc event instance for publication.
  */
  private _producer: UnidocEventProducer

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
    this._producer = new UnidocEventProducer()

    //this._validation = new UnidocValidation()

    this._states.push(UnidocParserStateType.START)
  }

  /**
  * @see UnidocConsumer.handleInitialization
  */
  public handleInitialization(): void {

  }

  /**
  * @see UnidocConsumer.handleProduction
  */
  public handleProduction(value: UnidocToken): void {
    this.next(value)
  }

  /**
  * @see UnidocConsumer.handleCompletion
  */
  public handleCompletion(): void {
    this.complete()
  }

  /**
  * @see UnidocConsumer.handleFailure
  */
  public handleFailure(error: Error): void {
    this._producer.fail(error)
  }

  /**
  * Feed this parser with the given token.
  *
  * @param token - The token to give to the parser.
  */
  public next(token: UnidocToken): void {
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
  public complete(): void {
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
        this._states.last.origin.at(this._states.last.origin.to)
        this.complete()
        break
      case UnidocParserStateType.BLOCK_CONTENT:
        // ERROR & RECOVER
        this.emitTagEnd()
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.origin.at(this._states.last.origin.to)
        this.complete()
        break
      case UnidocParserStateType.WHITESPACE:
        this.emitWhitespaceEvent()
        this._states.get(this._states.size - 2).origin.at(this._states.last.origin.to)
        this._states.pop()
        this.complete()
        break
      case UnidocParserStateType.WORD:
        this.emitWordEvent()
        this._states.get(this._states.size - 2).origin.at(this._states.last.origin.to)
        this._states.pop()
        this.complete()
        break
      case UnidocParserStateType.CLASS_OF_TAG_WITHOUT_IDENTIFIER:
      case UnidocParserStateType.CLASS_OF_TAG_WITH_IDENTIFIER:
        this.emitTagStart()
        this._states.last.origin.at(this._states.last.origin.to)
        this.emitTagEnd()
        this._states.pop()
        this.complete()
        break
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_TAG_WITHOUT_IDENTIFIER:
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_TAG_WITH_IDENTIFIER:
        this.emitTagStart(this._states.get(this._states.size - 2))
        this._states.get(this._states.size - 2).origin.at(this._states.last.origin.from)
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
        this._states.last.origin.at(this._states.last.origin.to)
        this.complete()
        break
      case UnidocParserStateType.CLASS_OF_STREAM_WITHOUT_IDENTIFIER:
      case UnidocParserStateType.CLASS_OF_STREAM_WITH_IDENTIFIER:
        this.emitTagStart()
        this.emitVirtualDocumentEnd()
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.origin.at(this._states.last.origin.to)
        this.complete()
        break
      case UnidocParserStateType.WHITESPACE_AFTER_CLASS_OF_STREAM_WITHOUT_IDENTIFIER:
        this.emitTagStart(this._states.get(this._states.size - 2))
        this._states.get(this._states.size - 2).origin.at(this._states.last.origin.from)
        this.emitWhitespaceEvent()
        this._states.pop()
        this.emitVirtualDocumentEnd()
        this._states.last.type = UnidocParserStateType.TERMINATION
        this._states.last.origin.at(this._states.last.origin.to)
        this.complete()
        break
      case UnidocParserStateType.TERMINATION:
        this._producer.complete()
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
  private handleAfterStart(token: UnidocToken): void {
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

  private handleAfterLeadingWhitespace(token: UnidocToken): void {
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

  private handleAfterClassOfStreamWithoutIdentifier(token: UnidocToken): void {
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

  private handleAfterWhitespaceAfterClassOfStreamWithoutIdentifier(token: UnidocToken): void {
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

  private handleAfterClassOfStreamWithIdentifier(token: UnidocToken): void {
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

  private handleAfterWhitespaceAfterClassOfStreamWithIdentifier(token: UnidocToken): void {
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

  private handleAfterStreamContent(token: UnidocToken): void {
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

  private handleAfterBlockContent(token: UnidocToken): void {
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
        this._states.last.origin.at(token.origin.to)
        break
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  private handleAfterContent(token: UnidocToken): void {
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

  private handleAfterWhitespace(token: UnidocToken): void {
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

  private handleAfterWord(token: UnidocToken): void {
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

  private handleAfterClassOfTagWithoutIdentifier(token: UnidocToken): void {
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

  private handleAfterWhitespaceAfterClassOfTagWithoutIdentifier(token: UnidocToken): void {
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

  private handleAfterClassOfTagWithIdentifier(token: UnidocToken): void {
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

  private handleAfterWhitespaceAfterClassOfTagWithIdentifier(token: UnidocToken): void {
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
  private handleAfterError(token: UnidocToken): void {
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
    this._producer.initialize()

    this._producer
      .event()
      .at(state.origin.from)
      .withType(UnidocEventType.START_TAG)
      .withTag(DOCUMENT_TAG)
      .produce()
  }

  private emitVirtualDocumentEnd(state: UnidocParserState = this._states.last) {
    this._producer.initialize()

    this._producer
      .event()
      .at(state.origin.to)
      .withType(UnidocEventType.END_TAG)
      .withTag(DOCUMENT_TAG)
      .produce()
  }

  private emitTagStart(state: UnidocParserState = this._states.last): void {
    this._producer.initialize()

    this._producer
      .event()
      .from(state.origin.from)
      .to(state.origin.to)
      .withType(UnidocEventType.START_TAG)
      .withClasses(state.classes)
      .withIdentifier(state.identifier)
      .withTag(state.tag)
      .produce()
  }

  /**
  * Emit a unidoc tag termination event.
  */
  private emitTagEnd(state: UnidocParserState = this._states.last): void {
    this._producer.initialize()

    this._producer
      .event()
      .from(state.origin.from)
      .to(state.origin.to)
      .withType(UnidocEventType.END_TAG)
      .withClasses(state.classes)
      .withIdentifier(state.identifier)
      .withTag(state.tag)
      .produce()
  }

  /**
  * Emit a unidoc whitespace event.
  */
  private emitWhitespaceEvent(state: UnidocParserState = this._states.last): void {
    this._producer.initialize()

    this._producer
      .event()
      .from(state.origin.from)
      .to(state.origin.to)
      .withType(UnidocEventType.WHITESPACE)
      .withSymbols(state.content)
      .produce()
  }

  /**
  * Emit a unidoc word event.
  */
  private emitWordEvent(state: UnidocParserState = this._states.last): void {
    this._producer.initialize()

    this._producer
      .event()
      .from(state.origin.from)
      .to(state.origin.to)
      .withType(UnidocEventType.WORD)
      .withSymbols(state.content)
      .produce()
  }

  /**
  * Reset this parser in order to reuse-it.
  */
  public clear(): void {
    this._states.clear()
    this.removeAllEventListener()
    this._states.push(UnidocParserStateType.START)
    this._producer.clear()
  }

  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent.ProductionEvent, listener: UnidocProducer.ProductionListener<UnidocEvent>): void
  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent.CompletionEvent, listener: UnidocProducer.CompletionListener): void
  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent.InitializationEvent, listener: UnidocProducer.InitializationListener): void
  /**
  * @see UnidocProducer.addEventListener
  */
  public addEventListener(event: UnidocProducerEvent.FailureEvent, listener: UnidocProducer.FailureListener): void
  public addEventListener(event: UnidocProducerEvent, listener: any) {
    this._producer.addEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent.ProductionEvent, listener: UnidocProducer.ProductionListener<UnidocEvent>): void
  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent.CompletionEvent, listener: UnidocProducer.CompletionListener): void
  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent.InitializationEvent, listener: UnidocProducer.InitializationListener): void
  /**
  * @see UnidocProducer.removeEventListener
  */
  public removeEventListener(event: UnidocProducerEvent.FailureEvent, listener: UnidocProducer.FailureListener): void
  public removeEventListener(event: UnidocProducerEvent, listener: any) {
    this._producer.removeEventListener(event, listener)
  }

  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(event: UnidocProducerEvent): void
  /**
  * @see UnidocProducer.removeAllEventListener
  */
  public removeAllEventListener(): void
  public removeAllEventListener(...parameters: [any?]) {
    this._producer.removeAllEventListener(...parameters)
  }
}

export namespace UnidocParser {
}
