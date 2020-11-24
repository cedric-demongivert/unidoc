import { TrackedUnidocEventProducer } from '../../../sources/event/TrackedUnidocEventProducer'
import { UnidocEventBuffer } from '../../../sources/event/UnidocEventBuffer'
import { UnidocValidationEventBuffer } from '../../../sources/validation/UnidocValidationEventBuffer'
import { UnidocValidationTreeManager } from '../../../sources/validation/UnidocValidationTreeManager'
import { UnidocValidationTrunckSelector } from '../../../sources/validation/UnidocValidationTrunckSelector'
import { UnidocBlueprintValidator } from '../../../sources/validator/blueprint/UnidocBlueprintValidator'
import { UnidocBlueprint } from '../../../sources/blueprint/UnidocBlueprint'

import { UnidocProducerEvent } from '../../../sources/producer/UnidocProducerEvent'

import { UnidocPredicate } from '../../../sources/predicate/UnidocPredicate'
import { UnidocSelector } from '../../../sources/selector/UnidocSelector'

import { UnexpectedContent } from '../../../sources/validator/blueprint/messages/UnexpectedContent'
import { RequiredContent } from '../../../sources/validator/blueprint/messages/RequiredContent'
import { UnnecessaryContent } from '../../../sources/validator/blueprint/messages/UnnecessaryContent'
import { PreferredContent } from '../../../sources/validator/blueprint/messages/PreferredContent'
import { TooManyErrors } from '../../../sources/validator/blueprint/messages/TooManyErrors'

