import '../../jest/sequence'

import { UnidocBlueprint } from '../../../sources/blueprint/UnidocBlueprint'

import { UnidocValidationEvent } from '../../../sources/validation/UnidocValidationEvent'
import { UnidocValidationEventProducer } from '../../../sources/validation/UnidocValidationEventProducer'
import { UnidocValidationMessageBuilder } from '../../../sources/validation/UnidocValidationMessageBuilder'
import { UnidocBuffer } from '../../../sources/buffer/UnidocBuffer'
import { UnidocEvent } from '../../../sources/event/UnidocEvent'
import { TrackedUnidocEventProducer } from '../../../sources/event/TrackedUnidocEventProducer'

import { UnidocKissValidator } from '../../../sources/validator/kiss/UnidocKissValidator'
import { UnidocValidator } from '../../../sources/validator/UnidocValidator'
import { UnidocNFAValidationGraph } from '../../../sources/validator/nfa/UnidocNFAValidationGraph'
import { UnidocNFAValidationGraphResolver } from '../../../sources/validator/nfa/UnidocNFAValidationGraphResolver'


import { ExpectedContent } from '../../../sources/validator/message/ExpectedContent'

/*
import { RequiredContent } from '../../../sources/validator/blueprint/messages/RequiredContent'
import { UnnecessaryContent } from '../../../sources/validator/blueprint/messages/UnnecessaryContent'
import { PreferredContent } from '../../../sources/validator/blueprint/messages/PreferredContent'
*/

