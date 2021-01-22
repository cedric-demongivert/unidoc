import { Sequence } from '@cedric-demongivert/gl-tool-collection'
import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocNFAValidationTree } from './UnidocNFAValidationTree'

import { UnidocKissValidator } from '../kiss/UnidocKissValidator'

export class UnidocNFAValidationProcess {
  /**
  *
  */
  public process: UnidocKissValidator

  /**
  *
  */
  public branch: UnidocNFAValidationTree | null

  /**
  *
  */
  public constructor() {
    this.process = UnidocKissValidator.validateEpsilon()
    this.branch = null
  }

  /**
  *
  */
  public clear(): void {
    this.process = UnidocKissValidator.validateEpsilon()
    this.branch = null
  }
}

export namespace UnidocNFAValidationProcess {
  /**
  *
  */
  export function create(): UnidocNFAValidationProcess {
    return new UnidocNFAValidationProcess()
  }

  /**
  *
  */
  export const ALLOCATOR: Allocator<UnidocNFAValidationProcess> = Allocator.fromFactory(create)
}
