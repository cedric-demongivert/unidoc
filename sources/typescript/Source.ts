import { ANTLRInputStream } from 'antlr4ts'
import { CharStream } from 'antlr4ts'
import { CommonTokenStream } from 'antlr4ts'
import { TokenStream } from 'antlr4ts'
import { ParseTreeWalker } from 'antlr4ts/tree/ParseTreeWalker'
import { ParseTreeListener } from 'antlr4ts/tree/ParseTreeListener'

import { Observable } from 'rxjs'
import { Subscriber } from 'rxjs'

import { UnidocLexer } from '@grammar/UnidocLexer'
import { UnidocParser } from '@grammar/UnidocParser'

import { EmptyCharStream } from '@library/antlr/EmptyCharStream'
import { UnidocEvent } from '@library/event/UnidocEvent'
import { UnidocStreamer } from '@library/antlr/UnidocStreamer'

import { Alias } from '@library/alias'

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

  public parse () : Observable<UnidocEvent> {
    return new Observable<UnidocEvent>(
      (subscriber : Subscriber<UnidocEvent>) => {
        const streamer : UnidocStreamer = new UnidocStreamer(subscriber)
        Alias.Standard.get(streamer.tags)

        ParseTreeWalker.DEFAULT.walk(
          streamer as ParseTreeListener,
          this._parser.unidoc()
        )
      }
    )
  }
}