import { Sequence } from '@cedric-demongivert/gl-tool-collection'

import { DataPath } from './DataPath'

export class Data {
  /**
  *
  */
  public value: any

  /**
  *
  */
  public constructor() {
    this.value = undefined
  }

  /**
  *
  */
  public isMap(): boolean {
    return Data.isMap(this.value)
  }

  /**
  *
  */
  public isArray(): boolean {
    return Data.isArray(this.value)
  }

  /**
  *
  */
  public isObject(): boolean {
    return Data.isObject(this.value)
  }

  /**
  *
  */
  public isPrimitive(): boolean {
    return Data.isPrimitive(this.value)
  }

  /**
  *
  */
  public move(field: number | string): void {
    this.value = Data.move(this.value, field)
  }

  /**
  *
  */
  public follow(path: DataPath): void {
    this.value = Data.follow(this.value, path)
  }

  /**
  *
  */
  public set(field: string | number, value: any): void {
    Data.set(this.value, field, value)
  }

  /**
  *
  */
  public setIn(path: DataPath, value: any): void {
    Data.setIn(this.value, path, value)
  }

  /**
  *
  */
  public push(value: any): void {
    Data.push(this.value, value)
  }

  /**
  *
  */
  public pushIn(path: DataPath, value: any): void {
    Data.pushIn(this.value, path, value)
  }
}

export namespace Data {
  /**
  *
  */
  export function isMap(value: any): value is Map<any, any> {
    return value != null && typeof value === 'object' && value instanceof Map
  }

  /**
  *
  */
  export function isArray(value: any): value is Array<any> {
    return value != null && typeof value === 'object' && value instanceof Array
  }

  /**
  *
  */
  export function isObject(value: any): value is object {
    return value != null && typeof value === 'object' && !(value instanceof Array)
  }

  /**
  *
  */
  export function isPrimitive(value: any): value is null | undefined | number | boolean | string {
    return value == null && typeof value !== 'object'
  }

  /**
  *
  */
  export function move(value: any, field: number | string): any {
    if (value == null || typeof value !== 'object') {
      if (value == null) {
        throw new Error(
          'Illegal call to move, a data object can\'t move ' +
          'throughout a null or undefined value.'
        )
      } else {
        throw new Error(
          'Illegal call to move, a data object can\'t move ' +
          'throughout a primitive value.'
        )
      }
    } else if (value instanceof Array) {
      if (typeof value === 'number') {
        return value[field]
      } else {
        throw new Error(
          'Illegal call to move, a data object can\'t move ' +
          'throughout an array by using a string key.'
        )
      }
    } else if (value instanceof Map) {
      return value.get(field)
    } else {
      return value[field]
    }
  }

  /**
  *
  */
  export function follow(value: any, path: DataPath): any {
    const elements: Sequence<string | number> = path.elements

    let current: any = value

    for (let index = 0, size = elements.size; index < size; ++index) {
      current = move(current, elements.get(index))
    }

    return current
  }

  /**
  *
  */
  export function set(collection: any, field: string | number, value: any): void {
    if (collection == null || typeof collection !== 'object') {
      if (collection == null) {
        throw new Error(
          'Illegal call to set, a data object can\'t assign ' +
          'a field to a null or undefined value.'
        )
      } else {
        throw new Error(
          'Illegal call to set, a data object can\'t assign ' +
          'a field to a primitive value.'
        )
      }
    } else if (collection instanceof Array) {
      if (typeof field === 'number') {
        collection[field] = value
      } else {
        throw new Error(
          'Illegal call to set, a data object can\'t assign ' +
          'a string field to an array.'
        )
      }
    } else if (collection instanceof Map) {
      collection.set(field, value)
    } else {
      collection[field] = value
    }
  }

  /**
  *
  */
  export function setIn(tree: any, path: DataPath, value: any): void {
    const elements: Sequence<string | number> = path.elements
    let collection: any = tree

    for (let index = 0, size = elements.size - 1; index < size; ++index) {
      collection = move(collection, elements.get(index))
    }

    set(collection, elements.last, value)
  }

  /**
  *
  */
  export function push(collection: any, value: any): void {
    if (collection == null || typeof collection !== 'object') {
      if (collection == null) {
        throw new Error(
          'Illegal call to push, a data object can\'t push ' +
          'into a null or undefined value.'
        )
      } else {
        throw new Error(
          'Illegal call to push, a data object can\'t push ' +
          'into a primitive value.'
        )
      }
    } else if (collection instanceof Array) {
      collection.push(value)
    } else {
      throw new Error(
        'Illegal call to push, a data object can\'t push ' +
        'into an object or a map.'
      )
    }
  }

  /**
  *
  */
  export function pushIn(tree: any, path: DataPath, value: any): void {
    const elements: Sequence<string | number> = path.elements
    let collection: any = tree

    for (let index = 0, size = elements.size; index < size; ++index) {
      collection = move(collection, elements.get(index))
    }

    push(collection, value)
  }
}
