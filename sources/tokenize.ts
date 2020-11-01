import { Observable } from 'rxjs'
import { Operator } from 'rxjs'

import { UnidocSymbol } from './symbol/UnidocSymbol'

import { UnidocLexer } from './lexer/UnidocLexer'
import { UnidocToken } from './token/UnidocToken'
import { RxJSUnidocInput } from './producer/RxJSUnidocInput'
import { RxJSUnidocOutput } from './consumer/RxJSUnidocOutput'

/**
* Transform a stream of symbols to a stream of tokens.
*
* @return An operator that transform a stream of symbols to a stream of tokens.
*/
export function tokenize(): Operator<UnidocSymbol, UnidocToken> {
  return function(input: Observable<UnidocSymbol>): Observable<UnidocToken> {
    const lexer: UnidocLexer = new UnidocLexer()
    lexer.subscribe(new RxJSUnidocInput(input))

    const rxOutput: RxJSUnidocOutput<UnidocToken> = new RxJSUnidocOutput()
    rxOutput.subscribe(lexer)

    return rxOutput.observable
  }
}
