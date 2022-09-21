import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocToken } from '../token/UnidocToken'
import { UnidocTokenType } from '../token/UnidocTokenType'

import { UnidocEvent } from '../event/UnidocEvent'

import { UnidocFunction } from '../stream/UnidocFunction'
import { UnidocSink } from '../stream/UnidocSink'

import { UnidocParserState } from './UnidocParserState'
import { UnidocPath, UnidocSection } from '../origin'
import { UTF32String } from '../symbol'
import { UnidocEventType } from '../event/UnidocEventType'

/**
 * 
 */
const BLOCK_TAG: UTF32String = UTF32String.fromString('block')

/**
 * A unidoc token stream parser.
 */
export class UnidocParser extends UnidocFunction<UnidocToken, UnidocEvent>
{
  /**
   * Inner state of the parser.
   */
  private _state: UnidocParserState

  /**
   * 
   */
  private readonly _path: UnidocPath

  /**
   * Unidoc event instance for publication.
   */
  private readonly _event: UnidocEvent

  /**
   * 
   */
  private readonly _tokens: Pack<UnidocToken>

  /**
   * 
   */
  private _first: boolean

  /**
   * 
   */
  public constructor(capacity: number = 32) {
    super()

    this._state = UnidocParserState.BLOCK_CONTENT
    this._event = new UnidocEvent()
    this._path = this._event.path
    this._tokens = Pack.instance(UnidocToken.ALLOCATOR, capacity)
    this._first = true
  }

  /**
   * @see UnidocConsumer.prototype.start
   */
  public start(): void {

  }

  /**
   * @see UnidocConsumer.prototype.failure
   */
  public failure(error: Error): void {
    this.output.failure(error)
  }

  /**
  * Feed this parser with the given token.
  *
  * @param token - The token to give to the parser.
  */
  public next(token: UnidocToken): void {
    switch (this._state) {
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
      case UnidocParserState.CLASS_OF_TAG_WITH_IDENTIFIER:
        this.nextAfterClassOfTagWithIdentifier(token)
        break
      case UnidocParserState.ERROR:
        this.nextAfterError(token)
        break
      default:
        this.throwUhandledParserState(token)
    }
  }

  /**
   * 
   */
  private throwUhandledParserState(token: UnidocToken): void {
    throw new Error(
      `Unable to handle token of type ${UnidocTokenType.toDebugString(token.type)} ` +
      'because this parser does not  define an execution process when it has to ' +
      `handle a token when it is in ${UnidocParserState.toDebugString(this._state)} ` +
      'state.'
    )
  }

  /**
   * @see UnidocConsumer.prototype.success
   */
  public success(): void {
    switch (this._state) {
      case UnidocParserState.BLOCK_CONTENT:
        this._state = UnidocParserState.TERMINATION
        this.success()
        break
      case UnidocParserState.WHITESPACE:
        this.emitWhitespace()
        this._state = UnidocParserState.TERMINATION
        this.success()
        break
      case UnidocParserState.WORD:
        this.emitWordEvent()
        this._state = UnidocParserState.TERMINATION
        this.success()
        break
      case UnidocParserState.CLASS_OF_TAG_WITHOUT_IDENTIFIER:
      case UnidocParserState.CLASS_OF_TAG_WITH_IDENTIFIER:
        this.emitLonelyTag()
        this._state = UnidocParserState.TERMINATION
        this.success()
        break
      case UnidocParserState.ERROR:
        this.throwUnhandledCompletionParserState()
        break
      case UnidocParserState.TERMINATION:
        this.output.success()
        return
      default:
        this.throwUnhandledCompletionParserState()
    }
  }

  /**
   * 
   */
  private throwUnhandledCompletionParserState(): void {
    throw new Error(
      'Unable to handle stream completion because this parser does not define ' +
      'an execution process when it has to handle a completion when it is in ' +
      UnidocParserState.toDebugString(this._state) + '.'
    )
  }

