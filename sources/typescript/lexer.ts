import { Lexer } from 'antlr4ts/Lexer'

import { UnidocLexer } from '@grammar/UnidocLexer'
import { EmptyCharStream } from '@library/antlr/EmptyCharStream'

/**
* Instanciate a unidoc lexer.
*
* @return A new unidoc lexer.
*/
export function lexer () : Lexer {
  return new UnidocLexer(new EmptyCharStream())
}
