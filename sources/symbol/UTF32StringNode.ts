import { bisect, Duplicator, Pack } from "@cedric-demongivert/gl-tool-collection"

import { DataObject } from '../DataObject'
import { UTF16CodeUnit } from "./UTF16CodeUnit"
import { UTF32CodeUnit } from "./UTF32CodeUnit"

import { UTF32String } from './UTF32String'

/**
 * 
 */
export class UTF32StringNode<Value> implements DataObject<UTF32StringNode<Value>> {
  /**
   * 
   */
  public readonly prefixes: Pack<UTF32String>

  /**
   * 
   */
  public readonly outputs: Pack<UTF32StringNode<Value>>

  /**
   * 
   */
  public EOL: boolean

  /**
   * 
   */
  public value: Value | null

  /**
   * 
   */
  public get size(): number {
    let result: number = this.EOL ? 1 : 0

    for (const output of this.outputs) {
      result += output.size
    }

    return result
  }

  /**
   * 
   */
  public constructor() {
    this.prefixes = Pack.any(0, UTF32String.allocate.withDefaultCapacity)
    this.outputs = Pack.any(0, UTF32StringNode.create)
    this.EOL = false
    this.value = null
  }

  /**
   * @see Clearable.prototype.clear
   */
  public clear(): this {
    this.EOL = false
    this.value = null

    for (const prefix of this.prefixes) {
      UTF32String.DUPLICATOR.free(prefix)
    }

    this.prefixes.clear()

    for (const output of this.outputs) {
      UTF32StringNode.DUPLICATOR.free(output)
    }

    this.outputs.clear()

    return this
  }

  /**
   * @see Assignable.prototype.copy
   */
  public copy(toCopy: UTF32StringNode<Value>): this {
    this.clear()

    for (const prefix of toCopy.prefixes) {
      this.prefixes.push(UTF32String.DUPLICATOR.copy(prefix))
    }

    for (const output of toCopy.outputs) {
      this.outputs.push(UTF32StringNode.DUPLICATOR.copy(output))
    }

    this.EOL = toCopy.EOL
    this.value = toCopy.value

    return this
  }

  /**
   * @see Clonable.prototype.clone
   */
  public clone(): UTF32StringNode<Value> {
    return new UTF32StringNode<Value>().copy(this)
  }

  /**
   * @see Comparable.prototype.equals
   */
  public equals(other: unknown): boolean {
    if (other == null) return false
    if (other === this) return true

    if (other instanceof UTF32StringNode) {
      return (
        other.prefixes.equals(this.prefixes) &&
        other.outputs.equals(this.outputs) &&
        other.EOL === this.EOL &&
        other.value === this.value
      )
    }

    return false
  }

  /**
   * 
   */
  public has(key: UTF32String, offset: number = 0): boolean {
    return UTF32StringNode.has(this, key, offset)
  }

  /**
   * 
   */
  public hasString(key: string, offset: number = 0): boolean {
    return UTF32StringNode.hasString(this, key, offset)
  }

  /**
   * 
   */
  public get(key: UTF32String, offset: number = 0): Value | undefined {
    return UTF32StringNode.get(this, key, offset)
  }

  /**
   * 
   */
  public getString(key: string, offset: number = 0): Value | undefined {
    return UTF32StringNode.getString(this, key, offset)
  }

  /**
   * 
   */
  public set(key: UTF32String, value: Value, offset: number = 0): this {
    UTF32StringNode.set(this, key, value, offset)
    return this
  }

  /**
   * 
   */
  public setString(key: string, value: Value, offset: number = 0): this {
    UTF32StringNode.setString(this, key, value, offset)
    return this
  }

  /**
   * 
   */
  public delete(key: UTF32String, offset: number = 0): this {
    UTF32StringNode.remove(this, key, offset)
    return this
  }

  /**
   * 
   */
  public deleteString(key: string, offset: number = 0): this {
    UTF32StringNode.removeString(this, key, offset)
    return this
  }

  /**
   * 
   */
  public setEOL(value: boolean): this {
    this.EOL = value
    return this
  }

  /**
   * 
   */
  public setValue(value: Value | null): this {
    this.value = value
    return this
  }

