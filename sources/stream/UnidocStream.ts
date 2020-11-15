import { Pack } from '@cedric-demongivert/gl-tool-collection'

import { UnidocSymbol } from '../symbol/UnidocSymbol'
import { UnidocOrigin } from '../origin/UnidocOrigin'

import { ListenableUnidocProducer } from '../producer/ListenableUnidocProducer'

import { UnidocImportationResolver } from './UnidocImportationResolver'
import { UnidocStreamState } from './UnidocStreamState'

import { UnidocResource } from './UnidocResource'
import { UnidocImportation } from './UnidocImportation'

export class UnidocStream extends ListenableUnidocProducer<UnidocSymbol> {
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
  private _state: UnidocStreamState

  private _oldState: UnidocStreamState

  public constructor(resolver: UnidocImportationResolver) {
    super()

    this._resources = Pack.any(16)
    this._import = new UnidocImportation()
    this._symbol = new UnidocSymbol()
    this._resolver = resolver
    this._state = UnidocStreamState.CREATED
    this._oldState = UnidocStreamState.CREATED

    this.executeImport = this.executeImport.bind(this)
    this.fail = this.fail.bind(this)
  }

  protected initializeIfNecessary(): void {
    if (this._state === UnidocStreamState.CREATED) {
      this.initialize()
      this._state = UnidocStreamState.RUNNING
    }
  }

  public import(resource: string): void
  public import(importation: UnidocImportation): void
  public import(parameter: string | UnidocImportation): void {
    if (typeof parameter === 'string') {
      this._import.resource = parameter
      this._import.origin.at(UnidocOrigin.runtime())
      this.resolveImport(this._import)
    } else {
      this.resolveImport(parameter)
    }
  }

  private resolveImport(importation: UnidocImportation): void {
    this._oldState = this._state
    this._state = UnidocStreamState.IMPORTING
    this._resolver
      .resolve(importation)
      .then(this.executeImport)
      .catch(this.fail)
  }

  private executeImport(resource: UnidocResource): void {
    this._state = this._oldState
    this.stream(resource)
  }

  public stream(resource: UnidocResource): void {
    this.assertThatThereIsNoCircularDependency(resource)
    this.initializeIfNecessary()

    this._resources.push(resource)

    while (this.hasNext() && this._state === UnidocStreamState.RUNNING) {
      this.next()
    }

    if (this._state === UnidocStreamState.RUNNING) {
      this._state = UnidocStreamState.COMPLETED
      this.complete()
    }
  }

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

  public fail(error: Error): void {
    super.fail(error)
  }

  private hasNext(): boolean {
    return this._resources.size > 0
  }

  private next(): void {
    const next: UnidocSymbol = this._resources.last.reader.next()
    this._symbol.symbol = next.symbol

    while (this._resources.size > 0 && !this._resources.last.reader.hasNext()) {
      this._resources.pop()
    }

    this.produce(next)
  }
}
