import { nothing } from '@cedric-demongivert/gl-tool-utils'

import { UnidocConsumer } from '../stream'
import { UnidocSymbol } from '../symbol/UnidocSymbol'

import { UnidocImportResolver } from './UnidocImportResolver'
import { UnidocResource } from './UnidocResource'
import { UnidocImport } from './UnidocImport'
import { UnidocImportPromise } from './UnidocImportPromise'

/**
 * 
 */
export class UnidocContext {
  /**
   *
   */
  private readonly _stack: Array<UnidocResource>

  /**
   *
   */
  private readonly _resolver: UnidocImportResolver

  /**
   *
   */
  private _importing: UnidocImportPromise | null

  /**
   *
   */
  private _consumer: UnidocConsumer<UnidocSymbol> | null

  /**
   *
   */
  private _feeding: Promise<void> | null

  /**
   * 
   * @param resolver 
   */
  public constructor(resolver: UnidocImportResolver) {
    this._stack = []
    this._resolver = resolver
    this._importing = null
    this._feeding = null
    this._consumer = null

    this.handleImportSuccess.bind(this)
    this.handleImportFailure.bind(this)
  }

  /**
   * 
   */
  public get running(): boolean {
    return this._importing == null
  }

  /**
   * 
   */
  public import(resource: UnidocImport): Promise<UnidocResource> {
    if (this._consumer == null) {
      throw new Error(
        `Illegal import call. Trying to import resource ${resource.toString()} before or after a ` +
        'feeding attempt. Use the feed method instead.'
      )
    }

    try {
      const result: Promise<UnidocResource> | UnidocResource = this._resolver.resolve(resource)

      if (result instanceof Promise) {
        this._importing = new UnidocImportPromise(this._importing, result)
      } else if (this._importing == null) {
        this.assertThatThereIsNoCircularDependency(result)
        return Promise.resolve(result)
      } else {
        this._importing = new UnidocImportPromise(this._importing, Promise.resolve(result))
      }

      this._importing.then(this.handleImportSuccess, this.handleImportFailure)
      return this._importing.asPromise()
    } catch (error) {
      throw error
    }
  }

  /**
   * 
   */
  private handleImportSuccess(resource: UnidocResource): void {
    this.assertThatThereIsNoCircularDependency(resource)
    this._stack.push(resource)

    if (this._importing.resolved) {
      this._importing = null
      this.execute()
    }
  }

  /**
   * 
   */
  private handleImportFailure(error: Error): void {
    throw error
  }

  /**
   * 
   */
  private execute(): void {
    const stack: Array<UnidocResource> = this._stack
    const consumer: UnidocConsumer<UnidocSymbol> = this._consumer!

    while (stack.length > 0 && this._importing == null) {
      const resource: UnidocResource = stack[stack.length - 1]

      while (resource.hasNext() && this._importing == null) {
        consumer.next(resource.next())
      }
    }

    if (stack.length === 0) {
      this.handleFeedingSuccess()
    }
  }

  /**
   * 
   */
  public feed(resource: UnidocImport, consumer: UnidocConsumer<UnidocSymbol>): Promise<void> {
    if (this._consumer != null) {
      throw new Error('Trying to feed multiple consumers in parrallel with the same context instance.')
    }

    this._feeding = new Promise(nothing)
    this._consumer = consumer

    consumer.start()

    this.import(resource)

    if (this._importing == null) {
      this.execute()
    }

    return this._feeding
  }

  /**
   * 
   */
  public handleFeedingSuccess(): void {
    this._consumer.success()
    this._consumer = null

    const promise: Promise<void> = this._feeding
    this._feeding = null

    Promise.resolve(promise)
  }

  /**
   * 
   */
  private assertThatThereIsNoCircularDependency(resource: UnidocResource): void {
    for (const existingResource of this._stack) {
      if (existingResource.import.equals(resource.import)) {
        throw new Error(
          `Unable to stream resource ${resource.import.scheme}://${resource.import.identifier} of type ${resource.import.mime} (` +
          `${resource.import.origin.toString()}) because there is a circular dependency : ` +
          this._stack.map(x => `${x.import.scheme}://${x.import.identifier} of type ${x.import.mime} (${x.import.origin.toString()})`).join(' > ') +
          ` > ${resource.import.scheme}://${resource.import.identifier} of type ${resource.import.mime} (` +
          `${resource.import.origin.toString()}).`
        )
      }
    }
  }
}
