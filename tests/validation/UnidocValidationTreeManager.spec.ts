import '../jest/sequence'

import { UnidocEvent } from '../../sources/event/UnidocEvent'
import { UnidocBuffer } from '../../sources/buffer/UnidocBuffer'

import { UnidocValidationTreeManager } from '../../sources/validation/UnidocValidationTreeManager'
import { UnidocValidationBranchManager } from '../../sources/validation/UnidocValidationBranchManager'
import { UnidocValidationBranchIdentifier } from '../../sources/validation/UnidocValidationBranchIdentifier'
import { UnidocValidationEvent } from '../../sources/validation/UnidocValidationEvent'

describe('UnidocValidationTreeManager', function() {
  describe('#constructor', function() {
    it('instantiate a new validation tree manager', function() {
      const manager: UnidocValidationTreeManager = new UnidocValidationTreeManager()
      const output: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(manager, UnidocValidationEvent.ALLOCATOR)

      expect(manager.branches.size).toBe(0)
      expect(output.size).toBe(0)
    })
  })

  describe('#produce', function() {
    it('produce an event', function() {
      const manager: UnidocValidationTreeManager = new UnidocValidationTreeManager()
      const output: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(manager, UnidocValidationEvent.ALLOCATOR)
      const branch: UnidocValidationBranchIdentifier = UnidocValidationBranchIdentifier.create().set(5, 10)

      expect(output).toEqualTheSequence([])

      manager.produce(UnidocValidationEvent.create().asCreation())

      expect(output).toEqualTheSequence([
        UnidocValidationEvent.create().ofIndex(0).asCreation()
      ])

      manager.produce(UnidocValidationEvent.create().asFork(branch))

      expect(output).toEqualTheSequence([
        UnidocValidationEvent.create().ofIndex(0).asCreation(),
        UnidocValidationEvent.create().ofIndex(1).asFork(branch)
      ])
    })
  })

  describe('#initialize', function() {
    it('create a trunk and return it', function() {
      const manager: UnidocValidationTreeManager = new UnidocValidationTreeManager()
      const output: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(manager, UnidocValidationEvent.ALLOCATOR)

      const trunk: UnidocValidationBranchManager = manager.initialize()

      expect(manager.branches.size).toBe(1)
      expect(manager.branches.get(0)).toBe(trunk)
      expect(output).toEqualTheSequence([
        UnidocValidationEvent.create().fromBranch(trunk.branch).asCreation()
      ])
    })
  })

  describe('#create', function() {
    it('create a new branch and return it', function() {
      const manager: UnidocValidationTreeManager = new UnidocValidationTreeManager()
      const branches: UnidocValidationBranchManager[] = []
      const output: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(manager, UnidocValidationEvent.ALLOCATOR)
      const expectation: UnidocValidationEvent[] = []

      for (let index = 0; index < 10; ++index) {
        const branch: UnidocValidationBranchManager = manager.create()

        branches.push(branch)

        expectation.push(
          UnidocValidationEvent.create()
            .ofIndex(index)
            .fromBranch(branch.branch)
            .asCreation()
        )

        expect(manager.branches).toBeAnySequenceOf(branches)
      }

      expect(output).toEqualTheSequence(expectation)
    })
  })

  describe('#fork', function() {
    it('fork an existing branch and return it', function() {
      const manager: UnidocValidationTreeManager = new UnidocValidationTreeManager()
      const branches: UnidocValidationBranchManager[] = []
      const output: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(manager, UnidocValidationEvent.ALLOCATOR)
      const expectation: UnidocValidationEvent[] = []

      branches.push(manager.initialize())

      expectation.push(
        UnidocValidationEvent.create()
          .ofIndex(0)
          .fromBranch(branches[0].branch)
          .asCreation()
      )

      for (let index = 0; index < 10; ++index) {
        const branch: UnidocValidationBranchManager = branches[(Math.random() * branches.length) << 0]
        const fork: UnidocValidationBranchManager = manager.fork(branch.branch)

        branches.push(fork)

        expectation.push(
          UnidocValidationEvent.create()
            .ofIndex(index + 1)
            .fromBranch(branch.branch)
            .asFork(fork.branch)
        )

        expect(manager.branches).toBeAnySequenceOf(branches)
      }

      expect(output).toEqualTheSequence(expectation)
    })
  })

  describe('#terminate', function() {
    it('terminate an existing branch', function() {
      const manager: UnidocValidationTreeManager = new UnidocValidationTreeManager()
      const branches: UnidocValidationBranchManager[] = []
      const output: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(manager, UnidocValidationEvent.ALLOCATOR)
      const expectation: UnidocValidationEvent[] = []

      for (let index = 0; index < 10; ++index) {
        const branch: UnidocValidationBranchManager = manager.create()

        branches.push(branch)

        expectation.push(
          UnidocValidationEvent.create()
            .ofIndex(index)
            .fromBranch(branch.branch)
            .asCreation()
        )
      }

      for (let index = 0; index < 10; ++index) {
        const branch: UnidocValidationBranchIdentifier = branches.splice((Math.random() * branches.length) << 0, 1)[0].branch.clone()

        manager.terminate(branch)

        expectation.push(
          UnidocValidationEvent.create()
            .ofIndex(index + 10)
            .fromBranch(branch)
            .asTermination()
        )

        expect(manager.branches).toBeAnySequenceOf(branches)
      }

      expect(output).toEqualTheSequence(expectation)
    })
  })

  describe('#merge', function() {
    it('merge an existing branch', function() {
      const manager: UnidocValidationTreeManager = new UnidocValidationTreeManager()
      const branches: UnidocValidationBranchManager[] = []
      const output: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(manager, UnidocValidationEvent.ALLOCATOR)
      const expectation: UnidocValidationEvent[] = []

      for (let index = 0; index < 10; ++index) {
        const branch: UnidocValidationBranchManager = manager.create()

        branches.push(branch)

        expectation.push(
          UnidocValidationEvent.create()
            .ofIndex(index)
            .fromBranch(branch.branch)
            .asCreation()
        )
      }

      for (let index = 0; index < 9; ++index) {
        const branch: UnidocValidationBranchIdentifier = branches.splice((Math.random() * branches.length) << 0, 1)[0].branch.clone()

        manager.merge(branch, branches[0].branch)

        expectation.push(
          UnidocValidationEvent.create()
            .ofIndex(index + 10)
            .fromBranch(branch)
            .asMerge(branches[0].branch)
        )

        expect(manager.branches).toBeAnySequenceOf(branches)
      }

      expect(output).toEqualTheSequence(expectation)
    })
  })

  describe('#complete', function() {
    it('terminate the entire tree', function() {
      const manager: UnidocValidationTreeManager = new UnidocValidationTreeManager()
      const branches: UnidocValidationBranchManager[] = []
      const output: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(manager, UnidocValidationEvent.ALLOCATOR)
      const expectation: UnidocValidationEvent[] = []

      for (let index = 0; index < 10; ++index) {
        const branch: UnidocValidationBranchManager = manager.create()
        branches.push(branch)
        expectation.push(
          UnidocValidationEvent.create().fromBranch(branch.branch).asTermination()
        )
      }

      output.clear()
      manager.complete()

      for (let index = 0; index < output.size; ++index) {
        expect(output.get(index).index).toBe(10 + index)
        output.get(index).index = 0
      }

      expect(output).toBeAnySequenceOfElementsEqualsTo(expectation)
    })
  })
})
