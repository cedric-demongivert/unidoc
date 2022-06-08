import { UnidocURI } from '../origin'
import { UnidocSymbol } from '../symbol'

import { UnidocImport } from './UnidocImport'

/**
 * 
 */
export class UnidocIteratorResource {
  /**
   * 
   */
  public readonly origin: UnidocURI

  /**
   * 
   */
  public readonly import: UnidocImport

  /**
   * 
   */
  private readonly _iterator: Iterator<UnidocSymbol>

  /**
   *  
   */
  private _next: IteratorResult<UnidocSymbol>

  /**
   * 
   */
  public constructor(origin: UnidocURI, from: UnidocImport, iterator: Iterator<UnidocSymbol>) {
    this.origin = origin.clone()
    this.import = from.clone()
    this._iterator = iterator
    this._next = iterator.next()
  }

  /**
   * 
   */
  public hasNext(): boolean {
    return !this._next.done
  }

  /**
   * 
   */
  public next(): UnidocSymbol | undefined {
    const result: UnidocSymbol | undefined = this._next.value
    this._next = this._iterator.next()
    return result
  }
}
