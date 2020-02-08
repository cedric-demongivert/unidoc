import { Pack } from '@cedric-demongivert/gl-tool-collection'
import { Packs } from '@cedric-demongivert/gl-tool-collection'
import { bissect } from '@cedric-demongivert/gl-tool-collection'

function symbolComparator (left : number, right : number) : number {
  return left - right
}

export class TrieNode<Value> {
  private _keys : Pack<number>
  private _children : Pack<TrieNode<Value>>
  public endOfWord : Value

  /**
  * Instantiate a new trie node of the given capacity.
  *
  * @param capacity - Key-value pair capacity of the trie node to instantiate.
  */
  public constructor (capacity : number = 16) {
    this._keys = Packs.uint32(capacity)
    this._children = Packs.any(capacity)
    this.endOfWord = undefined
  }

  /**
  * @return The maximum number of key-value that this node can store.
  */
  public get capacity () : number {
    return this._keys.capacity
  }

  /**
  * @return The number of key-value that this node store.
  */
  public get size () : number {
    return this._keys.size
  }

  /**
  * Return the children of the nth key-value pair of this trie node.
  *
  * @param index - Index of the child node to get.
  *
  * @return The children of the requested key-value pair of this trie node.
  */
  public nextByIndex (index : number) : TrieNode<Value> {
    return this._children.get(index)
  }

  /**
  * Return the children associated to the given symbol.
  *
  * @param symbol - Symbol to search.
  *
  * @return The children associated to the given symbol.
  */
  public next (symbol : number) : TrieNode<Value> {
    const index : number = bissect(this._keys, symbol, symbolComparator)

    return index < 0 ? undefined : this._children.get(index)
  }



}
