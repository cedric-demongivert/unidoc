import { UnidocProducer } from './stream/UnidocProducer'
import { UnidocSymbol } from './symbol/UnidocSymbol'
import { UnidocToken } from './token/UnidocToken'
import { UnidocLexer } from './lexer/UnidocLexer'

/**
* Transform a producer of symbols into a producer of tokens.
*
* @param input - A producer of symbols.
*
* @return A producer of tokens.
*/
export function tokenize(input: UnidocProducer<UnidocSymbol>): UnidocProducer<UnidocToken> {
  const lexer: UnidocLexer = new UnidocLexer()

  lexer.subscribe(input)

  return lexer
}