  /**
   * 
   */
  public keys(container: UTF32String = UTF32String.allocate.withDefaultCapacity()): IterableIterator<UTF32String> {
    return UTF32StringNode.iterateKeys(this, container)
  }

  /**
   * 
   */
  public values(): IterableIterator<Value> {
    return UTF32StringNode.iterateValues(this)
  }

  /**
   * 
   */
  public [Symbol.iterator](): IterableIterator<Value> {
    return this.values()
  }
}

/**
 * 
 */
export namespace UTF32StringNode {
  /**
   * 
   */
  export const EOL: UTF32StringNode<any> = Object.freeze(new UTF32StringNode().setEOL(true)) as UTF32StringNode<any>

  /**
   * 
   */
  export function* iterateKeys(root: UTF32StringNode<unknown>, container: UTF32String = UTF32String.allocate(32)): IterableIterator<UTF32String> {
    const indices: Array<number> = [0]
    const nodes: Array<UTF32StringNode<unknown>> = [root]

    if (root.EOL) {
      yield container
    }

    while (nodes.length > 0) {
      const currentIndex: number = indices[nodes.length - 1]
      const currentNode: UTF32StringNode<unknown> = nodes[nodes.length - 1]
      const currentPrefixes: Pack<UTF32String> = currentNode.prefixes
      const currentOutputs: Pack<UTF32StringNode<unknown>> = currentNode.outputs

      if (currentIndex < currentPrefixes.size) {
        container.concat(currentPrefixes.get(currentIndex))

        const nextNode: UTF32StringNode<unknown> = currentOutputs.get(currentIndex)

        indices[nodes.length - 1] += 1
        nodes.push(nextNode)
        indices.push(0)

        if (nextNode.EOL) {
          yield container
        }
      } else if (nodes.length > 1) {
        const previousNode: UTF32StringNode<unknown> = nodes[nodes.length - 2]
        const previousIndex: number = indices[nodes.length - 2]
        container.size -= previousNode.prefixes.get(previousIndex - 1).size
        indices.pop()
        nodes.pop()
      } else {
        container.clear()
        indices.pop()
        nodes.pop()
      }
    }
  }

  /**
   * 
   */
  export function* iterateValues<Value>(root: UTF32StringNode<Value>): IterableIterator<Value> {
    const indices: Array<number> = [0]
    const nodes: Array<UTF32StringNode<Value>> = [root]

    if (root.EOL) {
      yield root.value!
    }

    while (nodes.length > 0) {
      const currentIndex: number = indices[nodes.length - 1]
      const currentNode: UTF32StringNode<Value> = nodes[nodes.length - 1]
      const currentPrefixes: Pack<UTF32String> = currentNode.prefixes
      const currentOutputs: Pack<UTF32StringNode<Value>> = currentNode.outputs

      if (currentIndex < currentPrefixes.size) {
        const nextNode: UTF32StringNode<Value> = currentOutputs.get(currentIndex)

        indices[nodes.length - 1] += 1
        nodes.push(nextNode)
        indices.push(0)

        if (nextNode.EOL) {
          yield nextNode.value!
        }
      } else if (nodes.length > 1) {
        indices.pop()
        nodes.pop()
      } else {
        indices.pop()
        nodes.pop()
      }
    }
  }

  /**
   * 
   */
  export function get<Value>(root: UTF32StringNode<Value>, value: UTF32String, offset: number = 0): Value | undefined {
    let currentNode: UTF32StringNode<Value> = root

    while (true) {
      if (offset >= value.size) {
        return currentNode.EOL ? currentNode.value! : undefined
      }

      const prefixes: Pack<UTF32String> = currentNode.prefixes

      if (prefixes.size === 0) {
        return undefined
      }

      const candidateIndex: number = bisect(prefixes, value.get(offset), UTF32StringNode.compareWithSymbol)

      if (candidateIndex < 0) {
        return undefined
      }

      const candidate: UTF32String = prefixes.get(candidateIndex)

      if (candidate.size > value.size - offset) {
        return undefined
      }

      for (let index = 1; index < candidate.size; ++index) {
        if (value.get(offset + index) !== candidate.get(index)) {
          return undefined
        }
      }

      offset += candidate.size
      currentNode = currentNode.outputs.get(candidateIndex)
    }
  }