describe('UnidocBlueprintValidator', function() {
  describe('event instruction', function() {
    it('validate a document that contains an event that respect some predicate', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = UnidocBlueprint.tagStart('document')
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('document')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()
        .validate(inputBuffer.get(0))

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document contains an event that violate the predicate', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = UnidocBlueprint.tagStart('document')
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('other')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()
        .validate(inputBuffer.get(0))
        .asMessageOfType(UnexpectedContent.TYPE)
        .ofCode(UnexpectedContent.CODE)
        .withData(UnexpectedContent.Data.BLUEPRINT, blueprint)
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document is empty', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = UnidocBlueprint.tagStart('document')
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()
        .asMessageOfType(RequiredContent.TYPE)
        .ofCode(RequiredContent.CODE)
        .withData(RequiredContent.Data.BLUEPRINT, blueprint)
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })
  })

  describe('end instruction', function() {
    it('validate a document that is empty', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = UnidocBlueprint.end()
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree).initialize()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document contains any content', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = UnidocBlueprint.end()
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('other')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree).initialize()

      tree.branches.first
        .validate(inputBuffer.get(0))
        .asMessageOfType(UnnecessaryContent.TYPE)
        .ofCode(UnnecessaryContent.CODE)
        .withData(UnnecessaryContent.Data.BLUEPRINT, blueprint)
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })
  })

  describe('many block', function() {
    it('allow to repeat a given blueprint fragment many times', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.many(
          UnidocBlueprint.word()
        )
      )

      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()

      for (let index = 0; index < 20; ++index) {
        input.produceWord('test')
      }

      input.complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      for (let index = 0; index < 20; ++index) {
        tree.branches.first
          .validate(inputBuffer.get(index))
      }

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('it validate trees that contains more than a required number of repeats', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.many(
          UnidocBlueprint.word()
        ).atLeast(5)
      )

      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()

      for (let index = 0; index < 10; ++index) {
        input.produceWord('test')
      }

      input.complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      for (let index = 0; index < 10; ++index) {
        tree.branches.first
          .validate(inputBuffer.get(index))
      }

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('it emit errors when a tree contains less than a required number of repeats', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint.Many = (
        UnidocBlueprint.many(
          UnidocBlueprint.word()
        ).atLeast(5)
      )

      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()

      for (let index = 0; index < 2; ++index) {
        input.produceWord('test')
      }

      input.complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      for (let index = 0; index < 2; ++index) {
        tree.branches.first
          .validate(inputBuffer.get(index))
      }

      tree.branches.first
        .asMessageOfType(RequiredContent.TYPE)
        .ofCode(RequiredContent.CODE)
        .withData(RequiredContent.Data.BLUEPRINT, blueprint.operand)
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('it validate trees that contains more than a maximum number of repeats', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.many(
          UnidocBlueprint.word()
        ).upTo(20)
      )

      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()

      for (let index = 0; index < 20; ++index) {
        input.produceWord('test')
      }

      input.complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      for (let index = 0; index < 20; ++index) {
        tree.branches.first
          .validate(inputBuffer.get(index))
      }

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('it emit errors when a tree contains more than a maximum number of repeats', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.many(
          UnidocBlueprint.word()
        ).upTo(3)
      )
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()

      for (let index = 0; index < 5; ++index) {
        input.produceWord('test')
      }

      input.complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      for (let index = 0; index < 3; ++index) {
        tree.branches.first
          .validate(inputBuffer.get(index))
      }

      tree.branches.first
        .validate(inputBuffer.get(3))
        .asMessageOfType(UnnecessaryContent.TYPE)
        .ofCode(UnnecessaryContent.CODE)
        .withData(UnnecessaryContent.Data.BLUEPRINT, blueprint)
        .produce()
        .validate(inputBuffer.get(4))
      /*.asMessageOfType(UnnecessaryContent.TYPE)
      .ofCode(UnnecessaryContent.CODE)
      .withData(UnnecessaryContent.Data.BLUEPRINT, blueprint)
      .produce() <--- SHTARB */

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })
  })

  describe('disjunction block', function() {
    it('accept one of the specified alternative', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint = UnidocBlueprint.many(
        UnidocBlueprint.disjunction(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('green')
        .produceTagStart('blue')
        .produceTagStart('red')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      for (let index = 0; index < 3; ++index) {
        tree.branches.first
          .validate(inputBuffer.get(index))
      }

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('throw an error if the content does not match one of the specified alternative', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint.Disjunction = (
        UnidocBlueprint.disjunction(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      validator.execute(UnidocBlueprint.many(blueprint))

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('green')
        .produceTagStart('yellow')
        .produceTagStart('red')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      tree.branches.first
        .validate(inputBuffer.get(0))
        .validate(inputBuffer.get(1))
        .asMessageOfType(UnexpectedContent.TYPE)
        .ofCode(UnexpectedContent.CODE)
        .withData(UnexpectedContent.Data.BLUEPRINT, blueprint.operands.get(2))
        .produce()
        .validate(inputBuffer.get(2))

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })
  })

  describe('set block', function() {
    it('accept each of the specified alternative in any order', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.set(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue'),
        )
      )

      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('green')
        .produceTagStart('blue')
        .produceTagStart('red')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      for (let index = 0; index < 3; ++index) {
        tree.branches.first
          .validate(inputBuffer.get(index))
      }

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if one content differ', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint.Set = (
        UnidocBlueprint.set(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue'),
        )
      )
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('green')
        .produceTagStart('red')
        .produceTagStart('yellow')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      for (let index = 0; index < 3; ++index) {
        tree.branches.first
          .validate(inputBuffer.get(index))
      }

      tree.branches.first
        .asMessageOfType(UnexpectedContent.TYPE)
        .ofCode(UnexpectedContent.CODE)
        .withData(UnexpectedContent.Data.BLUEPRINT, blueprint.operands.get(2))
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if some content does not appears', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint.Set = (
        UnidocBlueprint.set(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('green')
        .produceTagStart('red')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      for (let index = 0; index < 2; ++index) {
        tree.branches.first
          .validate(inputBuffer.get(index))
      }

      tree.branches.first
        .asMessageOfType(RequiredContent.TYPE)
        .ofCode(RequiredContent.CODE)
        .withData(RequiredContent.Data.BLUEPRINT, blueprint.operands.get(2))
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })
  })

  describe('sequence block', function() {
    it('accept a sequence of element', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.sequence(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .produceTagStart('green')
        .produceTagStart('blue')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      for (let index = 0; index < 3; ++index) {
        tree.branches.first
          .validate(inputBuffer.get(index))
      }

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('emit an error when the sequence is unnordered', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint.LenientSequence = (
        UnidocBlueprint.sequence(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .produceTagStart('blue')
        .produceTagStart('green')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      tree.branches.first
        .validate(inputBuffer.get(0))
        .validate(inputBuffer.get(1))
        .asMessageOfType(UnexpectedContent.TYPE)
        .ofCode(UnexpectedContent.CODE)
        .withData(UnexpectedContent.Data.BLUEPRINT, blueprint.operands.get(1))
        .produce()
        .validate(inputBuffer.get(2))
        .asMessageOfType(UnexpectedContent.TYPE)
        .ofCode(UnexpectedContent.CODE)
        .withData(UnexpectedContent.Data.BLUEPRINT, blueprint.operands.get(2))
        .produce()
        .asMessageOfType(TooManyErrors.TYPE)
        .ofCode(TooManyErrors.CODE)
        .withData(TooManyErrors.Data.RECOVERIES, 1)
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('emit an error when an element of the sequence is missing', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint.LenientSequence = (
        UnidocBlueprint.sequence(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .produceTagStart('green')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      tree.branches.first
        .validate(inputBuffer.get(0))
        .validate(inputBuffer.get(1))
        .asMessageOfType(RequiredContent.TYPE)
        .ofCode(RequiredContent.CODE)
        .withData(RequiredContent.Data.BLUEPRINT, blueprint.operands.get(2))
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('emit an error when an element of the sequence is invalid', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint.LenientSequence = (
        UnidocBlueprint.sequence(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .produceTagStart('yellow')
        .produceTagStart('blue')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      tree.branches.first
        .validate(inputBuffer.get(0))
        .validate(inputBuffer.get(1))
        .asMessageOfType(UnexpectedContent.TYPE)
        .ofCode(UnexpectedContent.CODE)
        .withData(UnexpectedContent.Data.BLUEPRINT, blueprint.operands.get(1))
        .produce()

      tree.branches.first.validate(inputBuffer.get(2))

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })
  })

  describe('lenient sequence block', function() {
    it('accept a sequence of element', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.sequence.lenient(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .produceTagStart('green')
        .produceTagStart('blue')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      for (let index = 0; index < 3; ++index) {
        tree.branches.first
          .validate(inputBuffer.get(index))
      }

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('emit a warning when the sequence is unnordered', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint.LenientSequence = (
        UnidocBlueprint.sequence.lenient(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('green')
        .produceTagStart('red')
        .produceTagStart('blue')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      tree.branches.first
        .validate(inputBuffer.get(0))
        .asMessageOfType(PreferredContent.TYPE)
        .ofCode(PreferredContent.CODE)
        .withData(PreferredContent.Data.BLUEPRINT, blueprint.operands.get(0))
        .produce()

      for (let index = 1; index < 3; ++index) {
        tree.branches.first.validate(inputBuffer.get(index))
      }

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('emit an error when an element of the sequence is missing', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint.LenientSequence = (
        UnidocBlueprint.sequence.lenient(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('green')
        .produceTagStart('blue')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      tree.branches.first
        .validate(inputBuffer.get(0))
        .asMessageOfType(PreferredContent.TYPE)
        .ofCode(PreferredContent.CODE)
        .withData(PreferredContent.Data.BLUEPRINT, blueprint.operands.get(0))
        .produce()

      tree.branches.first
        .validate(inputBuffer.get(1))
        .asMessageOfType(PreferredContent.TYPE)
        .ofCode(PreferredContent.CODE)
        .withData(PreferredContent.Data.BLUEPRINT, blueprint.operands.get(0))
        .produce()

      tree.branches.first
        .asMessageOfType(RequiredContent.TYPE)
        .ofCode(RequiredContent.CODE)
        .withData(RequiredContent.Data.BLUEPRINT, blueprint.operands.get(0))
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('emit an error when an element of the sequence is invalid', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint.LenientSequence = (
        UnidocBlueprint.sequence.lenient(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('blue')
        .produceTagStart('green')
        .produceTagStart('blue')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      tree.branches.first
        .validate(inputBuffer.get(0))
        .asMessageOfType(UnexpectedContent.TYPE)
        .ofCode(UnexpectedContent.CODE)
        .withData(UnexpectedContent.Data.BLUEPRINT, blueprint.operands.get(0))
        .produce()

      for (let index = 1; index < 3; ++index) {
        tree.branches.first
          .validate(inputBuffer.get(index))
      }

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })
  })

  describe('tag block', function() {
    it('accept a tag', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.many(
          UnidocBlueprint.tag().thatMatch(UnidocPredicate.is(
            UnidocSelector.tagName(),
            UnidocPredicate.match(/red|green|blue/i)
          ))
        )
      )
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .produceTagEnd('red')
        .produceTagStart('green')
        .produceTagEnd('green')
        .produceTagStart('blue')
        .produceTagEnd('blue')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      for (let index = 0; index < 6; ++index) {
        tree.branches.first
          .validate(inputBuffer.get(index))
      }

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('throw if a tag does not match', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.tag().thatMatch(UnidocPredicate.is(
          UnidocSelector.tagName(),
          UnidocPredicate.match(/red|green|blue/i)
        ))
      )
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('brown')
        .produceTagEnd('brown')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      tree.branches.first
        .validate(inputBuffer.get(0))
        .asMessageOfType(UnexpectedContent.TYPE)
        .ofCode(UnexpectedContent.CODE)
        .withData(UnexpectedContent.Data.BLUEPRINT, blueprint)
        .produce()
        .validate(inputBuffer.get(1))

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('throw if a tag closing does not match', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.tag().thatMatch(UnidocPredicate.is(
          UnidocSelector.tagName(),
          UnidocPredicate.match(/red|green|blue/i)
        ))
      )
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .produceTagEnd('green')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      tree.branches.first
        .validate(inputBuffer.get(0))
        .validate(inputBuffer.get(1))
        .asMessageOfType(UnexpectedContent.TYPE)
        .ofCode(UnexpectedContent.CODE)
        .withData(UnexpectedContent.Data.BLUEPRINT, blueprint)
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('throw if a tag was not opened', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.tag().thatMatch(UnidocPredicate.is(
          UnidocSelector.tagName(),
          UnidocPredicate.match(/red|green|blue/i)
        ))
      )
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      tree.branches.first
        .asMessageOfType(RequiredContent.TYPE)
        .ofCode(RequiredContent.CODE)
        .withData(RequiredContent.Data.BLUEPRINT, blueprint)
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('throw if a tag was not closed', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.tag().thatMatch(UnidocPredicate.is(
          UnidocSelector.tagName(),
          UnidocPredicate.match(/red|green|blue/i)
        ))
      )
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      tree.branches.first
        .validate(inputBuffer.get(0))
        .asMessageOfType(RequiredContent.TYPE)
        .ofCode(RequiredContent.CODE)
        .withData(RequiredContent.Data.BLUEPRINT, blueprint)
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })
  })

  describe('combinations', function() {
    it('accept circular combinations', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const tag: UnidocBlueprint.Tag = (
        UnidocBlueprint.tag().thatMatch(UnidocPredicate.is(
          UnidocSelector.tagName(),
          UnidocPredicate.match(/red|green|blue/i)
        ))
      )

      const blueprint: UnidocBlueprint = UnidocBlueprint.many(tag).upTo(3)

      tag.withContent(blueprint)

      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('red')
        .produceTagStart('blue')
        .produceTagEnd('blue')
        .produceTagEnd('red')
        .produceTagStart('green')
        .produceTagStart('green')
        .produceTagStart('red')
        .produceTagEnd('red')
        .produceTagEnd('green')
        .produceTagEnd('green')
        .produceTagStart('blue')
        .produceTagEnd('blue')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      for (let index = 0; index < 12; ++index) {
        tree.branches.first
          .validate(inputBuffer.get(index))
      }

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    /*it.only('case 002', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()
      const selector: UnidocValidationTrunckSelector = new UnidocValidationTrunckSelector()
      selector.subscribe(validator)

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(selector)

      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.sequence(
          UnidocBlueprint.tagStart('identifier'),
          UnidocBlueprint.many(UnidocBlueprint.whitespace()),
          UnidocBlueprint.many(UnidocBlueprint.word()).atLeast(1),
          UnidocBlueprint.many(UnidocBlueprint.whitespace()),
          UnidocBlueprint.tagEnd('identifier')
        )
      )
      validator.execute(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()

      for (let index = 0; index < 100; ++index) {
        input
          .produceTagStart('identifier')
          .produceWhitespace(' ')
          .produceWhitespace('roberto::test::debanderas')
          .produceWhitespace(' ')
          .produceTagEnd('identifier')
      }

      input.complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.initialize()

      for (let index = 0; index < 5; ++index) {
        tree.branches.first.validate(inputBuffer.get(index))
      }

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })*/
  })
})
