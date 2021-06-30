import { UnidocSymbol } from '../symbol/UnidocSymbol'

import { UnidocPublisher } from '../stream/UnidocPublisher'
import { UnidocSink } from '../stream/UnidocSink'


import { UnidocSymbolGenerator } from './UnidocSymbolGenerator'

import { UnidocSource } from './UnidocSource'
import { UnidocSourceState } from './UnidocSourceState'

/**
 * 
 */
export class UnidocGeneratorSource extends UnidocPublisher<UnidocSymbol> implements UnidocSource {
  /**
   * 
   */
  private readonly _generator: UnidocSymbolGenerator

  /**
   * 
   */
  private _state: UnidocSourceState

  /**
   * 
   */
  public get state(): UnidocSourceState {
    return this._state
  }

  /**
   * 
   */
  public constructor(generator: UnidocSymbolGenerator) {
    super()
    this._generator = generator
    this._state = UnidocSourceState.INSTANTIATED
  }

  /**
   * 
   */
  public skip(elements: number = 1): void {
    this._generator.skip(elements)
  }

  /**
   * 
   */
  private _start(): void {
    const output: UnidocSink<UnidocSymbol> = this.output

    output.start()
    this._state = UnidocSourceState.RUNNING
  }

  /**
   * 
   */
  private _next(): void {
    const generator: UnidocSymbolGenerator = this._generator
    const output: UnidocSink<UnidocSymbol> = this.output

    if (generator.running) {
      try {
        output.next(generator.next()!)
      } catch (error) {
        output.fail(error)
        this._state = UnidocSourceState.FAILED
      }
    } else {
      output.success()
      this._state = UnidocSourceState.FINISHED
    }
  }

  /**
   *  
   */
  public read(): void {
    while (this._state !== UnidocSourceState.FINISHED && this._state !== UnidocSourceState.FAILED) {
      switch (this._state) {
        case UnidocSourceState.INSTANTIATED:
          this._start()
          break
        case UnidocSourceState.RUNNING:
          this._next()
          break
        default:
          return
      }
    }
  }
}

/**
 * 
 */
export namespace UnidocGeneratorSource {
  /**
   * 
   */
  export function create(generator: UnidocSymbolGenerator): UnidocGeneratorSource {
    return new UnidocGeneratorSource(generator)
  }
}