import { UnidocEvent } from './event/UnidocEvent'
import { UnidocLexer } from './lexer/UnidocLexer'
import { UnidocParser } from './parser/UnidocParser'
import { UnidocAutoCloser } from './postprocess/UnidocAutoCloser'
import { UnidocAutoWrapper } from './postprocess/UnidocAutoWrapper'
import { UnidocFunction, UnidocPipe } from './stream'
import { UnidocSymbol } from './symbol/UnidocSymbol'
import { UnidocSymbols } from './symbol/UnidocSymbols'

/**
 * 
 */
export namespace Unidoc {
  /**
   * 
   */
  export const lexer = UnidocLexer.create

  /**
   * 
   */
  export const lex = UnidocLexer.lex

  /**
   * 
   */
  export const parser = UnidocParser.create

  /**
   * 
   */
  export const parse = UnidocParser.parse

  /**
   * 
   */
  export namespace iterate {
    /**
     * 
     */
    export function symbols(symbols: Iterator<UnidocSymbol>): IterableIterator<UnidocEvent> {
      return UnidocFunction.iterateClonable(
        symbols,
        UnidocPipe.of(Unidoc.lexer(), Unidoc.parser())
      )
    }

    /**
     * 
     */
    export function text(...text: string[]): IterableIterator<UnidocEvent> {
      return UnidocFunction.iterateClonable(
        UnidocSymbols.fromString(text.join('\r\n')),
        UnidocPipe.of(Unidoc.lexer(), Unidoc.parser())
      )
    }
  }

  /**
   * 
   */
  export namespace PostProcess {
    /**
     * 
     */
    export const close = UnidocAutoCloser.apply

    /**
     * 
     */
    export const wrap = UnidocAutoWrapper.apply
  }
}