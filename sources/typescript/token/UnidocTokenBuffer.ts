import { Subscriber } from 'rxjs'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocLexer } from '../lexer/UnidocLexer'
import { UnidocLocation } from '../UnidocLocation'
import { UnidocToken } from './UnidocToken'

export class UnidocTokenBuffer {
  public readonly subscriber : Subscriber<UnidocToken>

  public readonly tokens : Pack<UnidocToken>
  public readonly errors : Pack<any>
  public completed : boolean

  public constructor () {
    this.tokens = Pack.any(32)
    this.errors = Pack.any(32)
    this.completed = false

    this.handleNextToken = this.handleNextToken.bind(this)
    this.handleNextError = this.handleNextError.bind(this)
    this.handleCompletion  = this.handleCompletion.bind(this)

    this.subscriber = Subscriber.create(
      this.handleNextToken,
      this.handleNextError,
      this.handleCompletion
    )
  }

  public handleNextToken (token : UnidocToken) : void {
    this.tokens.push(token.clone())
  }

  public handleNextError (error : any) : void {
    this.errors.push(error)
  }

  public handleCompletion () : void {
    this.completed = true
  }

  public clear () : void {
    this.tokens.clear()
    this.errors.clear()
    this.completed = false
  }
}

export namespace UnidocTokenBuffer {
  export function fromLexer (lexer : UnidocLexer) : UnidocTokenBuffer {
    const result : UnidocTokenBuffer = new UnidocTokenBuffer()

    lexer.addEventListener(result.subscriber)

    return result
  }
}
