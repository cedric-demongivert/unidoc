import * as chalk from "chalk"
import { TextAnchor } from "./TextAnchor"

/**
 * 
 */
export class UnicodeTablePrinter {
  /**
   * 
   */
  #width: number

  /**
   * 
   */
  #values: string[]

  /**
   * 
   */
  #colors: (chalk.ChalkFunction | undefined)[]

  /**
   * 
   */
  #anchors: TextAnchor[]

  /**
   * 
   */
  #sizes: number[]

  /**
   * 
   */
  public constructor(width: number) {
    this.#width = width
    this.#anchors = []
    this.#values = []
    this.#colors = []
    this.#sizes = []

    for (let index = 0; index < width; ++index) {
      this.#anchors.push(TextAnchor.DEFAULT)
      this.#sizes.push(0)
    }
  }

  /**
   * 
   */
  public pushColors(...colors: (chalk.ChalkFunction | undefined)[]) {
    this.#colors.push(...colors)
  }

  /**
   * 
   */
  public tint(color: chalk.ChalkFunction | undefined) {
    for (let index = 0, length = this.#sizes.length; index < length; ++index) {
      this.#colors.push(color)
    }
  }

  /**
   * 
   */
  public pushValues(...values: string[]) {
    this.#values.push(...values)

    const sizes: number[] = this.#sizes

    for (let index = 0; index < values.length; ++index) {
      sizes[index] = Math.max(values[index].length, sizes[index])
    }
  }

  /**
   *  
   */
  public setAnchor(index: number, anchor: TextAnchor) {
    this.#anchors[index] = anchor
  }

  /**
   * 
   */
  public getColumnSize(index: number): number {
    return this.#sizes[index]
  }

  /**
   * 
   */
  public top(): string {
    let result: string = '┌─'

    const sizes: number[] = this.#sizes

    for (let index = 0; index < sizes.length; ++index) {
      if (index > 0) result += '─┬─'
      result += '─'.repeat(sizes[index])
    }

    return result + '─┐'
  }

  /**
   * 
   */
  public emptyLine(): string {
    let result: string = '│ '

    const sizes: number[] = this.#sizes

    for (let index = 0; index < sizes.length; ++index) {
      if (index > 0) result += ' ┊ '
      result += ' '.repeat(sizes[index])
    }

    return result + ' │'
  }

  /**
   * 
   */
  public head(row: number): string {
    let result: string = '  '

    const sizes: number[] = this.#sizes
    const anchors: TextAnchor[] = this.#anchors
    const values: string[] = this.#values
    const width: number = this.#width
    const start: number = row * width

    for (let column = 0; column < width; ++column) {
      if (column > 0) result += ' ┊ '

      const cell: number = start + column
      const value: string = values[cell]
      const content: string = chalk.inverse(value)
      const anchor: TextAnchor = anchors[column]
      const spaces: number = sizes[column] - value.length

      result += TextAnchor.left(spaces, anchor)
      result += content
      result += TextAnchor.right(spaces, anchor)
    }

    return chalk.inverse(result + '  ')
  }

  /**
   * 
   */
  public title(content: string, anchor: TextAnchor = TextAnchor.LEFT): string {
    const sizes: number[] = this.#sizes
    let total: number = 0

    for (let size of sizes) {
      total += size
    }

    total += sizes.length * 3 - 3

    const spaces: number = total - content.length

    return chalk.inverse(
      '  ' + TextAnchor.left(spaces, anchor) +
      content.padEnd(total) +
      TextAnchor.right(spaces, anchor) + '  '
    )
  }

  /**
   * 
   */
  public after(offset: number): string {
    let result: string = ''

    for (let row = offset, rows = this.#values.length / this.#width; row < rows; ++row) {
      if (row > offset) result += '\r\n'
      result += this.line(row)
    }

    return result
  }

  /**
   * 
   */
  public line(row: number): string {
    let result: string = '  '

    const sizes: number[] = this.#sizes
    const anchors: TextAnchor[] = this.#anchors
    const values: string[] = this.#values
    const colors: (chalk.ChalkFunction | undefined)[] = this.#colors
    const width: number = this.#width
    const start: number = row * width

    for (let column = 0; column < width; ++column) {
      if (column > 0) result += ' ┊ '

      const cell: number = start + column
      const value: string = values[cell]
      const color: chalk.ChalkFunction | undefined = colors[cell]
      const content: string = color ? color(value) : value
      const anchor: TextAnchor = anchors[column]
      const spaces: number = sizes[column] - value.length

      result += TextAnchor.left(spaces, anchor)
      result += content
      result += TextAnchor.right(spaces, anchor)
    }

    return result + '  '
  }

  /**
   * 
   */
  public lines(): string {
    let result: string = ''

    for (let row = 0, rows = this.#values.length / this.#width; row < rows; ++row) {
      if (row > 0) result += '\r\n'
      result += this.line(row)
    }

    return result
  }

  /**
   * 
   */
  public midline(): string {
    let result: string = '├─'

    const sizes: number[] = this.#sizes

    for (let index = 0; index < sizes.length; ++index) {
      if (index > 0) result += '─┼─'
      result += '─'.repeat(sizes[index])
    }

    return result + '─┤'
  }

  /**
   * 
   */
  public bottom(): string {
    let result: string = '└─'

    const cells: number[] = this.#sizes

    for (let index = 0; index < cells.length; ++index) {
      if (index > 0) result += '─┴─'
      result += '─'.repeat(cells[index])
    }

    return result + '─┘'
  }
}
