import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocSymbol } from '../symbol/UnidocSymbol'
import { UnidocOrigin } from '../origin/UnidocOrigin'

import { UnidocPublisher } from '../stream/UnidocPublisher'

import { UnidocImportationResolver } from './UnidocImportationResolver'
import { UnidocContextState } from './UnidocContextState'

import { UnidocResource } from './UnidocResource'
import { UnidocImportation } from './UnidocImportation'

/**
 * 
 */
export class UnidocContext extends UnidocPublisher<UnidocSymbol> {
  /**
   *
   */
  private readonly _resources: Pack<UnidocResource>

  /**
   *
   */
  private readonly _symbol: UnidocSymbol

  /**
   *
   */
  private readonly _import: UnidocImportation

  /**
   *
   */
  private readonly _resolver: UnidocImportationResolver

  /**
   *
   */
  private _state: UnidocContextState

  /**
   * 
   */
  private _oldState: UnidocContextState

  /**
   * 
   * @param resolver 
   */
  public constructor(resolver: UnidocImportationResolver) {
    super()

    this._resources = Pack.any(16)
    this._import = new UnidocImportation()
    this._symbol = new UnidocSymbol()
    this._resolver = resolver
    this._state = UnidocContextState.CREATED
    this._oldState = UnidocContextState.CREATED

    this.executeImport = this.executeImport.bind(this)
    this.fail = this.fail.bind(this)
  }

  /**
   * 
   */
  protected startIfNecessary(): void {
    if (this._state === UnidocContextState.CREATED) {
      this.output.start()
      this._state = UnidocContextState.RUNNING
    }
  }

  /**
   * 
   */
  public import(resource: string): void
  /**
   * 
   */
  public import(importation: UnidocImportation): void
  /**
   * 
   */
  public import(parameter: string | UnidocImportation): void {
    if (typeof parameter === 'string') {
      this._import.resource = parameter
      this._import.origin.at(UnidocOrigin.runtime())
      this.resolveImport(this._import)
    } else {
      this.resolveImport(parameter)
    }
  }

  /**
   * 
   */
  private resolveImport(importation: UnidocImportation): void {
    this._oldState = this._state
    this._state = UnidocContextState.IMPORTING
    this._resolver
      .resolve(importation)
      .then(this.executeImport)
      .catch(this.fail)
  }

  /**
   * 
   */
  private executeImport(resource: UnidocResource): void {
    this._state = this._oldState
    this.stream(resource)
  }

  /**
   * 
   */
  public stream(resource: UnidocResource): void {
    this.assertThatThereIsNoCircularDependency(resource)
    this.startIfNecessary()

    this._resources.push(resource)

    while (this.running && this._state === UnidocContextState.RUNNING) {
      this.next()
    }

    if (this._state === UnidocContextState.RUNNING) {
      this._state = UnidocContextState.COMPLETED
      this.output.success()
    }
  }

  /**
   * 
   */
  private assertThatThereIsNoCircularDependency(resource: UnidocResource): void {
    for (const existingResource of this._resources) {
      if (existingResource.resource === resource.resource) {
        throw new Error(
          'Unable to stream resource ' + resource.resource + ' imported from ' +
          resource.origin.origin.toString() + ' because there is a circular ' +
          'dependency : ' +
          [...this._resources].map(x => x.resource).join(' > ') +
          ' > ' + resource.resource + '.'
        )
      }
    }
  }

  /**
   * 
   */
  public fail(error: Error): void {
    this.output.fail(error)
  }

  /**
   * 
   */
  public get running(): boolean {
    return this._resources.size > 0
  }

  /**
   * 
   */
  private next(): void {
    const next: UnidocSymbol = this._resources.last.reader.next()!
    this._symbol.code = next.code

    while (this._resources.size > 0 && !this._resources.last.reader.running) {
      this._resources.pop()
    }

    this.output.next(next)
  }
}
