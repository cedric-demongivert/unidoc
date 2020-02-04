import { ANTLRInputStream } from 'antlr4ts'
import { CharStream } from 'antlr4ts'
import { CommonTokenStream } from 'antlr4ts'
import { TokenStream } from 'antlr4ts'

import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'
import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener'

import { UnidocLexer } from '../generated/UnidocLexer'
import { UnidocParser } from '../generated/UnidocParser'

import { EmptyCharStream } from './common/EmptyCharStream'
import { Validator } from './validation/Validator'
import { Validation } from './validation/Validation'

/**
* A complete unidoc parsing pipeline.
*/
export class Source {
  /**
  * Stream of symbols to parse.
  */
  private _symbolStream : CharStream

  /**
  * Stream of tokens to parse.
  */
  private _tokenStream : TokenStream

  /**
  * Unidoc lexer.
  */
  private _lexer : UnidocLexer

  /**
  * Unidoc parser.
  */
  private _parser : UnidocParser

  /**
  * Instanciate a new empty parsing pipeline.
  */
  public constructor () {
    	this._symbolStream = EmptyCharStream.INSTANCE
      this._lexer = new UnidocLexer(this._symbolStream)
      this._tokenStream = new CommonTokenStream(this._lexer)
      this._parser = new UnidocParser(this._tokenStream)
  }

  /**
  * Update the pipeline to parse the given string.
  *
  * @param content - Static content to parse as unidoc.
  */
  public fromString (content : string) : void {
    this._symbolStream = new ANTLRInputStream(content)
    this._lexer.inputStream = this._symbolStream
    this._lexer.reset()
    this._parser.reset()
  }

  /**
  * Execute a validation of this source by using the given validator.
  *
  * @param validator - A unidoc validator instance to use for the validation.
  *
  * @return The result of the validation operation as a validation object.
  */
  public validate (validator : Validator) : Validation {
    ParseTreeWalker.DEFAULT.walk(
      validator as ParseTreeListener,
      this._parser.unidoc()
    )

    return null
  }
}