  /**
   * 
   */
  export function getString<Value>(root: UTF32StringNode<Value>, value: string, offset: number = 0): Value | undefined {
    let currentNode: UTF32StringNode<Value> = root

    while (true) {
      if (offset >= value.length) {
        return currentNode.EOL ? currentNode.value! : undefined
      }

      const prefixes: Pack<UTF32String> = currentNode.prefixes

      if (prefixes.size === 0) {
        return undefined
      }

      const candidateIndex: number = bisect(prefixes, UTF32CodeUnit.getAt(value, offset), UTF32StringNode.compareWithSymbol)

      if (candidateIndex < 0) {
        return undefined
      }

      const candidate: UTF32String = prefixes.get(candidateIndex)
      let nextOffset: number = UTF16CodeUnit.next(value, offset)
      let candidateOffset: number = 1

      for (; candidateOffset < candidate.size && nextOffset < value.length; ++candidateOffset) {
        if (UTF32CodeUnit.getAt(value, nextOffset) !== candidate.get(candidateOffset)) {
          return undefined
        }

        nextOffset = UTF16CodeUnit.next(value, nextOffset)
      }

      if (nextOffset >= value.length && candidateOffset < candidate.size) {
        return undefined
      }

      offset = nextOffset
      currentNode = currentNode.outputs.get(candidateIndex)
    }
  }

  /**
   * 
   */
  export function has(root: UTF32StringNode<unknown>, value: UTF32String, offset: number = 0) {
    let currentNode: UTF32StringNode<unknown> = root

    while (true) {
      if (offset >= value.size) {
        return currentNode.EOL
      }

      const prefixes: Pack<UTF32String> = currentNode.prefixes

      if (prefixes.size === 0) {
        return false
      }

      const candidateIndex: number = bisect(prefixes, value.get(offset), UTF32StringNode.compareWithSymbol)

      if (candidateIndex < 0) {
        return false
      }

      const candidate: UTF32String = prefixes.get(candidateIndex)

      if (candidate.size > value.size - offset) {
        return false
      }

      for (let index = 1; index < candidate.size; ++index) {
        if (value.get(offset + index) !== candidate.get(index)) {
          return false
        }
      }

      offset += candidate.size
      currentNode = currentNode.outputs.get(candidateIndex)
    }
  }

  /**
   * 
   */
  export function hasString(root: UTF32StringNode<unknown>, value: string, offset: number = 0) {
    let currentNode: UTF32StringNode<unknown> = root

    while (true) {
      if (offset >= value.length) {
        return currentNode.EOL
      }

      const prefixes: Pack<UTF32String> = currentNode.prefixes

      if (prefixes.size === 0) {
        return false
      }

      const candidateIndex: number = bisect(prefixes, UTF32CodeUnit.getAt(value, offset), UTF32StringNode.compareWithSymbol)

      if (candidateIndex < 0) {
        return false
      }

      const candidate: UTF32String = prefixes.get(candidateIndex)
      let nextOffset: number = UTF16CodeUnit.next(value, offset)
      let candidateOffset: number = 1

      for (; candidateOffset < candidate.size && nextOffset < value.length; ++candidateOffset) {
        if (UTF32CodeUnit.getAt(value, nextOffset) !== candidate.get(candidateOffset)) {
          return false
        }

        nextOffset = UTF16CodeUnit.next(value, nextOffset)
      }

      if (nextOffset >= value.length && candidateOffset < candidate.size) {
        return false
      }

      offset = nextOffset
      currentNode = currentNode.outputs.get(candidateIndex)
    }
  }