describe('UnidocNFAGraphValidator', function() {
  describe('validation of sequences', function() {
    it('accept a sequence of element', function() {
      const graph: UnidocNFAValidationGraph = (
        new UnidocNFAValidationGraph()
          .builder()
          .then(UnidocKissValidator.validateStartOfTag.factory('red'))
          .then(UnidocKissValidator.validateStartOfTag.factory('green'))
          .then(UnidocKissValidator.validateStartOfTag.factory('blue'))
          .then(UnidocKissValidator.validateEnd)
          .match()
      )

      const validator: UnidocValidator = UnidocValidator.graph(graph)
      const validatorBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(validator, UnidocValidationEvent.ALLOCATOR)
      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(input, UnidocEvent.ALLOCATOR)

      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .produceTagStart('green')
        .produceTagStart('blue')
        .complete()

      const expectation: UnidocValidationEventProducer = new UnidocValidationEventProducer()
      const expectationBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(expectation, UnidocValidationEvent.ALLOCATOR)

      expectation.initialize()
      expectation.produceValidation(inputBuffer.get(0))
      expectation.produceValidation(inputBuffer.get(1))
      expectation.produceValidation(inputBuffer.get(2))
      expectation.produceDocumentCompletion()

      expect(validatorBuffer).toEqualTheSequence(expectationBuffer)
    })

    it('emit an error when the sequence is unnordered', function() {
      const graph: UnidocNFAValidationGraph = (
        new UnidocNFAValidationGraph()
          .builder()
          .then(UnidocKissValidator.validateStartOfTag.factory('red'))
          .then(UnidocKissValidator.validateStartOfTag.factory('green'))
          .then(UnidocKissValidator.validateStartOfTag.factory('blue'))
          .then(UnidocKissValidator.validateEnd)
          .match()
      )

      const validator: UnidocValidator = UnidocValidator.graph(graph)
      const validatorBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(validator, UnidocValidationEvent.ALLOCATOR)
      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(input, UnidocEvent.ALLOCATOR)

      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .produceTagStart('blue')
        .produceTagStart('green')
        .complete()

      const expectation: UnidocValidationEventProducer = new UnidocValidationEventProducer()
      const expectationBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(expectation, UnidocValidationEvent.ALLOCATOR)

      expectation.initialize()
      expectation.produceValidation(inputBuffer.get(0))
      expectation.produceValidation(inputBuffer.get(1))
      expectation.produceMessage(
        UnidocValidationMessageBuilder.get()
          .setType(ExpectedContent.TYPE)
          .setCode(ExpectedContent.CODE)
          .setData(ExpectedContent.Data.BLUEPRINT, UnidocBlueprint.tagStart('blue'))
          .get()
      )

      expect(validatorBuffer).toEqualTheSequence(expectationBuffer)
    })

    it('emit an error when an element of the sequence is missing', function() {
      const graph: UnidocNFAValidationGraph = (
        new UnidocNFAValidationGraph()
          .builder()
          .then(UnidocKissValidator.validateStartOfTag.factory('red'))
          .then(UnidocKissValidator.validateStartOfTag.factory('green'))
          .then(UnidocKissValidator.validateStartOfTag.factory('blue'))
          .then(UnidocKissValidator.validateEnd)
          .match()
      )

      const validator: UnidocValidator = UnidocValidator.graph(graph)
      const validatorBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(validator, UnidocValidationEvent.ALLOCATOR)
      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(input, UnidocEvent.ALLOCATOR)

      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .produceTagStart('green')
        .complete()

      const expectation: UnidocValidationEventProducer = new UnidocValidationEventProducer()
      const expectationBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(expectation, UnidocValidationEvent.ALLOCATOR)

      expectation.initialize()
      expectation.produceValidation(inputBuffer.get(0))
      expectation.produceValidation(inputBuffer.get(1))
      expectation.produceDocumentCompletion()
      expectation.produceMessage(
        UnidocValidationMessageBuilder.get()
          .setType(ExpectedContent.TYPE)
          .setCode(ExpectedContent.CODE)
          .setData(ExpectedContent.Data.BLUEPRINT, UnidocBlueprint.tagStart('blue'))
          .get()
      )

      expect(validatorBuffer).toEqualTheSequence(expectationBuffer)
    })

    it('emit an error when an element of the sequence is invalid', function() {
      const graph: UnidocNFAValidationGraph = (
        new UnidocNFAValidationGraph()
          .builder()
          .then(UnidocKissValidator.validateStartOfTag.factory('red'))
          .then(UnidocKissValidator.validateStartOfTag.factory('green'))
          .then(UnidocKissValidator.validateStartOfTag.factory('blue'))
          .then(UnidocKissValidator.validateEnd)
          .match()
      )

      const validator: UnidocValidator = UnidocValidator.graph(graph)
      const validatorBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(validator, UnidocValidationEvent.ALLOCATOR)
      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(input, UnidocEvent.ALLOCATOR)

      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .produceTagStart('yellow')
        .produceTagStart('green')
        .complete()

      const expectation: UnidocValidationEventProducer = new UnidocValidationEventProducer()
      const expectationBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(expectation, UnidocValidationEvent.ALLOCATOR)

      expectation.initialize()
      expectation.produceValidation(inputBuffer.get(0))
      expectation.produceValidation(inputBuffer.get(1))
      expectation.produceMessage(
        UnidocValidationMessageBuilder.get()
          .setType(ExpectedContent.TYPE)
          .setCode(ExpectedContent.CODE)
          .setData(ExpectedContent.Data.BLUEPRINT, UnidocBlueprint.tagStart('green'))
          .get()
      )

      expect(validatorBuffer).toEqualTheSequence(expectationBuffer)
    })
  })

  describe('validation of optional content', function() {
    it('accept a sequence with the optional content', function() {
      const graph: UnidocNFAValidationGraph = (
        new UnidocNFAValidationGraph()
          .builder()
          .then(UnidocKissValidator.validateStartOfTag.factory('red'))
          .optional(UnidocKissValidator.validateStartOfTag.factory('green'))
          .then(UnidocKissValidator.validateStartOfTag.factory('blue'))
          .then(UnidocKissValidator.validateEnd)
          .match()
      )

      const validator: UnidocValidator = UnidocValidator.graph(graph)
      const validatorBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(validator, UnidocValidationEvent.ALLOCATOR)
      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(input, UnidocEvent.ALLOCATOR)

      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .produceTagStart('green')
        .produceTagStart('blue')
        .complete()

      const expectation: UnidocValidationEventProducer = new UnidocValidationEventProducer()
      const expectationBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(expectation, UnidocValidationEvent.ALLOCATOR)

      expectation.initialize()
      expectation.produceValidation(inputBuffer.get(0))
      expectation.produceValidation(inputBuffer.get(1))
      expectation.produceValidation(inputBuffer.get(2))
      expectation.produceDocumentCompletion()

      expect(validatorBuffer).toEqualTheSequence(expectationBuffer)
    })

    it('accept a sequence without the optional content', function() {
      const graph: UnidocNFAValidationGraph = (
        new UnidocNFAValidationGraph()
          .builder()
          .then(UnidocKissValidator.validateStartOfTag.factory('red'))
          .optional(UnidocKissValidator.validateStartOfTag.factory('green'))
          .then(UnidocKissValidator.validateStartOfTag.factory('blue'))
          .then(UnidocKissValidator.validateEnd)
          .match()
      )

      const validator: UnidocValidator = UnidocValidator.graph(graph)
      const validatorBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(validator, UnidocValidationEvent.ALLOCATOR)
      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(input, UnidocEvent.ALLOCATOR)

      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .produceTagStart('blue')
        .complete()

      const expectation: UnidocValidationEventProducer = new UnidocValidationEventProducer()
      const expectationBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(expectation, UnidocValidationEvent.ALLOCATOR)

      expectation.initialize()
      expectation.produceValidation(inputBuffer.get(0))
      expectation.produceValidation(inputBuffer.get(1))
      expectation.produceDocumentCompletion()

      expect(validatorBuffer).toEqualTheSequence(expectationBuffer)
    })

    it('emit an error when an illegal content is given in replacement of the optional content', function() {
      const graph: UnidocNFAValidationGraph = (
        new UnidocNFAValidationGraph()
          .builder()
          .then(UnidocKissValidator.validateStartOfTag.factory('red'))
          .then(UnidocKissValidator.validateStartOfTag.factory('green'))
          .then(UnidocKissValidator.validateStartOfTag.factory('blue'))
          .then(UnidocKissValidator.validateEnd)
          .match()
      )

      const validator: UnidocValidator = UnidocValidator.graph(graph)
      const validatorBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(validator, UnidocValidationEvent.ALLOCATOR)
      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(input, UnidocEvent.ALLOCATOR)

      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .produceTagStart('yellow')
        .produceTagStart('blue')
        .complete()

      const expectation: UnidocValidationEventProducer = new UnidocValidationEventProducer()
      const expectationBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(expectation, UnidocValidationEvent.ALLOCATOR)

      expectation.initialize()
      expectation.produceValidation(inputBuffer.get(0))
      expectation.produceValidation(inputBuffer.get(1))
      expectation.produceMessage(
        UnidocValidationMessageBuilder.get()
          .setType(ExpectedContent.TYPE)
          .setCode(ExpectedContent.CODE)
          .setData(ExpectedContent.Data.BLUEPRINT, UnidocBlueprint.tagStart('green'))
          .get()
      )

      expect(validatorBuffer).toEqualTheSequence(expectationBuffer)
    })
  })

  describe('validation of an arbitrary repeatition of content', function() {
    it('accept an arbitrary repeatition of a given content', function() {
      const graph: UnidocNFAValidationGraph = (
        new UnidocNFAValidationGraph()
          .builder()
          .many(UnidocKissValidator.validateStartOfTag.factory('green'))
          .then(UnidocKissValidator.validateEnd)
          .match()
      )

      const validator: UnidocValidator = UnidocValidator.graph(graph)
      const validatorBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(validator, UnidocValidationEvent.ALLOCATOR)
      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(input, UnidocEvent.ALLOCATOR)

      validator.subscribe(input)

      input.initialize()
        .produceTagStart('green')
        .produceTagStart('green')
        .produceTagStart('green')
        .produceTagStart('green')
        .produceTagStart('green')
        .complete()

      const expectation: UnidocValidationEventProducer = new UnidocValidationEventProducer()
      const expectationBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(expectation, UnidocValidationEvent.ALLOCATOR)

      expectation.initialize()
      expectation.produceValidation(inputBuffer.get(0))
      expectation.produceValidation(inputBuffer.get(1))
      expectation.produceValidation(inputBuffer.get(2))
      expectation.produceValidation(inputBuffer.get(3))
      expectation.produceValidation(inputBuffer.get(4))
      expectation.produceDocumentCompletion()

      expect(validatorBuffer).toEqualTheSequence(expectationBuffer)
    })

    it('accept nothing', function() {
      const graph: UnidocNFAValidationGraph = (
        new UnidocNFAValidationGraph()
          .builder()
          .many(UnidocKissValidator.validateStartOfTag.factory('green'))
          .then(UnidocKissValidator.validateEnd)
          .match()
      )

      const validator: UnidocValidator = UnidocValidator.graph(graph)
      const validatorBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(validator, UnidocValidationEvent.ALLOCATOR)
      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()

      validator.subscribe(input)

      input.initialize().complete()

      const expectation: UnidocValidationEventProducer = new UnidocValidationEventProducer()
      const expectationBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(expectation, UnidocValidationEvent.ALLOCATOR)

      expectation.initialize()
      expectation.produceDocumentCompletion()

      expect(validatorBuffer).toEqualTheSequence(expectationBuffer)
    })

    it('reject a sequence when it can\'t validate it further', function() {
      const graph: UnidocNFAValidationGraph = (
        new UnidocNFAValidationGraph()
          .builder()
          .many(UnidocKissValidator.validateStartOfTag.factory('green'))
          .then(UnidocKissValidator.validateEnd)
          .match()
      )

      const validator: UnidocValidator = UnidocValidator.graph(graph)
      const validatorBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(validator, UnidocValidationEvent.ALLOCATOR)
      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(input, UnidocEvent.ALLOCATOR)

      validator.subscribe(input)

      input.initialize()
        .produceTagStart('green')
        .produceTagStart('green')
        .produceTagStart('yellow')
        .produceTagStart('green')
        .produceTagStart('green')
        .complete()

      const expectation: UnidocValidationEventProducer = new UnidocValidationEventProducer()
      const expectationBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(expectation, UnidocValidationEvent.ALLOCATOR)

      expectation.initialize()
      expectation.produceValidation(inputBuffer.get(0))
      expectation.produceValidation(inputBuffer.get(1))
      expectation.produceValidation(inputBuffer.get(2))
      expectation.produceMessage(
        UnidocValidationMessageBuilder.get()
          .setType(ExpectedContent.TYPE)
          .setCode(ExpectedContent.CODE)
          .setData(ExpectedContent.Data.BLUEPRINT, UnidocBlueprint.tagStart('green'))
          .get()
      )

      expect(validatorBuffer).toEqualTheSequence(expectationBuffer)
    })
  })

  describe('validation of a disjunction', function() {
    const disjunction: string[] = ['green', 'blue', 'red']

    for (let index = 0; index < disjunction.length; ++index) {
      it('accept any valid path of the disjunction [' + index + ']', function() {
        const graph: UnidocNFAValidationGraph = (
          new UnidocNFAValidationGraph()
            .builder()
            .any(...disjunction.map(UnidocKissValidator.validateStartOfTag.factory))
            .then(UnidocKissValidator.validateEnd)
            .match()
        )

        const validator: UnidocValidator = UnidocValidator.graph(graph)
        const validatorBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(validator, UnidocValidationEvent.ALLOCATOR)
        const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
        const inputBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(input, UnidocEvent.ALLOCATOR)

        validator.subscribe(input)

        input.initialize()
          .produceTagStart(disjunction[index])
          .complete()

        const expectation: UnidocValidationEventProducer = new UnidocValidationEventProducer()
        const expectationBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(expectation, UnidocValidationEvent.ALLOCATOR)

        expectation.initialize()
        expectation.produceValidation(inputBuffer.get(0))
        expectation.produceDocumentCompletion()

        expect(validatorBuffer).toEqualTheSequence(expectationBuffer)
      })
    }

    it('reject an element that is not in the disjunction', function() {
      const graph: UnidocNFAValidationGraph = (
        new UnidocNFAValidationGraph()
          .builder()
          .any(...disjunction.map(UnidocKissValidator.validateStartOfTag.factory))
          .then(UnidocKissValidator.validateEnd)
          .match()
      )

      const validator: UnidocValidator = UnidocValidator.graph(graph)
      const validatorBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(validator, UnidocValidationEvent.ALLOCATOR)
      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(input, UnidocEvent.ALLOCATOR)

      validator.subscribe(input)

      input.initialize()
        .produceTagStart('yellow')
        .complete()

      const expectation: UnidocValidationEventProducer = new UnidocValidationEventProducer()
      const expectationBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(expectation, UnidocValidationEvent.ALLOCATOR)

      expectation.initialize()
      expectation.produceValidation(inputBuffer.get(0))
      expectation.produceMessage(
        UnidocValidationMessageBuilder.get()
          .setType(ExpectedContent.TYPE)
          .setCode(ExpectedContent.CODE)
          .setData(ExpectedContent.Data.BLUEPRINT, UnidocBlueprint.tagStart(disjunction[0]))
          .get()
      )

      expect(validatorBuffer).toEqualTheSequence(expectationBuffer)
    })
  })
})
