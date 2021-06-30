

import { UnidocPublisher } from '../stream/UnidocPublisher'
import { UnidocOrigin } from '../origin/UnidocOrigin'

import { UnidocImportation } from './UnidocImportation'

/**
 * 
 */
export class UnidocImportationProducer extends UnidocPublisher<UnidocImportation> {
  /**
   * 
   */
  private readonly _importation: UnidocImportation

  /**
   * Instantiate a new unidoc event.
   */
  public constructor() {
    super()
    this._importation = new UnidocImportation()
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
  public start(): void {
    this.output.start()
  }

  public ofResource(resource: string): UnidocImportationProducer {
    this._importation.resource = resource
    return this
  }

  public at(origin: UnidocOrigin): UnidocImportationProducer {
    this._importation.origin.from.copy(origin)
    this._importation.origin.to.copy(origin)
    return this
  }

  public from(): UnidocOrigin
  public from(origin: UnidocOrigin): UnidocImportationProducer
  public from(origin?: UnidocOrigin): UnidocOrigin | UnidocImportationProducer {
    if (origin) {
      this._importation.origin.from.copy(origin)
      return this
    } else {
      this._importation.origin.from.clear()
      return this._importation.origin.from
    }
  }

  public to(): UnidocOrigin
  public to(origin: UnidocOrigin): UnidocImportationProducer
  public to(origin?: UnidocOrigin): UnidocOrigin | UnidocImportationProducer {
    if (origin) {
      this._importation.origin.to.copy(origin)
      return this
    } else {
      this._importation.origin.to.clear()
      return this._importation.origin.to
    }
  }


  /**
   * 
   */
  public next(event: UnidocImportation = this._importation): void {
    this.output.next(event)
  }

  /**
   * 
   */
  public success(): void {
    this.output.success()
  }

  /**
   * 
   */
  public clear(): void {
    this._importation.clear()
    this.off()
  }
}

/**
 * 
 */
export namespace UnidocImportationProducer {
  /**
   * 
   */
  export function create(): UnidocImportationProducer {
    return new UnidocImportationProducer()
  }
}