  /**
   * 
   */
  export function set<Value>(root: UTF32StringNode<Value>, key: UTF32String, value: Value, offset: number = 0): void {
    let currentNode: UTF32StringNode<Value> = root

    while (true) {
      if (offset >= key.size) {
        currentNode.setEOL(true)
        currentNode.setValue(value)
        return
      }

      const prefixes: Pack<UTF32String> = currentNode.prefixes
      const outputs: Pack<UTF32StringNode<Value>> = currentNode.outputs

      if (prefixes.size === 0) {
        const prefix: UTF32String = UTF32String.DUPLICATOR.allocate()
        prefix.subCopy(key, offset)

        const output: UTF32StringNode<Value> = UTF32StringNode.DUPLICATOR.allocate()
        output.setEOL(true)
        output.setValue(value)

        prefixes.push(prefix)
        outputs.push(output)
        return
      }

      const candidateIndex: number = bisect(prefixes, key.get(offset), UTF32StringNode.compareWithSymbol)

      if (candidateIndex < 0) {
        const prefix: UTF32String = UTF32String.DUPLICATOR.allocate()
        prefix.subCopy(key, offset)

        const output: UTF32StringNode<Value> = UTF32StringNode.DUPLICATOR.allocate()
        output.setEOL(true)
        output.setValue(value)

        const insertionIndex: number = -candidateIndex - 1
        prefixes.insert(insertionIndex, prefix)
        outputs.insert(insertionIndex, output)
        return
      }

      const candidate: UTF32String = prefixes.get(candidateIndex)
      const rest: number = key.size - offset
      const candidateSizeOrRest: number = rest < candidate.size ? rest : candidate.size

      let splitIndex: number = 1

      for (; splitIndex < candidateSizeOrRest; ++splitIndex) {
        if (key.get(offset + splitIndex) !== candidate.get(splitIndex)) {
          break
        }
      }

      if (splitIndex === rest) {
        if (rest === candidate.size) {
          offset += candidate.size
          currentNode = outputs.get(candidateIndex)
          continue
        }

        const nextNode: UTF32StringNode<Value> = UTF32StringNode.DUPLICATOR.allocate()
        nextNode.setEOL(true)
        nextNode.setValue(value)

        const prefix: UTF32String = UTF32String.DUPLICATOR.allocate()
        prefix.subCopy(candidate, splitIndex)

        nextNode.prefixes.push(prefix)
        nextNode.outputs.push(outputs.get(candidateIndex))

        outputs.set(candidateIndex, nextNode)
        candidate.size = splitIndex
        return
      }

      if (splitIndex < candidate.size) {
        const nextNode: UTF32StringNode<Value> = UTF32StringNode.DUPLICATOR.allocate()
        const eol: UTF32StringNode<Value> = UTF32StringNode.DUPLICATOR.allocate()
        const candidatePefix: UTF32String = UTF32String.DUPLICATOR.allocate()
        const valuePrefix: UTF32String = UTF32String.DUPLICATOR.allocate()

        eol.setEOL(true)
        eol.setValue(value)
        candidatePefix.subCopy(candidate, splitIndex)
        valuePrefix.subCopy(key, offset + splitIndex)

        if (candidate.get(splitIndex) < key.get(offset + splitIndex)) {
          nextNode.prefixes.push(candidatePefix)
          nextNode.prefixes.push(valuePrefix)
          nextNode.outputs.push(outputs.get(candidateIndex))
          nextNode.outputs.push(eol)
        } else {
          nextNode.prefixes.push(valuePrefix)
          nextNode.prefixes.push(candidatePefix)
          nextNode.outputs.push(eol)
          nextNode.outputs.push(outputs.get(candidateIndex))
        }

        outputs.set(candidateIndex, nextNode)
        candidate.size = splitIndex
        return
      }

      offset += candidate.size
      currentNode = outputs.get(candidateIndex)
    }
  }

