import { TrackedUnidocEventProducer } from '../../../sources/event/TrackedUnidocEventProducer'
import { UnidocEventBuffer } from '../../../sources/event/UnidocEventBuffer'
import { UnidocValidationEventBuffer } from '../../../sources/validation/UnidocValidationEventBuffer'
import { UnidocValidationTreeManager } from '../../../sources/validation/UnidocValidationTreeManager'
import { UnidocValidationBranchIdentifier } from '../../../sources/validation/UnidocValidationBranchIdentifier'
import { UnidocBlueprintValidator } from '../../../sources/validator/blueprint/UnidocBlueprintValidator'
import { UnidocBlueprint } from '../../../sources/blueprint/UnidocBlueprint'
import { UnidocInstruction } from '../../../sources/blueprint/UnidocInstruction'

import { UnexpectedContent } from '../../../sources/validator/blueprint/messages/UnexpectedContent'
import { RequiredContent } from '../../../sources/validator/blueprint/messages/RequiredContent'
import { UnnecessaryContent } from '../../../sources/validator/blueprint/messages/UnnecessaryContent'

describe('UnidocBlueprintValidator', function() {
  const ROOT_BRANCH: UnidocValidationBranchIdentifier = UnidocValidationBranchIdentifier.create().set(0, 0)

  describe('tag-start instruction', function() {
    it('validate a document that contains a tag opening event of the requested type', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.tagStart('document'))
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
        .produceTagStart('document')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .validate(ROOT_BRANCH, inputBuffer.get(0))
        .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document contains a tag opening event of a different type', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.tagStart('document'))
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
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
        .withData(UnexpectedContent.Data.INSTRUCTION, blueprint.get(0))
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document contains an event that isn\'t a tag opening', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.tagStart('document'))
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
        .produceWord('other')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()
        .asMessageOfType(UnexpectedContent.TYPE)
        .ofCode(UnexpectedContent.CODE)
        .withData(UnexpectedContent.Data.BLUEPRINT, blueprint)
        .withData(UnexpectedContent.Data.INSTRUCTION, blueprint.get(0))
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document is empty', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.tagStart('document'))
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()
        .asMessageOfType(RequiredContent.TYPE)
        .ofCode(RequiredContent.CODE)
        .withData(RequiredContent.Data.BLUEPRINT, blueprint)
        .withData(RequiredContent.Data.INSTRUCTION, blueprint.get(0))
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

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.tagEnd('document'))
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
        .produceTagEnd('document')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document contains a tag termination event of a different type', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.tagEnd('document'))
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
        .produceTagEnd('other')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()
        .asMessageOfType(UnexpectedContent.TYPE)
        .ofCode(UnexpectedContent.CODE)
        .withData(UnexpectedContent.Data.BLUEPRINT, blueprint)
        .withData(UnexpectedContent.Data.INSTRUCTION, blueprint.get(0))
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document contains an event that isn\'t a tag termination', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.tagEnd('document'))
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
        .produceWord('other')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()
        .asMessageOfType(UnexpectedContent.TYPE)
        .ofCode(UnexpectedContent.CODE)
        .withData(UnexpectedContent.Data.BLUEPRINT, blueprint)
        .withData(UnexpectedContent.Data.INSTRUCTION, blueprint.get(0))
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document is empty', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.tagEnd('document'))
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()
        .asMessageOfType(RequiredContent.TYPE)
        .ofCode(RequiredContent.CODE)
        .withData(RequiredContent.Data.BLUEPRINT, blueprint)
        .withData(RequiredContent.Data.INSTRUCTION, blueprint.get(0))
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

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.word())
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
        .produceWord('document')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document contains an event that isn\'t a word', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.word())
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
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
        .withData(UnexpectedContent.Data.INSTRUCTION, blueprint.get(0))
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document is empty', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.word())
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()
        .asMessageOfType(RequiredContent.TYPE)
        .ofCode(RequiredContent.CODE)
        .withData(RequiredContent.Data.BLUEPRINT, blueprint)
        .withData(RequiredContent.Data.INSTRUCTION, blueprint.get(0))
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

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.whitespace())
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
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

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.whitespace())
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
        .produceTagStart('other')
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()
        .asMessageOfType(UnexpectedContent.TYPE)
        .ofCode(UnexpectedContent.CODE)
        .withData(UnexpectedContent.Data.BLUEPRINT, blueprint)
        .withData(UnexpectedContent.Data.INSTRUCTION, blueprint.get(0))
        .produce()

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document is empty', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.whitespace())
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .initialize()
        .asMessageOfType(RequiredContent.TYPE)
        .ofCode(RequiredContent.CODE)
        .withData(RequiredContent.Data.BLUEPRINT, blueprint)
        .withData(RequiredContent.Data.INSTRUCTION, blueprint.get(0))
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

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
        .complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('raise an error if the document contains any content', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)
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
          .withData(UnnecessaryContent.Data.INSTRUCTION, blueprint.get(0))
          .produce()
      }

      tree.complete()

      expect(expectation.expect(output)).toBeTruthy()
    })
  })

  describe('many block', function() {
    it('allow to repeat a given blueprint fragment many times', function() {
      const validator: UnidocBlueprintValidator = new UnidocBlueprintValidator()

      const output: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      output.subscribe(validator)

      const blueprint: UnidocBlueprint = new UnidocBlueprint()
      blueprint.push(UnidocInstruction.startMany())
      blueprint.push(UnidocInstruction.word())
      blueprint.push(UnidocInstruction.endMany())
      blueprint.push(UnidocInstruction.end())
      validator.validateWith(blueprint)

      const input: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
      const inputBuffer: UnidocEventBuffer = new UnidocEventBuffer()
      inputBuffer.subscribe(input)
      validator.subscribe(input)

      for (let index = 0; index < 20; ++index) {
        input.produceWord('test')
      }

      input.complete()

      const expectation: UnidocValidationEventBuffer = new UnidocValidationEventBuffer()
      const tree: UnidocValidationTreeManager = new UnidocValidationTreeManager()

      expectation.subscribe(tree)
        .complete()

      console.log(output.toString())
    })
  })
})
