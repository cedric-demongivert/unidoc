import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocLocation } from '../UnidocLocation'
import { UnidocLexer } from '../lexer/UnidocLexer'
import { UnidocToken } from './UnidocToken'

export class UnidocTokenBuffer {
  public readonly tokens : Pack<UnidocToken>
  public completed : boolean

  /**
  * Instantiate a new empty token buffer with the given capacity.
  *
  * @param [capacity = 32] - Capacity of the buffer to instantiate.
  */
  public constructor (capacity : number = 32) {
    this.tokens    = Pack.any(capacity)
    this.completed = false

    this.handleNextToken = this.handleNextToken.bind(this)
    this.handleCompletion  = this.handleCompletion.bind(this)
  }

  /**
  * @return The starting location of this buffer.
  */
  public get from () : UnidocLocation {
    return this.tokens.size === 0 ? UnidocLocation.ZERO : this.tokens.last.from
  }

  /**
  * @return The ending location of this buffer.
  */
  public get to () : UnidocLocation {
    return this.tokens.size === 0 ? UnidocLocation.ZERO : this.tokens.last.to
  }

  /**
  * Append an identifier token at the end of this buffer.
  *
  * @param value - Code points of the token to append.
  */
  public identifier (value : string) : void {
    this.tokens.push(UnidocToken.identifier(this.to, value))
  }

  /**
  * Append a class token at the end of this buffer.
  *
  * @param value - Code points of the token to append.
  */
  public clazz (value : string) : void {
    this.tokens.push(UnidocToken.clazz(this.to, value))
  }

  /**
  * Append a tag token at the end of this buffer.
  *
  * @param value - Code points of the token to append.
  */
  public tag (value : string) : void {
    this.tokens.push(UnidocToken.tag(this.to, value))
  }

  /**
  * Append a block start token at the end of this buffer.
  */
  public blockStart () : void {
    this.tokens.push(UnidocToken.blockStart(this.to))
  }

  /**
  * Append a block end token at the end of this buffer.
  */
  public blockEnd () : void  {
    this.tokens.push(UnidocToken.blockEnd(this.to))
  }

  /**
  * Append a space token at the end of this buffer.
  *
  * @param value - Code points of the token to append.
  */
  public space (value : string) : void {
    this.tokens.push(UnidocToken.space(this.to, value))
  }

  /**
  * Append a newline token at the end of this buffer.
  *
  * @param type - Type of newline token to add.
  */
  public newline (type : '\r\n' | '\r' | '\n' = '\r\n') : void {
    this.tokens.push(UnidocToken.newline(this.to, type))
  }

  /**
  * Append a word token at the end of this buffer.
  *
  * @param value - Code points of the token to append.
  */
  public word (value : string) : void {
    this.tokens.push(UnidocToken.word(this.to, value))
  }

  /**
  * Handle the emission of the given token.
  *
  * @param token - The token that was emitted.
  */
  public handleNextToken (token : UnidocToken) : void {
    this.tokens.push(token.clone())
  }

  /**
  * Handle the emission of the a completion event.
  */
  public handleCompletion () : void {
    this.completed = true
  }

  /**
  * Listen to the given lexer.
  *
  * @param lexer - A lexer to listen to.
  */
  public listen (lexer : UnidocLexer) : void {
    lexer.addEventListener('token', this.handleNextToken)
    lexer.addEventListener('completion', this.handleCompletion)
  }

  /**
  * Reset this token buffer.
  */
  public clear () : void {
    this.tokens.clear()
    this.completed = false
  }

  public assert (other : UnidocTokenBuffer) : void {
    if (other.completed !== this.completed) {
      throw new Error(
        'Buffers ' + this.toString() + ' and ' + other.toString() + ' are ' +
        'not equals because one is marked as completed and the other not.'
      )
    }

    if (other.tokens.size !== this.tokens.size) {
      throw new Error(
        'Buffers ' + this.toString() + ' and ' + other.toString() + ' are ' +
        'not equals because thay contains a different amount of tokens ' +
        this.tokens.size + ' !== ' + other.tokens.size + '.'
      )
    }

    for (let index = 0, size = this.tokens.size; index < size; ++index) {
      if (!other.tokens.get(index).equals(this.tokens.get(index))) {
        throw new Error(
          'Buffers ' + this.toString() + ' and ' + other.toString() + ' are ' +
          'not equals because their #' + index + ' token are not equal ' +
          this.tokens.get(index).toString() + ' !== ' +
          other.tokens.get(index).toString() + '.'
        )
      }
    }
  }

  /**
  * @see Object.equals
  */
  public equals (other : any) : boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UnidocTokenBuffer) {
      if (other.completed !== this.completed) return false
      if (other.tokens.size !== this.tokens.size) return false

      for (let index = 0, size = this.tokens.size; index < size; ++index) {
        if (!other.tokens.get(index).equals(this.tokens.get(index))) {
          return false
        }
      }

      return true
    }

    return false
  }
}

export namespace UnidocTokenBuffer {
}
