import { PackCircularBuffer } from '@cedric-demongivert/gl-tool-collection'
import { Packs } from '@cedric-demongivert/gl-tool-collection'
import { IdentifierSet } from '@cedric-demongivert/gl-tool-collection'

export class MarkSet {
  private _keys : IdentifierSet
  private _values : PackCircularBuffer<number>

  public constructor (capacity : number = 16) {
    this._keys = new IdentifierSet(capacity)
    this._values = new PackCircularBuffer(Packs.uint32(capacity))
  }

  public get size () : number {
    return this._keys.size
  }

  public get capacity () : number {
    return this._keys.capacity
  }

  public reallocate (capacity : number) : void {
    this._keys.reallocate(capacity)
    this._values.reallocate(capacity)
  }

  public fit () : void {
    this._keys.fit()
    this._values.fit()
  }

  public mark (value : number) : number {
    if (this._values.capacity === this._values.size) {
      this._values.reallocate(this._values.capacity << 1)
      this._keys.reallocate(this._keys.capacity << 1)
    }

    this._values.push(value)
    return this._keys.next()
  }

  public get (key : number) : number {
    return this._values.get(this._keys.indexOf(key))
  }

  public has (key : number) : number {
    return this._keys.indexOf(key)
  }

  public release (key : number) : void {
    if (!this._keys.has(key)) {
      throw new Error(
        'Unable to release the given mark ' + key + ' : the given mark ' +
        'does not exists, current existing marks are [' +
        [ ...this._keys ].join(', ') + ']'
      )
    }

    if (this._keys.indexOf(key) !== this._keys.size - 1) {
      throw new Error(
        'Unable to release the given mark ' + key + ' : trying to release ' +
        'marks in invalid order, the valid order is [' +
         [...this._keys].reverse().join(', ') + ']'
      )
    }

    this._keys.delete(key)
    this._values.delete(this._values.size - 1)
  }

  public first () : number {
    return this._values.get(0)
  }

  public last () : number {
    return this._values.get(this._values.size - 1)
  }

  public clear () : void {
    this._values.clear()
    this._keys.clear()
  }
}
