import { UnidocState } from './UnidocState'

export class UnidocStateMap<T> {
  private _data: Map<string | number, T>

  public get size(): number {
    return this._data.size
  }

  public constructor() {
    this._data = new Map()
  }

  public set(state: UnidocState, value: T): void {
    // En attendant d'avoir mieux.
    const key: string = state.toHexadecimalString()
    this._data.set(key, value)
  }

  public has(state: UnidocState): boolean {
    // En attendant d'avoir mieux.
    return this._data.has(state.toHexadecimalString())
  }

  public get(state: UnidocState): T | undefined {
    return this._data.get(state.toHexadecimalString())
  }

  public delete(state: UnidocState): void {
    this._data.delete(state.toHexadecimalString())
  }

  public clear(): void {
    this._data.clear()
  }

  public values(): Iterator<T> {
    return this._data.values()
  }
}
