import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { CodePoint } from '../CodePoint'
import { UnidocPath } from '../path/UnidocPath'
import { UnidocSymbol } from '../stream/UnidocSymbol'

export class UnidocSymbolBuffer {
  /**
  * Location of the first symbol of the buffer (included).
  */
  public readonly from : UnidocPath

  /**
  * Location of the last symbol of the buffer (excluded).
  */
  public readonly to : UnidocPath

  /**
  * Buffer of symbols of this lexer.
  */
  private readonly _symbols  : Pack<CodePoint>

  /**
  * Buffer of symbols of this lexer.
  */
  public readonly symbols  : Sequence<CodePoint>

  public constructor (capacity : number) {
    this.from = new UnidocPath(16)
    this.to = new UnidocPath(16)
    this._symbols = Pack.uint32(capacity)
    this.symbols = this._symbols.view()
  }

  public bufferize (symbol : UnidocSymbol) : void {
    if (this._symbols.size <= 0) {
      this.from.copy(symbol.location)
      this.from.snapToStart()
    }

    this.to.copy(symbol.location)
    this.to.snapToEnd()

    this._symbols.push(symbol.symbol)
  }

  public clear () : void {
    this.from.clear()
    this.to.clear()
    this._symbols.clear()
  }
}
