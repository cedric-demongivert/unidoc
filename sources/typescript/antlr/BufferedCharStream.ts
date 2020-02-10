import { CharStream, IntStream } from 'antlr4ts'
import { Interval } from 'antlr4ts/misc'

import { PackCircularBuffer } from '@cedric-demongivert/gl-tool-collection'
import { Packs } from '@cedric-demongivert/gl-tool-collection'

import { MarkSet } from './MarkSet'

const EMPTY_STRING : string = ''

export class BufferedCharStream implements CharStream {
  /**
  * A circular buffer of symbols.
  */
  private _symbols : PackCircularBuffer<number>

  /**
  * Current cursor location.
  */
  private _cursor : number

  /**
  * Starting symbol index.
  */
  private _start : number

  /**
  * Current marks.
  */
  private _marks : MarkSet

  /**
  * Instantiate a new buffered char stream of the requested capacity.
  */
  public constructor (capacity : number = 512) {
    this._symbols = new PackCircularBuffer(Packs.int32(capacity))
    this._cursor  = 0
    this._start   = 0
    this._marks   = new MarkSet()
  }

  /**
  * @see antlr4ts/IntStream#sourceName
  */
  public get sourceName() : string {
    return IntStream.UNKNOWN_SOURCE_NAME;
  }

  /**
  * @return The underlying buffer capacity.
  */
  public get capacity () : number {
    return this._symbols.capacity
  }

  /**
  * Update the capacity of the underlying buffer.
  *
  * @param capacity - The new capacity of the underlying buffer.
  */
  public reallocate (capacity : number) : void {
    this._symbols.reallocate(capacity)
  }

  /**
  * Optimize the underlying buffer capacity.
  */
  public fit () : void {
    this._symbols.fit()
  }

  /**
  * @see antlr4ts/IntStream#size
  */
  public get size() : number {
		return this._symbols.size + this._start
	}

  /**
  * @see antlr4ts/IntStream#index
  */
  public get index () : number {
    return this._cursor
  }

  /**
  * Push the given symbol into this buffer.
  *
  * @param symbol - A symbol to push into this buffer.
  */
  public push (symbol : number) : void {
    if (this._symbols.capacity === this._symbols.size) {
      this._symbols.reallocate(this._symbols.capacity * 2)
    }

    this._symbols.push(symbol)
  }

  /**
  * Push the given string into this buffer.
  *
  * @param token - A string value to push into this buffer.
  */
  public pushString (token : string) : void {
    const length : number = token.length

    for (let index = 0; index < length; ++index) {
      this.push(token.codePointAt(index))
    }
  }

  /**
  * Forget unecessary data.
  */
  public truncate () : void {
    if (this._marks.size <= 0) {
      while (this._start < this._cursor) {
        this._symbols.delete(0)
        this._start += 1
      }
    } else {
      const mark : number = this._marks.last()

      while (this._start < mark) {
        this._symbols.delete(0)
        this._start += 1
      }
    }
  }

  public hasNext () : boolean {
    return this._cursor - this._start < this._symbols.size &&
           this.LA(1) != IntStream.EOF
  }

  public atLast () : boolean {
    return this._cursor - this._start === this._symbols.size - 1
  }

  /**
  * @see antlr4ts/IntStream#consume
  */
  public consume () : void {
    if (this._cursor - this._start < this._symbols.size) {
      this._cursor += 1
    } else {
      throw new Error('Nothing left to consume.')
    }
  }

  /**
  * @see antlr4ts/IntStream#LA
  */
  public LA (offset : number) : number {
    if (offset > 0) {
      const index : number = this._cursor - this._start + offset - 1

      if (index > this._symbols.size) {
        throw new Error(
          'Unable to retrieve the symbol at offset ' + offset + ' because ' +
          'the  resulting location ' + index + ' is outside of the current ' +
          'symbol buffer [0, ' + this._symbols.size + '[.'
        )
      } else {
        return this._symbols.get(index)
      }
    } else if (offset < 0) {
      const index : number = this._cursor - this._start + offset

      if (index < 0) {
        throw new Error(
          'Unable to retrieve the symbol at offset ' + offset + ' because ' +
          'the resulting location ' + index + ' is outside of the current ' +
          'symbol buffer [0, ' + this._symbols.size + '[.'
        )
      } else {
        return this._symbols.get(index)
      }
    }
  }

  /**
  * @see antlr4ts/IntStream#mark
  */
  public mark () : number {
    return this._marks.mark(this._cursor)
  }

  /**
  * @see antlr4ts/IntStream#release
  */
  public release (marker : number) : void {
    this._marks.release(marker)
  }

  /**
  * @see antlr4ts/IntStream#getText
  */
  public getText (interval : Interval) : string {
    const start : number = interval.a - this._start

    if (start < 0) {
      throw new Error(
        'Unable to get the given interval ' + interval.toString() +
        ' as a string because the requested interval start before this ' +
        'buffer of symbol : ' + start + ' < 0.'
      )
    }

    const end : number = interval.b - this._start

    if (end > this._symbols.size) {
      throw new Error(
        'Unable to get the given interval ' + interval.toString() +
        ' as a string because the requested interval end after this ' +
        'buffer of symbol : ' + end + ' > ' + this._symbols.size + '.'
      )
    }

    const symbols : PackCircularBuffer<number> = this._symbols
    const buffer : number[] = []

    for (let index = start; index <= end; ++index) {
      const symbol : number = symbols.get(index)

      if (symbol !== IntStream.EOF) {
        buffer.push(symbols.get(index))
      }
    }

    return String.fromCodePoint(...buffer)
  }

  /**
  * @see antlr4ts/IntStream#seek
  */
  public seek (index : number) : void {
    if (index < this._start) {
      throw new Error(
        'Unable to seek the requested index ' + index + ' because the ' +
        'requested index lying before this buffer starting index ' +
        this._start + '.'
      )
    }

    if (index >= this._start + this._symbols.size + 1) {
      throw new Error(
        'Unable to seek the requested index ' + index + ' because the ' +
        'requested index lying after this buffer ending index ' +
        (this._start + this._symbols.size) + '.'
      )
    }

    this._cursor = index
  }

  /**
  * @see antlr4ts/IntStream#toString
  */
  public toString () : string {
    const buffer : number[] = []
    const symbols : PackCircularBuffer<number> = this._symbols
    const length : number = symbols.size

    for (let index = 0; index < length; ++index) {
      const symbol : number = symbols.get(index)

      if (symbol !== IntStream.EOF) {
        buffer.push(symbols.get(index))
      }
    }

    return String.fromCodePoint(...buffer)
  }
}