  /**
   * 
   */
  private nextAfterBlockContent(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.TAG:
        this._tokens.push(token)
        this._state = UnidocParserState.CLASS_OF_TAG_WITHOUT_IDENTIFIER
        break
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.SPACE:
        this._tokens.push(token)
        this._state = UnidocParserState.WHITESPACE
        break
      case UnidocTokenType.WORD:
        this._tokens.push(token)
        this._state = UnidocParserState.WORD
        break
      case UnidocTokenType.IDENTIFIER:
        this._tokens.push(token)
        this._state = UnidocParserState.CLASS_OF_TAG_WITH_IDENTIFIER
        break
      case UnidocTokenType.CLASS:
        this._tokens.push(token)
        this._state = UnidocParserState.CLASS_OF_TAG_WITHOUT_IDENTIFIER
        break
      case UnidocTokenType.BLOCK_START:
        this._tokens.push(token)
        this._state = UnidocParserState.BLOCK_CONTENT
        this.emitTagStart()
        break
      case UnidocTokenType.BLOCK_END:
        this._tokens.push(token)
        this.emitTagEnd()
        this._state = UnidocParserState.BLOCK_CONTENT
        break
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  /**
   * 
   */
  private nextAfterWhitespace(token: UnidocToken): void {
    if (token.type === UnidocTokenType.SPACE || token.type === UnidocTokenType.NEW_LINE) {
      this._tokens.push(token)
    } else {
      this.emitWhitespace()
      this._state = UnidocParserState.BLOCK_CONTENT
      this.next(token)
    }
  }

  /**
   * 
   */
  private nextAfterWord(token: UnidocToken): void {
    if (token.type === UnidocTokenType.WORD) {
      this._tokens.push(token)
    } else {
      this.emitWordEvent()
      this._state = UnidocParserState.BLOCK_CONTENT
      this.next(token)
    }
  }

  /**
   * 
   */
  private nextAfterClassOfTagWithoutIdentifier(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.CLASS:
        this._tokens.push(token)
        return
      case UnidocTokenType.IDENTIFIER:
        this._state = UnidocParserState.CLASS_OF_TAG_WITH_IDENTIFIER
        this._tokens.push(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_END:
        this.emitLonelyTag()
        this._state = UnidocParserState.BLOCK_CONTENT
        this.next(token)
        return
      case UnidocTokenType.BLOCK_START:
        this._tokens.push(token)
        this.emitTagStart()
        this._state = UnidocParserState.BLOCK_CONTENT
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  /**
   * 
   */
  private nextAfterClassOfTagWithIdentifier(token: UnidocToken): void {
    switch (token.type) {
      case UnidocTokenType.SPACE:
      case UnidocTokenType.NEW_LINE:
      case UnidocTokenType.CLASS:
        this._tokens.push(token)
        return
      case UnidocTokenType.TAG:
      case UnidocTokenType.WORD:
      case UnidocTokenType.BLOCK_END:
      case UnidocTokenType.IDENTIFIER:
        this.emitLonelyTag()
        this._state = UnidocParserState.BLOCK_CONTENT
        this.next(token)
        return
      case UnidocTokenType.BLOCK_START:
        this._tokens.push(token)
        this.emitTagStart()
        this._state = UnidocParserState.BLOCK_CONTENT
        return
      default:
        this.throwUnhandledTokenType(token)
    }
  }

  /**
   * 
   */
  private nextAfterError(token: UnidocToken): void {
    this.throwUnhandledTokenType(token)
  }

  /**
   * 
   */
  private throwUnhandledTokenType(token: UnidocToken): void {
    throw new Error(
      `The token type ${UnidocTokenType.toDebugString(token.type)} is currently not handled ` +
      `by this parser when it is in state ${UnidocParserState.toDebugString(this._state)}.`
    )
  }

  /**
   * 
   */
  private emitLonelyTag(): void {
    const tokens: Pack<UnidocToken> = this._tokens
    const tokensSize: number = tokens.size

    let index = 0

    while (index < tokensSize && !tokens.get(index).isAnyTag()) ++index

    if (index === tokensSize) {
      this.dumpInvalidTagConfiguration()
      return
    }

    const event: UnidocEvent = this._event
    const path: UnidocPath = this._path

    this.emitTagStart()

    event.origin.reduceToEnd()
    event.type = UnidocEventType.END_TAG
    path.delete(path.size - 1)

    this.emit(event)

    if (this._tokens.size > 0) this.emitWhitespace()
  }

  /**
   * 
   */
  private dumpInvalidTagConfiguration(): void {
    const event: UnidocEvent = this._event
    const tokens: Pack<UnidocToken> = this._tokens
    const tokensSize: number = tokens.size

    event.type = tokens.first.isWhitespace() ? UnidocEventType.WHITESPACE : UnidocEventType.WORD
    event.symbols.clear()
    event.classes.clear()
    event.identifier.clear()
    event.origin.clear()

    for (let index = 0; index < tokensSize; ++index) {
      const token: UnidocToken = tokens.get(index)

      switch (event.type) {
        case UnidocEventType.WHITESPACE:
          if (token.isWhitespace()) {
            event.origin.concat(token.origin)
            event.symbols.concat(token.symbols)
          } else {
            this.emit(event)
            event.symbols.copy(token.symbols)
            event.origin.copy(token.origin)
            event.type = UnidocEventType.WORD
          }
          break
        default:
          if (token.isWhitespace()) {
            this.emit(event)
            event.symbols.copy(token.symbols)
            event.origin.copy(token.origin)
            event.type = UnidocEventType.WHITESPACE
          } else {
            event.origin.concat(token.origin)
            event.symbols.concat(token.symbols)
          }
          break
      }
    }

    tokens.clear()

    this.emit(event)
  }

  /**
   * 
   */
  private emitTagStart(): void {
    const event: UnidocEvent = this._event
    const tokens: Pack<UnidocToken> = this._tokens
    const tokensSize: number = tokens.size

    event.type = UnidocEventType.START_TAG
    event.symbols.copy(BLOCK_TAG)
    event.classes.clear()
    event.identifier.clear()
    event.origin.clear()

    let trailingWhitespaces: number = 0

    while (trailingWhitespaces < tokensSize && tokens.get(tokensSize - trailingWhitespaces - 1).isWhitespace()) {
      trailingWhitespaces += 1
    }

    for (let index = 0, until = tokensSize - trailingWhitespaces; index < until; ++index) {
      const token: UnidocToken = tokens.get(index)
      event.origin.concat(token.origin)

      switch (token.type) {
        case UnidocTokenType.TAG:
          event.symbols.subCopy(token.symbols, 1)
          break
        case UnidocTokenType.CLASS:
          event.classes.add(token.symbols, 1)
          break
        case UnidocTokenType.IDENTIFIER:
          event.identifier.subCopy(token.symbols, 1)
          break
      }
    }

    tokens.deleteMany(0, tokens.size - trailingWhitespaces)

    this.emit(event)

    const path: UnidocPath = this._path
    path.push(UnidocSection.DEFAULT)

    const section: UnidocSection = path.last
    section.name.copy(event.symbols)
    section.classes.copy(event.classes)
    section.identifier.copy(event.identifier)
    section.origin.copy(event.origin)
  }

  /**
  * Emit a unidoc tag termination event.
  */
  private emitTagEnd(): void {
    const event: UnidocEvent = this._event
    const path: UnidocPath = this._path
    const section: UnidocSection = path.last
    const tokens: Pack<UnidocToken> = this._tokens

    event.type = UnidocEventType.END_TAG
    event.symbols.copy(section.name)
    event.classes.copy(section.classes)
    event.identifier.copy(section.identifier)
    event.origin.copy(tokens.first.origin)

    tokens.clear()
    path.delete(path.size - 1)

    this.emit(event)
  }

  /**
   * 
   */
  private emitWhitespace(): void {
    const event: UnidocEvent = this._event
    const tokens: Pack<UnidocToken> = this._tokens

    event.type = UnidocEventType.WHITESPACE
    event.symbols.clear()
    event.classes.clear()
    event.identifier.clear()
    event.origin.clear()

    for (let index = 0; index < tokens.size; ++index) {
      const token: UnidocToken = tokens.get(index)
      event.symbols.concat(token.symbols)
      event.origin.concat(token.origin)
    }

    tokens.clear()

    this.emit(event)
  }

  /**
   * 
   */
  private emitWordEvent(): void {
    const event: UnidocEvent = this._event
    const tokens: Pack<UnidocToken> = this._tokens

    event.type = UnidocEventType.WORD
    event.symbols.clear()
    event.classes.clear()
    event.identifier.clear()
    event.origin.clear()

    for (let index = 0; index < tokens.size; ++index) {
      const token: UnidocToken = tokens.get(index)
      event.symbols.concat(token.symbols)
      event.origin.concat(token.origin)
    }

    tokens.clear()

    this.emit(event)
  }

  /**
   * 
   */
  private emit(event: UnidocEvent): void {
    const output: UnidocSink<UnidocEvent> = this.output

    if (this._first) {
      output.start()
      this._first = false
    }

    output.next(event)
  }

  /**
  * Reset this parser in order to reuse-it.
  */
  public clear(): void {
    this.off()

    this._state = UnidocParserState.BLOCK_CONTENT
    this._path.clear()
    this._event.clear()
    this._tokens.clear()
    this._first = true
  }
}

/**
 * 
 */
export namespace UnidocParser {

}

