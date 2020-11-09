import { TrackedUnidocEventProducer } from '../../../sources/event/TrackedUnidocEventProducer'
import { UnidocEventBuffer } from '../../../sources/event/UnidocEventBuffer'
import { UnidocValidationEventBuffer } from '../../../sources/validation/UnidocValidationEventBuffer'
import { UnidocValidationTreeManager } from '../../../sources/validation/UnidocValidationTreeManager'
import { UnidocValidationTrunckSelector } from '../../../sources/validation/UnidocValidationTrunckSelector'
import { UnidocBlueprintValidator } from '../../../sources/validator/blueprint/UnidocBlueprintValidator'
import { UnidocBlueprint } from '../../../sources/blueprint/UnidocBlueprint'

import { UnexpectedContent } from '../../../sources/validator/blueprint/messages/UnexpectedContent'
import { RequiredContent } from '../../../sources/validator/blueprint/messages/RequiredContent'
import { UnnecessaryContent } from '../../../sources/validator/blueprint/messages/UnnecessaryContent'

describe('UnidocBlueprintValidator', function() {
  describe('tag-start instruction', function() {
    it('validate a document that contains a tag opening event of the requested type', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = UnidocBlueprint.tagStart().ofTag('document')
      validator.validateWith(blueprint)

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

    it('raise an error if the document contains a tag opening event of a different type', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = UnidocBlueprint.tagStart().ofTag('document')
      validator.validateWith(blueprint)

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

    it('raise an error if the document contains an event that isn\'t a tag opening', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = UnidocBlueprint.tagStart().ofTag('document')
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceWord('other')
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

      const blueprint: UnidocBlueprint = UnidocBlueprint.tagStart().ofTag('document')
      validator.validateWith(blueprint)

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

  describe('tag-end instruction', function() {
    it('validate a document that contains a tag termination event of the requested type', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = UnidocBlueprint.tagEnd().ofTag('document')
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagEnd('document')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()
        .validate(inputBuffer.get(0))

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document contains a tag termination event of a different type', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = UnidocBlueprint.tagEnd().ofTag('document')
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagEnd('other')
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

    it('raise an error if the document contains an event that isn\'t a tag termination', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = UnidocBlueprint.tagEnd().ofTag('document')
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceWord('other')
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

      const blueprint: UnidocBlueprint = UnidocBlueprint.tagEnd().ofTag('document')
      validator.validateWith(blueprint)

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

  describe('word instruction', function() {
    it('validate a document that contains a word event', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = UnidocBlueprint.word()
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceWord('document')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()
        .validate(inputBuffer.get(0))

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document contains an event that isn\'t a word', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = UnidocBlueprint.word()
      validator.validateWith(blueprint)

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

      const blueprint: UnidocBlueprint = UnidocBlueprint.word()
      validator.validateWith(blueprint)

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

  describe('whitespace instruction', function() {
    it('validate a document that contains a whitespace event', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = UnidocBlueprint.whitespace()
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceWhitespace('   ')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()
        .validate(inputBuffer.get(0))

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document contains an event that isn\'t a whitespace', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = UnidocBlueprint.whitespace()
      validator.validateWith(blueprint)

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

      const blueprint: UnidocBlueprint = UnidocBlueprint.whitespace()
      validator.validateWith(blueprint)

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
      validator.validateWith(blueprint)

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
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()
        .produceTagStart('other')
        .produceTagEnd('other')
        .produceWord('other')
        .produceWhitespace(' ')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree).initialize()

      for (let index = 0; index < 4; ++index) {
        tree.branches.first
          .validate(inputBuffer.get(index))
          .asMessageOfType(UnnecessaryContent.TYPE)
          .ofCode(UnnecessaryContent.CODE)
          .withData(UnnecessaryContent.Data.BLUEPRINT, blueprint)
          .produce()
      }

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
        UnidocBlueprint.many().ofContent(UnidocBlueprint.word())
      )
      validator.validateWith(blueprint)

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
        UnidocBlueprint.many().atLeast(5).ofContent(UnidocBlueprint.word())
      )
      validator.validateWith(blueprint)

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
        UnidocBlueprint.many().atLeast(5).ofContent(UnidocBlueprint.word())
      )
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      input.initialize()

      for (let index = 0; index < 3; ++index) {
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
        .asMessageOfType(RequiredContent.TYPE)
        .ofCode(RequiredContent.CODE)
        .withData(RequiredContent.Data.BLUEPRINT, blueprint.content)
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
        UnidocBlueprint.many().upTo(20).ofContent(UnidocBlueprint.word())
      )
      validator.validateWith(blueprint)

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
        UnidocBlueprint.many().upTo(3).ofContent(UnidocBlueprint.word())
      )
      validator.validateWith(blueprint)

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
        .asMessageOfType(UnnecessaryContent.TYPE)
        .ofCode(UnnecessaryContent.CODE)
        .withData(UnnecessaryContent.Data.BLUEPRINT, blueprint)
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })
  })
})
