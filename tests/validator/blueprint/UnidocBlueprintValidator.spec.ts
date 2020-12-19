import '../../jest/sequence'

import { UnidocBlueprint } from '../../../sources/blueprint/UnidocBlueprint'

import { UnidocPredicate } from '../../../sources/predicate/UnidocPredicate'
import { UnidocSelector } from '../../../sources/selector/UnidocSelector'

import { UnexpectedContent } from '../../../sources/validator/blueprint/messages/UnexpectedContent'
import { RequiredContent } from '../../../sources/validator/blueprint/messages/RequiredContent'
import { UnnecessaryContent } from '../../../sources/validator/blueprint/messages/UnnecessaryContent'
import { PreferredContent } from '../../../sources/validator/blueprint/messages/PreferredContent'

import { UnidocBlueprintValidatorTestCase } from './UnidocBlueprintValidatorTestCase'

describe('UnidocBlueprintValidator', function() {
  describe('event instruction', function() {
    it('validate a document that contains an event that respect some predicate', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = UnidocBlueprint.tagStart('document')

      test.execute(blueprint)

      test.input
        .initialize()
        .produceTagStart('document')
        .complete()

      test.expectation
        .initialize()
        .validate(test.inputBuffer.get(0))
        .documentCompletion()

      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('raise an error if the document contains an event that violate the predicate', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = UnidocBlueprint.tagStart('document')

      test.execute(blueprint)

      test.input
        .initialize()
        .produceTagStart('other')
        .complete()

      test.expectation
        .initialize()
        .validate(test.inputBuffer.get(0))
        .setMessageType(UnexpectedContent.TYPE)
        .setMessageCode(UnexpectedContent.CODE)
        .setMessageData(UnexpectedContent.Data.BLUEPRINT, blueprint)
        .produce()

      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('raise an error if the document is empty', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = UnidocBlueprint.tagStart('document')

      test.execute(blueprint)

      test.input
        .initialize()
        .complete()

      test.expectation
        .initialize()
        .documentCompletion()
        .setMessageType(RequiredContent.TYPE)
        .setMessageCode(RequiredContent.CODE)
        .setMessageData(RequiredContent.Data.BLUEPRINT, blueprint)
        .produce()

      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })
  })

  describe('end instruction', function() {
    it('validate a document that is empty', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = UnidocBlueprint.end()

      test.execute(blueprint)

      test.input
        .initialize()
        .complete()

      test.expectation
        .initialize()
        .documentCompletion()

      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('raise an error if the document contains any content', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = UnidocBlueprint.end()

      test.execute(blueprint)

      test.input
        .initialize()
        .produceTagStart('other')
        .complete()

      test.expectation.initialize()

      test.expectation.branches.first
        .validate(test.inputBuffer.get(0))
        .setMessageType(UnnecessaryContent.TYPE)
        .setMessageCode(UnnecessaryContent.CODE)
        .setMessageData(UnnecessaryContent.Data.BLUEPRINT, blueprint)
        .produce()

      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })
  })

  describe('sequence block', function() {
    it('accept a sequence of element', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.sequence(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      test.execute(blueprint)

      test.input
        .initialize()
        .produceTagStart('red')
        .produceTagStart('green')
        .produceTagStart('blue')
        .complete()

      test.expectation.initialize()
      for (let index = 0; index < 3; ++index) {
        test.expectation.branches.first.validate(test.inputBuffer.get(index))
      }
      test.expectation.branches.first.documentCompletion()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('emit an error when the sequence is unnordered', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint.LenientSequence = (
        UnidocBlueprint.sequence(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      test.execute(blueprint)

      test.input.initialize()
        .produceTagStart('red')
        .produceTagStart('blue')
        .produceTagStart('green')
        .complete()

      test.expectation.initialize()

      test.expectation.branches.first
        .validate(test.inputBuffer.get(0))
        .validate(test.inputBuffer.get(1))
        .setMessageType(UnexpectedContent.TYPE)
        .setMessageCode(UnexpectedContent.CODE)
        .setMessageData(UnexpectedContent.Data.BLUEPRINT, blueprint.operands.get(1))
        .produce()

      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('emit an error when an element of the sequence is missing', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint.LenientSequence = (
        UnidocBlueprint.sequence(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      test.execute(blueprint)

      test.input.initialize()
        .produceTagStart('red')
        .produceTagStart('green')
        .complete()

      test.expectation.initialize()

      test.expectation.branches.first
        .validate(test.inputBuffer.get(0))
        .validate(test.inputBuffer.get(1))
        .documentCompletion()
        .setMessageType(RequiredContent.TYPE)
        .setMessageCode(RequiredContent.CODE)
        .setMessageData(RequiredContent.Data.BLUEPRINT, blueprint.operands.get(2))
        .produce()

      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('emit an error when an element of the sequence is invalid', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint.LenientSequence = (
        UnidocBlueprint.sequence(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      test.execute(blueprint)

      test.input.initialize()
        .produceTagStart('red')
        .produceTagStart('yellow')
        .produceTagStart('blue')
        .complete()

      test.expectation.initialize()

      test.expectation.branches.first
        .validate(test.inputBuffer.get(0))
        .validate(test.inputBuffer.get(1))
        .setMessageType(UnexpectedContent.TYPE)
        .setMessageCode(UnexpectedContent.CODE)
        .setMessageData(UnexpectedContent.Data.BLUEPRINT, blueprint.operands.get(1))
        .produce()

      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })
  })

  describe('many block', function() {
    it('allow to repeat a given blueprint fragment many times', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = UnidocBlueprint.sequence(
        UnidocBlueprint.many(UnidocBlueprint.word()),
        UnidocBlueprint.end()
      )

      test.execute(blueprint)

      test.input.initialize()
      for (let index = 0; index < 20; ++index) {
        test.input.produceWord('test')
      }
      test.input.complete()

      test.expectation.initialize()

      for (let index = 0; index < 20; ++index) {
        test.expectation.branches.first
          .validate(test.inputBuffer.get(index))
      }

      test.expectation.branches.first.documentCompletion()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('it validate test.expectations that contains more than a required number of repeats', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = UnidocBlueprint.sequence(
        UnidocBlueprint.many(UnidocBlueprint.word()).atLeast(5),
        UnidocBlueprint.end()
      )

      test.execute(blueprint)

      test.input.initialize()
      for (let index = 0; index < 10; ++index) {
        test.input.produceWord('test')
      }
      test.input.complete()

      test.expectation.initialize()

      for (let index = 0; index < 10; ++index) {
        test.expectation.branches.first
          .validate(test.inputBuffer.get(index))
      }

      test.expectation.branches.first.documentCompletion()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('it emit errors when a test.expectation contains less than a required number of repeats', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint.Many = (
        UnidocBlueprint.many(UnidocBlueprint.word()).atLeast(5)
      )

      test.execute(UnidocBlueprint.sequence(blueprint, UnidocBlueprint.end()))

      test.input.initialize()
      for (let index = 0; index < 2; ++index) {
        test.input.produceWord('test')
      }
      test.input.complete()

      test.expectation.initialize()

      for (let index = 0; index < 2; ++index) {
        test.expectation.branches.first.validate(test.inputBuffer.get(index))
      }

      test.expectation.branches.first
        .documentCompletion()
        .setMessageType(RequiredContent.TYPE)
        .setMessageCode(RequiredContent.CODE)
        .setMessageData(RequiredContent.Data.BLUEPRINT, blueprint.operand)
        .produce()

      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('it validate test.expectations that contains less than a maximum number of repeats', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = UnidocBlueprint.sequence(
        UnidocBlueprint.many(UnidocBlueprint.word()).upTo(20),
        UnidocBlueprint.end()
      )

      test.execute(blueprint)

      test.input.initialize()
      for (let index = 0; index < 20; ++index) {
        test.input.produceWord('test')
      }
      test.input.complete()

      test.expectation.initialize()
      for (let index = 0; index < 20; ++index) {
        test.expectation.branches.first.validate(test.inputBuffer.get(index))
      }
      test.expectation.branches.first.documentCompletion()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('emit errors when a test.expectation contains more than a maximum number of repeats', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.many(UnidocBlueprint.word()).upTo(3)
      )

      test.execute(UnidocBlueprint.sequence(blueprint, UnidocBlueprint.end()))

      test.input.initialize()
      for (let index = 0; index < 5; ++index) {
        test.input.produceWord('test')
      }
      test.input.complete()

      test.expectation.initialize()
      for (let index = 0; index < 3; ++index) {
        test.expectation.branches.first
          .validate(test.inputBuffer.get(index))
      }
      test.expectation.branches.first
        .validate(test.inputBuffer.get(3))
        .setMessageType(UnnecessaryContent.TYPE)
        .setMessageCode(UnnecessaryContent.CODE)
        .setMessageData(UnnecessaryContent.Data.BLUEPRINT, UnidocBlueprint.end())
        .produce()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })
  })

  describe('disjunction block', function() {
    it('accept one of the specified alternative', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const disjunction: UnidocBlueprint = (
        UnidocBlueprint.disjunction(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      const blueprint: UnidocBlueprint = UnidocBlueprint.sequence(
        disjunction,
        disjunction,
        disjunction
      )

      test.execute(blueprint)

      test.input.initialize()
        .produceTagStart('green')
        .produceTagStart('blue')
        .produceTagStart('red')
        .complete()

      test.expectation.initialize()
      for (let index = 0; index < 3; ++index) {
        test.expectation.branches.first
          .validate(test.inputBuffer.get(index))
      }
      test.expectation.branches.first.documentCompletion()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('throw an error if the content does not match one of the specified alternative', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint.Disjunction = (
        UnidocBlueprint.disjunction(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      test.execute(UnidocBlueprint.sequence(blueprint, blueprint, blueprint))

      test.input.initialize()
        .produceTagStart('green')
        .produceTagStart('yellow')
        .produceTagStart('red')
        .complete()

      test.expectation.initialize()
      test.expectation.branches.first
        .validate(test.inputBuffer.get(0))
        .validate(test.inputBuffer.get(1))
        .setMessageType(UnexpectedContent.TYPE)
        .setMessageCode(UnexpectedContent.CODE)
        .setMessageData(UnexpectedContent.Data.BLUEPRINT, blueprint.operands.get(2))
        .produce()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })
  })

  describe('set block', function() {
    it('accept each of the specified alternative in any order', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.set(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue'),
        )
      )

      test.execute(blueprint)

      test.input.initialize()
        .produceTagStart('green')
        .produceTagStart('blue')
        .produceTagStart('red')
        .complete()

      test.expectation.initialize()
      for (let index = 0; index < 3; ++index) {
        test.expectation.branches.first.validate(test.inputBuffer.get(index))
      }
      test.expectation.branches.first.documentCompletion()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('raise an error if one content differ', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint.Set = (
        UnidocBlueprint.set(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue'),
        )
      )

      test.execute(blueprint)

      test.input.initialize()
        .produceTagStart('green')
        .produceTagStart('red')
        .produceTagStart('yellow')
        .complete()

      test.expectation.initialize()
      for (let index = 0; index < 3; ++index) {
        test.expectation.branches.first.validate(test.inputBuffer.get(index))
      }
      test.expectation.branches.first
        .setMessageType(UnexpectedContent.TYPE)
        .setMessageCode(UnexpectedContent.CODE)
        .setMessageData(UnexpectedContent.Data.BLUEPRINT, blueprint.operands.get(2))
        .produce()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('raise an error if some content does not appears', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint.Set = (
        UnidocBlueprint.set(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      test.execute(blueprint)

      test.input.initialize()
        .produceTagStart('green')
        .produceTagStart('red')
        .complete()

      test.expectation.initialize()
      for (let index = 0; index < 2; ++index) {
        test.expectation.branches.first.validate(test.inputBuffer.get(index))
      }
      test.expectation.branches.first.documentCompletion()
      test.expectation.branches.first
        .setMessageType(RequiredContent.TYPE)
        .setMessageCode(RequiredContent.CODE)
        .setMessageData(RequiredContent.Data.BLUEPRINT, blueprint.operands.get(2))
        .produce()

      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })
  })

  describe('lenient sequence block', function() {
    it('accept a sequence of element', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.sequence.lenient(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      test.execute(blueprint)

      test.input.initialize()
        .produceTagStart('red')
        .produceTagStart('green')
        .produceTagStart('blue')
        .complete()

      test.expectation.initialize()
      for (let index = 0; index < 3; ++index) {
        test.expectation.branches.first.validate(test.inputBuffer.get(index))
      }
      test.expectation.branches.first.documentCompletion()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('emit a warning when the sequence is unnordered', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint.LenientSequence = (
        UnidocBlueprint.sequence.lenient(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      test.execute(blueprint)

      test.input.initialize()
        .produceTagStart('green')
        .produceTagStart('red')
        .produceTagStart('blue')
        .complete()

      test.expectation.initialize()
      test.expectation.branches.first
        .validate(test.inputBuffer.get(0))
        .setMessageType(PreferredContent.TYPE)
        .setMessageCode(PreferredContent.CODE)
        .setMessageData(PreferredContent.Data.BLUEPRINT, blueprint.operands.get(0))
        .produce()
      for (let index = 1; index < 3; ++index) {
        test.expectation.branches.first.validate(test.inputBuffer.get(index))
      }
      test.expectation.branches.first.documentCompletion()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('emit an error when an element of the sequence is missing', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint.LenientSequence = (
        UnidocBlueprint.sequence.lenient(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      test.execute(blueprint)

      test.input.initialize()
        .produceTagStart('green')
        .produceTagStart('blue')
        .complete()

      test.expectation.initialize()
      test.expectation.branches.first
        .validate(test.inputBuffer.get(0))
        .setMessageType(PreferredContent.TYPE)
        .setMessageCode(PreferredContent.CODE)
        .setMessageData(PreferredContent.Data.BLUEPRINT, blueprint.operands.get(0))
        .produce()
      test.expectation.branches.first
        .validate(test.inputBuffer.get(1))
        .setMessageType(PreferredContent.TYPE)
        .setMessageCode(PreferredContent.CODE)
        .setMessageData(PreferredContent.Data.BLUEPRINT, blueprint.operands.get(0))
        .produce()
      test.expectation.branches.first
        .documentCompletion()
        .setMessageType(RequiredContent.TYPE)
        .setMessageCode(RequiredContent.CODE)
        .setMessageData(RequiredContent.Data.BLUEPRINT, blueprint.operands.get(0))
        .produce()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('emit an error when an element of the sequence is invalid', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint.LenientSequence = (
        UnidocBlueprint.sequence.lenient(
          UnidocBlueprint.tagStart('red'),
          UnidocBlueprint.tagStart('green'),
          UnidocBlueprint.tagStart('blue')
        )
      )

      test.execute(blueprint)

      test.input.initialize()
        .produceTagStart('blue')
        .produceTagStart('green')
        .produceTagStart('blue')
        .complete()

      test.expectation.initialize()
      test.expectation.branches.first
        .validate(test.inputBuffer.get(0))
        .setMessageType(PreferredContent.TYPE)
        .setMessageCode(PreferredContent.CODE)
        .setMessageData(PreferredContent.Data.BLUEPRINT, blueprint.operands.get(0))
        .produce()
        .validate(test.inputBuffer.get(1))
        .setMessageType(PreferredContent.TYPE)
        .setMessageCode(PreferredContent.CODE)
        .setMessageData(PreferredContent.Data.BLUEPRINT, blueprint.operands.get(0))
        .produce()
        .validate(test.inputBuffer.get(2))
        .setMessageType(UnexpectedContent.TYPE)
        .setMessageCode(UnexpectedContent.CODE)
        .setMessageData(UnexpectedContent.Data.BLUEPRINT, blueprint.operands.get(0))
        .produce()
        .terminate()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })
  })

  describe('tag block', function() {
    it('accept a tag', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.many(
          UnidocBlueprint.tag().thatMatch(UnidocPredicate.is(
            UnidocSelector.tagName(),
            UnidocPredicate.match(/red|green|blue/i)
          ))
        )
      )

      test.execute(blueprint)

      test.input.initialize()
        .produceTagStart('red')
        .produceTagEnd('red')
        .produceTagStart('green')
        .produceTagEnd('green')
        .produceTagStart('blue')
        .produceTagEnd('blue')
        .complete()

      test.expectation.initialize()
      for (let index = 0; index < 6; ++index) {
        test.expectation.branches.first.validate(test.inputBuffer.get(index))
      }
      test.expectation.branches.first.documentCompletion()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('throw if a tag does not match', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.tag().thatMatch(UnidocPredicate.is(
          UnidocSelector.tagName(),
          UnidocPredicate.match(/red|green|blue/i)
        ))
      )

      test.execute(blueprint)

      test.input.initialize()
        .produceTagStart('brown')
        .produceTagEnd('brown')
        .complete()

      test.expectation.initialize()
      test.expectation.branches.first
        .validate(test.inputBuffer.get(0))
        .setMessageType(UnexpectedContent.TYPE)
        .setMessageCode(UnexpectedContent.CODE)
        .setMessageData(UnexpectedContent.Data.BLUEPRINT, blueprint)
        .produce()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('throw if a tag closing does not match', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.tag().thatMatch(UnidocPredicate.is(
          UnidocSelector.tagName(),
          UnidocPredicate.match(/red|green|blue/i)
        ))
      )

      test.execute(blueprint)

      test.input.initialize()
        .produceTagStart('red')
        .produceTagEnd('green')
        .complete()

      test.expectation.initialize()
      test.expectation.branches.first
        .validate(test.inputBuffer.get(0))
        .validate(test.inputBuffer.get(1))
        .setMessageType(UnexpectedContent.TYPE)
        .setMessageCode(UnexpectedContent.CODE)
        .setMessageData(UnexpectedContent.Data.BLUEPRINT, UnidocBlueprint.tagEnd('red'))
        .produce()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('throw if a tag was not opened', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint.Tag = (
        UnidocBlueprint.tag().thatMatch(UnidocPredicate.is(
          UnidocSelector.tagName(),
          UnidocPredicate.match(/red|green|blue/i)
        ))
      )

      test.execute(blueprint)

      test.input.initialize().complete()

      test.expectation.initialize()
      test.expectation.branches.first
        .documentCompletion()
        .setMessageType(RequiredContent.TYPE)
        .setMessageCode(RequiredContent.CODE)
        .setMessageData(RequiredContent.Data.BLUEPRINT, UnidocBlueprint.event(blueprint.predicate))
        .produce()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('throw if a tag was not closed', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.tag().thatMatch(UnidocPredicate.is(
          UnidocSelector.tagName(),
          UnidocPredicate.match(/red|green|blue/i)
        ))
      )

      test.execute(blueprint)

      test.input
        .initialize()
        .produceTagStart('red')
        .complete()

      test.expectation.initialize()
      test.expectation.branches.first
        .validate(test.inputBuffer.get(0))
        .documentCompletion()
        .setMessageType(RequiredContent.TYPE)
        .setMessageCode(RequiredContent.CODE)
        .setMessageData(RequiredContent.Data.BLUEPRINT, UnidocBlueprint.tagEnd('red'))
        .produce()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })
  })

  describe('combinations', function() {
    it('accept circular combinations', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const tag: UnidocBlueprint.Tag = (
        UnidocBlueprint.tag().thatMatch(UnidocPredicate.is(
          UnidocSelector.tagName(),
          UnidocPredicate.match(/red|green|blue/i)
        ))
      )
      const blueprint: UnidocBlueprint = UnidocBlueprint.many(tag).upTo(3)

      tag.withContent(blueprint)

      test.execute(blueprint)

      test.input.initialize()
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

      test.expectation.initialize()
      for (let index = 0; index < 12; ++index) {
        test.expectation.branches.first
          .validate(test.inputBuffer.get(index))
      }
      test.expectation.branches.first.documentCompletion()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('does not infinite loop when a inner path of a many operator results in an empty path', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const text: UnidocBlueprint = (
        UnidocBlueprint.many(
          UnidocBlueprint.disjunction(
            UnidocBlueprint.whitespace(),
            UnidocBlueprint.word()
          )
        )
      )
      const emphasize: UnidocBlueprint = (
        UnidocBlueprint.sequence(
          UnidocBlueprint.tagStart('emphasize'),
          text,
          UnidocBlueprint.tagEnd('emphasize')
        )
      )
      const blueprint: UnidocBlueprint = UnidocBlueprint.sequence(
        UnidocBlueprint.many(
          UnidocBlueprint.disjunction(
            emphasize,
            text
          )
        ),
        UnidocBlueprint.end()
      )

      test.execute(blueprint)

      test.input.initialize()
      test.input.produceText('Lorem ipsum dolor sit ')
      test.input.produceTagStart('emphasize')
      test.input.produceWord('amet')
      test.input.produceTagEnd('emphasize')
      test.input.produceText(' at consequetur nothing to say.')
      test.input.complete()

      test.expectation.initialize()
      for (const event of test.inputBuffer) {
        test.expectation.branches.get(0).validate(event)
      }
      test.expectation.branches.get(0).documentCompletion()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('optimize sets with optional content ', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const letters: string[] = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p'
      ]

      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.sequence(
          UnidocBlueprint.set(
            ...letters.map(function(letter: string): UnidocBlueprint {
              return UnidocBlueprint.optional(UnidocBlueprint.tagStart(letter))
            })
          ),
          UnidocBlueprint.end()
        )
      )

      test.execute(blueprint)

      test.input.initialize()
      for (const letter of ['c', 'd', 'e', 'h', 'i', 'j', 'k', 'l', 'o']) {
        test.input.produceTagStart(letter)
      }
      test.input.complete()

      test.expectation.initialize()
      for (const event of test.inputBuffer) {
        test.expectation.branches.get(0).validate(event)
      }
      test.expectation.branches.get(0).documentCompletion()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })

    it('optimize lenient sequence with optional content ', function() {
      const test: UnidocBlueprintValidatorTestCase = new UnidocBlueprintValidatorTestCase()
      const letters: string[] = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p'
      ]

      const blueprint: UnidocBlueprint = (
        UnidocBlueprint.sequence(
          UnidocBlueprint.sequence.lenient(
            ...letters.map(function(letter: string): UnidocBlueprint {
              return UnidocBlueprint.optional(UnidocBlueprint.tagStart(letter))
            })
          ),
          UnidocBlueprint.end()
        )
      )

      test.execute(blueprint)

      test.input.initialize()
      for (const letter of ['c', 'd', 'e', 'h', 'i', 'j', 'k', 'l', 'o']) {
        test.input.produceTagStart(letter)
      }
      test.input.complete()

      test.expectation.initialize()
      for (const event of test.inputBuffer) {
        test.expectation.branches.get(0).validate(event)
      }
      test.expectation.branches.get(0).documentCompletion()
      test.expectation.complete()

      expect(test.selectorBuffer).toEqualTheSequence(test.expectationBuffer)
    })
  })
})
