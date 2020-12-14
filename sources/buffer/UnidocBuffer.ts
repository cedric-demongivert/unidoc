import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { bufferize as bufferizeImport } from './bufferize'

export type UnidocBuffer<T> = Pack<T>

export namespace UnidocBuffer {
  export const bufferize = bufferizeImport

  /**
  * Instantiate a new buffer for storing a given type of value.
  *
  * @param allocator - An allocator that allows to manipulate instances of the type of value to store.
  * @param [capacity=32] - Initial capacity of the buffer to allocate.
  *
  * @return A new buffer instance.
  */
  export function create<T>(allocator: Allocator<T>, capacity: number = 32): UnidocBuffer<T> {
    return Pack.instance(allocator, capacity)
  }

  export function toString<T>(buffer: Sequence<T>): string {
    let result: string = '['

    for (let index = 0; index < buffer.size; ++index) {
      const value: any = buffer.get(index)

      result += index > 0 ? ',' : ''
      result += '\r\n\t'

      if (value == null || value.toString == null) {
        result += JSON.stringify(value)
      } else {
        result += value.toString()
      }
    }

    result += buffer.size > 0 ? '\r\n' : ''
    result += ']'

    return result
  }

  export function stringify(element: any): string {
    if (element == null || element.toString == null) {
      return JSON.stringify(element)
    } else {
      return element.toString()
    }
  }

  export function expect(result: UnidocBuffer<any> | null | undefined, expectation: UnidocBuffer<any> | null | undefined): void {
    if (result == null || expectation == null) {
      if (expectation === result) {
        throw new Error('Received different values, received ' +
          stringify(result) + ' but expected ' + stringify(expectation) + '.')
      }
    } else if (result != expectation) {
      if (result.size !== expectation.size) {
        throw new Error(
          'Received a buffer of size ' + result.size + ' instead of a buffer ' +
          'of size ' + expectation.size + ', received ' +
          toString(result) + ' but expected ' + toString(expectation) + '.'
        )
      }

      for (let index = 0, size = expectation.size; index < size; ++index) {
        const resultItem: any = result.get(index)
        const expectedItem: any = expectation.get(index)

        if (resultItem == null || expectedItem == null || expectedItem.equals == null) {
          if (resultItem !== expectedItem) {
            throw new Error(
              'Difference between buffers at index ' + index + ' : ' +
              stringify(resultItem) + ' != ' + stringify(expectedItem) + ', ' +
              'received ' + toString(result) + ' but expected ' +
              toString(expectation) + '.'
            )
          }
        } else if (!resultItem.equals(expectedItem)) {
          throw new Error(
            'Difference between buffers at index ' + index + ' : ' +
            stringify(resultItem) + ' != ' + stringify(expectedItem) + ', ' +
            'received ' + toString(result) + ' but expected ' +
            toString(expectation) + '.'
          )
        }
      }
    }
  }
}