  /**
   * 
   */
  export function setString<Value>(root: UTF32StringNode<Value>, key: string, value: Value, offset: number = 0): void {
    let currentNode: UTF32StringNode<Value> = root
    while (true) {
      if (offset >= key.length) {
        currentNode.setEOL(true)
        currentNode.setValue(value)
        return
      }

      const prefixes: Pack<UTF32String> = currentNode.prefixes
      const outputs: Pack<UTF32StringNode<Value>> = currentNode.outputs

      if (prefixes.size === 0) {
        const prefix: UTF32String = UTF32String.DUPLICATOR.allocate()
        prefix.subCopyString(key, offset)

        const output: UTF32StringNode<Value> = UTF32StringNode.DUPLICATOR.allocate()
        output.setEOL(true)
        output.setValue(value)

        prefixes.push(prefix)
        outputs.push(output)
        return
      }

      const candidateIndex: number = bisect(prefixes, UTF32CodeUnit.getAt(key, offset), UTF32StringNode.compareWithSymbol)

      if (candidateIndex < 0) {
        const prefix: UTF32String = UTF32String.DUPLICATOR.allocate()
        prefix.subCopyString(key, offset)

        const output: UTF32StringNode<Value> = UTF32StringNode.DUPLICATOR.allocate()
        output.setEOL(true)
        output.setValue(value)

        const insertionIndex: number = -candidateIndex - 1
        prefixes.insert(insertionIndex, prefix)
        outputs.insert(insertionIndex, output)
        return
      }

      const candidate: UTF32String = prefixes.get(candidateIndex)

      let nextOffset: number = UTF16CodeUnit.next(key, offset)
      let splitIndex: number = 1

      while (splitIndex < candidate.size && nextOffset < key.length) {
        if (UTF32CodeUnit.getAt(key, nextOffset) !== candidate.get(splitIndex)) {
          break
        }

        nextOffset = UTF16CodeUnit.next(key, nextOffset)
        splitIndex += 1
      }

      if (nextOffset === key.length) {
        if (splitIndex === candidate.size) {
          offset = nextOffset
          currentNode = outputs.get(candidateIndex)
          continue
        }

        const nextNode: UTF32StringNode<Value> = UTF32StringNode.DUPLICATOR.allocate()
        nextNode.setEOL(true)
        nextNode.setValue(value)

        const prefix: UTF32String = UTF32String.DUPLICATOR.allocate()
        prefix.subCopy(candidate, splitIndex)

        nextNode.prefixes.push(prefix)
        nextNode.outputs.push(outputs.get(candidateIndex))

        outputs.set(candidateIndex, nextNode)
        candidate.size = splitIndex
        return
      }

      if (splitIndex < candidate.size) {
        const nextNode: UTF32StringNode<Value> = UTF32StringNode.DUPLICATOR.allocate()
        const eol: UTF32StringNode<Value> = UTF32StringNode.DUPLICATOR.allocate()
        const candidatePefix: UTF32String = UTF32String.DUPLICATOR.allocate()
        const valuePrefix: UTF32String = UTF32String.DUPLICATOR.allocate()

        eol.setEOL(true)
        eol.setValue(value)
        candidatePefix.subCopy(candidate, splitIndex)
        valuePrefix.subCopyString(key, nextOffset)

        if (candidate.get(splitIndex) < UTF32CodeUnit.getAt(key, nextOffset)) {
          nextNode.prefixes.push(candidatePefix)
          nextNode.prefixes.push(valuePrefix)
          nextNode.outputs.push(outputs.get(candidateIndex))
          nextNode.outputs.push(eol)
        } else {
          nextNode.prefixes.push(valuePrefix)
          nextNode.prefixes.push(candidatePefix)
          nextNode.outputs.push(eol)
          nextNode.outputs.push(outputs.get(candidateIndex))
        }

        outputs.set(candidateIndex, nextNode)
        candidate.size = splitIndex
        return
      }

      offset += candidate.size
      currentNode = outputs.get(candidateIndex)
    }
  }

  /**
   * 
   */
  function dissolve(previousNode: UTF32StringNode<unknown>, previousIndex: number, currentNode: UTF32StringNode<unknown>): void {
    previousNode.prefixes.get(previousIndex).concat(currentNode.prefixes.first)
    previousNode.outputs.set(previousIndex, currentNode.outputs.pop())
    currentNode.clear()
  }

  /**
   * 
   */
  function resolveRemove(
    previousPreviousNode: UTF32StringNode<unknown> | undefined,
    previousPreviousIndex: number | undefined,
    previousNode: UTF32StringNode<unknown> | undefined,
    previousIndex: number | undefined,
    currentNode: UTF32StringNode<unknown>
  ): void {
    if (previousNode == null || currentNode.prefixes.size > 1) {
      currentNode.setEOL(false)
      return
    }

    const previousPrefixes: Pack<UTF32String> = previousNode.prefixes
    const previousOutputs: Pack<UTF32StringNode<unknown>> = previousNode.outputs

    if (currentNode.prefixes.size === 1) {
      dissolve(previousNode, previousIndex!, currentNode)
      UTF32StringNode.DUPLICATOR.free(currentNode)
      return
    }

    const previousPrefix: UTF32String = previousPrefixes.get(previousIndex!)

    previousPrefixes.delete(previousIndex!)
    previousOutputs.delete(previousIndex!)

    UTF32String.DUPLICATOR.free(previousPrefix)
    UTF32StringNode.DUPLICATOR.free(currentNode)

    if (previousPreviousNode == null) return
    if (previousNode.EOL || previousPrefix.size > 1) return

    dissolve(previousPreviousNode, previousPreviousIndex!, previousNode)

    UTF32StringNode.DUPLICATOR.free(previousNode)
  }

