import '../jest/sequence'

import { UnidocEvent } from '../../sources/event/UnidocEvent'
import { UnidocBuffer } from '../../sources/buffer/UnidocBuffer'

import { UnidocValidationTrunkSelector } from '../../sources/validation/UnidocValidationTrunkSelector'
import { UnidocValidationTreeManager } from '../../sources/validation/UnidocValidationTreeManager'
import { UnidocValidationBranchManager } from '../../sources/validation/UnidocValidationBranchManager'
import { UnidocValidationBranchIdentifier } from '../../sources/validation/UnidocValidationBranchIdentifier'
import { UnidocValidationEvent } from '../../sources/validation/UnidocValidationEvent'
import { UnidocValidationMessage } from '../../sources/validation/UnidocValidationMessage'

describe('UnidocValidationTrunkSelector', function() {
  const ROOT_BRANCH: UnidocValidationBranchIdentifier = new UnidocValidationBranchIdentifier()
  ROOT_BRANCH.set(0, 0)

  describe('#constructor', function() {
    it('instantiate a new validation trunk selector', function() {
      const selector: UnidocValidationTrunkSelector = new UnidocValidationTrunkSelector()
      const output: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(selector, UnidocValidationEvent.ALLOCATOR)

      expect(output).toBeTheSequence([])
    })
  })

  describe('selection', function() {
    it('emit the occuring branch when only one validation branch exists', function() {
      const manager: UnidocValidationTreeManager = new UnidocValidationTreeManager()
      const selector: UnidocValidationTrunkSelector = new UnidocValidationTrunkSelector()
      const output: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(selector, UnidocValidationEvent.ALLOCATOR)

      selector.subscribe(manager)

      expect(output).toBeTheSequence([])

      const trunk: UnidocValidationBranchManager = manager.initialize()

      expect(output).toEqualTheSequence([
        UnidocValidationEvent.create().fromBranch(ROOT_BRANCH).asCreation()
      ])

      trunk.validate(UnidocEvent.create().ofIndex(0))

      expect(output).toEqualTheSequence([
        UnidocValidationEvent.create().ofIndex(0).fromBranch(ROOT_BRANCH).asCreation(),
        UnidocValidationEvent.create().ofIndex(1).ofBatch(1).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(0))
      ])

      trunk.validate(UnidocEvent.create().ofIndex(1))

      expect(output).toEqualTheSequence([
        UnidocValidationEvent.create().ofIndex(0).fromBranch(ROOT_BRANCH).asCreation(),
        UnidocValidationEvent.create().ofIndex(1).ofBatch(1).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(0)),
        UnidocValidationEvent.create().ofIndex(2).ofBatch(2).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(1))
      ])

      trunk.message(UnidocValidationMessage.create().asInformation())

      expect(output).toEqualTheSequence([
        UnidocValidationEvent.create().ofIndex(0).fromBranch(ROOT_BRANCH).asCreation(),
        UnidocValidationEvent.create().ofIndex(1).ofBatch(1).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(0)),
        UnidocValidationEvent.create().ofIndex(2).ofBatch(2).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(1)),
        UnidocValidationEvent.create().ofIndex(3).ofBatch(2).fromBranch(ROOT_BRANCH).asMessage(UnidocValidationMessage.create().asInformation())
      ])
    })

    it('await for the termination of a branch after a fork', function() {
      const manager: UnidocValidationTreeManager = new UnidocValidationTreeManager()
      const selector: UnidocValidationTrunkSelector = new UnidocValidationTrunkSelector()
      const output: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(selector, UnidocValidationEvent.ALLOCATOR)

      selector.subscribe(manager)

      expect(output).toBeTheSequence([])

      const trunk: UnidocValidationBranchManager = manager.initialize()

      expect(output).toEqualTheSequence([
        UnidocValidationEvent.create().fromBranch(ROOT_BRANCH).asCreation()
      ])

      trunk.validate(UnidocEvent.create().ofIndex(0))

      expect(output).toEqualTheSequence([
        UnidocValidationEvent.create().ofIndex(0).fromBranch(ROOT_BRANCH).asCreation(),
        UnidocValidationEvent.create().ofIndex(1).ofBatch(1).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(0))
      ])

      const fork: UnidocValidationBranchManager = trunk.fork()

      trunk.validate(UnidocEvent.create().ofIndex(1))
      fork.validate(UnidocEvent.create().ofIndex(1))

      expect(output).toEqualTheSequence([
        UnidocValidationEvent.create().ofIndex(0).fromBranch(ROOT_BRANCH).asCreation(),
        UnidocValidationEvent.create().ofIndex(1).ofBatch(1).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(0)),
      ])

      trunk.message(UnidocValidationMessage.create().asInformation())
      fork.message(UnidocValidationMessage.create().asInformation())

      expect(output).toEqualTheSequence([
        UnidocValidationEvent.create().ofIndex(0).fromBranch(ROOT_BRANCH).asCreation(),
        UnidocValidationEvent.create().ofIndex(1).ofBatch(1).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(0)),
      ])
    })

    it('return the main branch when a fork terminate and when the main branch continue to validate events', function() {
      const manager: UnidocValidationTreeManager = new UnidocValidationTreeManager()
      const selector: UnidocValidationTrunkSelector = new UnidocValidationTrunkSelector()
      const output: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(selector, UnidocValidationEvent.ALLOCATOR)

      selector.subscribe(manager)

      expect(output).toBeTheSequence([])

      const trunk: UnidocValidationBranchManager = manager.initialize()

      trunk.validate(UnidocEvent.create().ofIndex(0))

      const fork: UnidocValidationBranchManager = trunk.fork()

      trunk.validate(UnidocEvent.create().ofIndex(1))
      trunk.message(UnidocValidationMessage.create().asError())

      fork.validate(UnidocEvent.create().ofIndex(1))
      fork.message(UnidocValidationMessage.create().asInformation())

      fork.terminate()

      expect(output).toEqualTheSequence([
        UnidocValidationEvent.create().ofIndex(0).fromBranch(ROOT_BRANCH).asCreation(),
        UnidocValidationEvent.create().ofIndex(1).ofBatch(1).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(0)),
      ])

      trunk.validate(UnidocEvent.create().ofIndex(2))

      expect(output).toEqualTheSequence([
        UnidocValidationEvent.create().ofIndex(0).fromBranch(ROOT_BRANCH).asCreation(),
        UnidocValidationEvent.create().ofIndex(1).ofBatch(1).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(0)),
        UnidocValidationEvent.create().ofIndex(2).ofBatch(2).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(1)),
        UnidocValidationEvent.create().ofIndex(3).ofBatch(2).fromBranch(ROOT_BRANCH).asMessage(UnidocValidationMessage.create().asError()),
        UnidocValidationEvent.create().ofIndex(4).ofBatch(3).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(2))
      ])
    })

    it('return the main branch when the trunk terminate and when the fork continue to validate events', function() {
      const manager: UnidocValidationTreeManager = new UnidocValidationTreeManager()
      const selector: UnidocValidationTrunkSelector = new UnidocValidationTrunkSelector()
      const output: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(selector, UnidocValidationEvent.ALLOCATOR)

      selector.subscribe(manager)

      expect(output).toBeTheSequence([])

      const trunk: UnidocValidationBranchManager = manager.initialize()

      trunk.validate(UnidocEvent.create().ofIndex(0))

      const fork: UnidocValidationBranchManager = trunk.fork()

      trunk.validate(UnidocEvent.create().ofIndex(1))
      trunk.message(UnidocValidationMessage.create().asError())

      fork.validate(UnidocEvent.create().ofIndex(1))
      fork.message(UnidocValidationMessage.create().asInformation())

      trunk.terminate()

      expect(output).toEqualTheSequence([
        UnidocValidationEvent.create().ofIndex(0).fromBranch(ROOT_BRANCH).asCreation(),
        UnidocValidationEvent.create().ofIndex(1).ofBatch(1).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(0)),
      ])

      fork.validate(UnidocEvent.create().ofIndex(2))

      expect(output).toEqualTheSequence([
        UnidocValidationEvent.create().ofIndex(0).fromBranch(ROOT_BRANCH).asCreation(),
        UnidocValidationEvent.create().ofIndex(1).ofBatch(1).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(0)),
        UnidocValidationEvent.create().ofIndex(2).ofBatch(2).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(1)),
        UnidocValidationEvent.create().ofIndex(3).ofBatch(2).fromBranch(ROOT_BRANCH).asMessage(UnidocValidationMessage.create().asInformation()),
        UnidocValidationEvent.create().ofIndex(4).ofBatch(3).fromBranch(ROOT_BRANCH).asValidation(UnidocEvent.create().ofIndex(2))
      ])
    })
  })
})
