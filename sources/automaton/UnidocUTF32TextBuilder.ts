import { UTF32CodeUnit, UTF32String } from '../symbol'
import { UnidocEvent, UnidocEventType } from '../event'
import { UnidocAutomaton } from './UnidocAutomaton'

/**
 * 
 */
export class UnidocUTF32TextBuilder {
  /**
   * 
   */
  private readonly _result: UTF32String

  /**
   * 
   */
  public constructor(capacity: number = 32) {
    this._result = UTF32String.allocate(capacity)
  }

  /**
   * 
   */
  @UnidocAutomaton.start
  public clear(): this {
    this._result.clear()
    return this
  }

  /**
   * 
   */
  public append(event: UnidocEvent): this {
    if (event.isWhitespace()) {
      this.appendWhitespace(event)
    } else if (event.isWord()) {
      this.appendWord(event)
    } else {
      throw new Error(
        `Unable to append event ${event} as only events of types ${UnidocEventType.toString(UnidocEventType.WHITESPACE)} ` +
        `and ${UnidocEventType.toString(UnidocEventType.WORD)} can be reduced into an UTF32 text.`
      )
    }
    return this
  }

  /**
   * 
   */
  @UnidocAutomaton.words
  public appendWord(word: UnidocEvent): this {
    this._result.concat(word.symbols)
    return this
  }

  /**
   * 
   */
  @UnidocAutomaton.whitespaces
  public appendWhitespace(word: UnidocEvent): this {
    const result: UTF32String = this._result

    if (result.size < 1) return this

    const last: UTF32CodeUnit = result.last
    const lines: number = word.symbols.countLines()

    if (lines > 2) {
      if (last === UTF32CodeUnit.SPACE) {
        result.set(result.size - 1, UTF32CodeUnit.CARRIAGE_RETURN)
        result.push(UTF32CodeUnit.NEW_LINE)
        result.push(UTF32CodeUnit.CARRIAGE_RETURN)
        result.push(UTF32CodeUnit.NEW_LINE)
      } else if (last !== UTF32CodeUnit.NEW_LINE) {
        result.push(UTF32CodeUnit.CARRIAGE_RETURN)
        result.push(UTF32CodeUnit.NEW_LINE)
        result.push(UTF32CodeUnit.CARRIAGE_RETURN)
        result.push(UTF32CodeUnit.NEW_LINE)
      }
    } else if (
      last !== UTF32CodeUnit.SPACE &&
      last !== UTF32CodeUnit.NEW_LINE &&
      last !== UTF32CodeUnit.CARRIAGE_RETURN
    ) {
      result.push(UTF32CodeUnit.SPACE)
    }

    return this
  }

  /**
   * 
   */
  public build(): UTF32String {
    const result: UTF32String = new UTF32String(new Uint32Array(this._result.size))
    result.concat(this._result)
    return result
  }

  /**
   * 
   */
  @UnidocAutomaton.result
  public get(): UTF32String {
    return this._result
  }
}