  /**
   * 
   */
  export function remove(root: UTF32StringNode<unknown>, key: UTF32String, offset: number = 0): void {
    let previousPreviousNode: UTF32StringNode<unknown> | undefined = undefined
    let previousPreviousIndex: number | undefined = undefined
    let previousNode: UTF32StringNode<unknown> | undefined = undefined
    let previousIndex: number | undefined = undefined
    let currentNode: UTF32StringNode<unknown> = root

    while (true) {
      if (offset >= key.size) {
        resolveRemove(previousPreviousNode, previousPreviousIndex, previousNode, previousIndex, currentNode)
        return
      }

      const prefixes: Pack<UTF32String> = currentNode.prefixes
      const outputs: Pack<UTF32StringNode<unknown>> = currentNode.outputs

      if (prefixes.size === 0) {
        return
      }

      const candidateIndex: number = bisect(prefixes, key.get(offset), UTF32StringNode.compareWithSymbol)

      if (candidateIndex < 0) {
        return
      }

      const candidate: UTF32String = prefixes.get(candidateIndex)

      if (candidate.size > key.size - offset) {
        return
      }

      for (let index = 0, size = candidate.size; index < size; ++index) {
        if (key.get(offset + index) !== candidate.get(index)) {
          return
        }
      }

      previousPreviousIndex = previousIndex
      previousIndex = candidateIndex
      previousPreviousNode = previousNode
      previousNode = currentNode
      offset += candidate.size
      currentNode = outputs.get(candidateIndex)
    }
  }

  /**
   * 
   */
  export function removeString(root: UTF32StringNode<unknown>, key: string, offset: number = 0): void {
    let previousPreviousNode: UTF32StringNode<unknown> | undefined = undefined
    let previousPreviousIndex: number | undefined = undefined
    let previousNode: UTF32StringNode<unknown> | undefined = undefined
    let previousIndex: number | undefined = undefined
    let currentNode: UTF32StringNode<unknown> = root

    while (true) {
      if (offset >= key.length) {
        resolveRemove(previousPreviousNode, previousPreviousIndex, previousNode, previousIndex, currentNode)
        return
      }

      const prefixes: Pack<UTF32String> = currentNode.prefixes
      const outputs: Pack<UTF32StringNode<unknown>> = currentNode.outputs

      if (prefixes.size === 0) {
        return
      }

      const candidateIndex: number = bisect(prefixes, UTF32CodeUnit.getAt(key, offset), UTF32StringNode.compareWithSymbol)

      if (candidateIndex < 0) {
        return
      }

      const candidate: UTF32String = prefixes.get(candidateIndex)
      let nextOffset: number = UTF16CodeUnit.next(key, offset)

      for (let index = 1, size = candidate.size; index < size; ++index) {
        if (UTF32CodeUnit.getAt(key, nextOffset) !== candidate.get(index)) {
          return
        }

        nextOffset = UTF16CodeUnit.next(key, nextOffset)
      }

      previousPreviousIndex = previousIndex
      previousIndex = candidateIndex
      previousPreviousNode = previousNode
      previousNode = currentNode
      offset = nextOffset
      currentNode = outputs.get(candidateIndex)
    }
  }

  /**
   * 
   */
  export function eol(): UTF32StringNode<any> {
    return new UTF32StringNode().setEOL(true)
  }

  /**
   * 
   */
  export function create(): UTF32StringNode<any> {
    return new UTF32StringNode()
  }

  /**
   * 
   */
  export function compareFirstSymbol(left: UTF32String, right: UTF32String): number {
    return left.first - right.first
  }

  /**
   * 
   */
  export function compareWithSymbol(left: number, right: UTF32String): number {
    return left - right.first
  }

  /**
   * 
   */
  export const DUPLICATOR: Duplicator<UTF32StringNode<any>> = Duplicator.fromFactory(create)
}