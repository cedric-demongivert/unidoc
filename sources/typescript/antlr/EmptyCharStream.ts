import { CharStream, IntStream } from 'antlr4ts'
import { Interval } from 'antlr4ts/misc'

const EMPTY_STRING : string = ''

export class EmptyCharStream implements CharStream {
  public static INSTANCE : CharStream = new EmptyCharStream()

  /**
  * @see antlr4ts/IntStream#sourceName
  */
  public get sourceName() : string {
    return IntStream.UNKNOWN_SOURCE_NAME;
  }

  /**
  * @see antlr4ts/IntStream#size
  */
  public get size() : number {
		return 1;
	}

  /**
  * @see antlr4ts/IntStream#index
  */
  public get index () : number {
    return 0
  }

  /**
  * @see antlr4ts/IntStream#consume
  */
  public consume () : void {
    throw new Error('Trying to consume End-Of-File.')
  }

  /**
  * @see antlr4ts/IntStream#LA
  */
  public LA (offset : number) {
    return IntStream.EOF
  }

  /**
  * @see antlr4ts/IntStream#mark
  */
  public mark () : number {
    return -1
  }

  /**
  * @see antlr4ts/IntStream#release
  */
  public release (marker : number) : void {
  }

  /**
  * @see antlr4ts/IntStream#getText
  */
  public getText (interval : Interval) : string {
    return EMPTY_STRING
  }

  /**
  * @see antlr4ts/IntStream#seek
  */
  public seek (index : number) : void {
    if (index > 0) {
      throw new Error('Trying to consume End-Of-File.')
    }
  }

  /**
  * @see antlr4ts/IntStream#toString
  */
  public toString () : string {
    return EMPTY_STRING
  }
}
