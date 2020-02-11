import { Pack } from '@cedric-demongivert/gl-tool-collection'

export function copy <T> (source : Pack<T>, destination : Pack<T>) : void {
  for (let index = 0, length = source.size; index < length; ++index) {
    destination.set(index, source.get(index))
  }

  destination.size = source.size
}
