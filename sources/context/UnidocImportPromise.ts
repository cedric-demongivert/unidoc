import { UnidocResource } from "./UnidocResource"

/**
 * 
 */
export class UnidocImportPromise {
  /**
   * 
   */
  private readonly _promise: Promise<UnidocResource>

  /**
   * 
   */
  private _resolved: boolean

  /**
   * 
   */
  public get resolved(): boolean {
    return this._resolved
  }

  /**
   * 
   */
  public constructor(occuring: UnidocImportPromise | null | undefined, promise: Promise<UnidocResource>) {
    this._promise = this.handlePromise(occuring, promise)
    this._resolved = false
  }

  /**
   * 
   */
  private async handlePromise(occuring: UnidocImportPromise | null | undefined, promise: Promise<UnidocResource>): Promise<UnidocResource> {
    if (occuring) {
      await occuring._promise
    }

    const result: UnidocResource = await promise
    this._resolved = true
    return result
  }

  /**
   * 
   */
  public then(successListener: (resource: UnidocResource) => void, rejectionListener?: (error: Error) => void): this {
    if (rejectionListener) {
      this._promise.then(successListener, rejectionListener)
    } else {
      this._promise.then(successListener)
    }
    return this
  }

  /**
   * 
   */
  public asPromise(): Promise<UnidocResource> {
    return this._promise
  }
}