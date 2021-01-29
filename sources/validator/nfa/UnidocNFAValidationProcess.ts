import { Allocator } from '@cedric-demongivert/gl-tool-collection'

import { UnidocValidationEvent } from '../../validation/UnidocValidationEvent'

import { UnidocKissValidator } from '../kiss/UnidocKissValidator'

import { UnidocNFAValidationTree } from './UnidocNFAValidationTree'

/**
*
*/
export class UnidocNFAValidationProcess {
  /**
  *
  */
  public process: UnidocKissValidator

  /**
  *
  */
  public head: UnidocNFAValidationTree

  /**
  *
  */
  public relationship: number

  /**
  *
  */
  public constructor() {
    this.process = UnidocKissValidator.validateEpsilon()
    this.head = UnidocNFAValidationTree.ALLOCATOR.allocate().asHead()
    this.relationship = 0
  }

  /**
  *
  */
  public push(event: UnidocValidationEvent): UnidocNFAValidationProcess {
    const previousHead: UnidocNFAValidationTree = this.head
    this.head = UnidocNFAValidationTree.ALLOCATOR.allocate().asHead()

    previousHead.asEvent(event)
    this.head.parent = previousHead

    return this
  }

  /**
  *
  */
  public clear(): void {
    this.process = UnidocKissValidator.validateEpsilon()
    this.relationship = 0

    const oldHead: UnidocNFAValidationTree = this.head
    this.head = UnidocNFAValidationTree.ALLOCATOR.allocate().asHead()
    UnidocNFAValidationTree.cut(oldHead)
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
