import { Allocator } from '@cedric-demongivert/gl-tool-collection'
import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocProducer } from '../producer/UnidocProducer'
import { UnidocBufferizer } from './UnidocBufferizer'
import { UnidocBuffer } from './UnidocBuffer'

/**
* Transform a producer of symbols into a producer of tokens.
*
* @param input - A producer of symbols.
*
* @return A producer of tokens.
*/
export function bufferize<T>(input: UnidocProducer<T>): Pack<T>
export function bufferize<T>(input: UnidocProducer<T>, allocator: Allocator<T>): UnidocBuffer<T>
export function bufferize<T>(input: UnidocProducer<T>, allocator?: Allocator<T>): Pack<T> | UnidocBuffer<T> {
  let bufferizer: UnidocBufferizer<T>

  if (allocator == null) {
    bufferizer = new UnidocBufferizer(Pack.any(32))
  } else {
    bufferizer = new UnidocBufferizer(UnidocBuffer.create(allocator, 32))
  }

  bufferizer.subscribe(input)

  return bufferizer.buffer
}
