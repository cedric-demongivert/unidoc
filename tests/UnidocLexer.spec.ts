/** eslint-env jest */

import { UnidocLexer } from '../sources/typescript/lexer/UnidocLexer'
import { UnidocLexerState } from '../sources/typescript/lexer/UnidocLexerState'
import { CodePoint } from '../sources/typescript/CodePoint'
import { UnidocLocation } from '../sources/typescript/UnidocLocation'
import { UnidocTokenBuffer } from '../sources/typescript/token/UnidocTokenBuffer'


describe('UnidocLexer', function () {
  describe('#constructor', function () {
    it('instantiate a new lexer', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.state).toBe(UnidocLexerState.START)
      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()
    })
  })

  describe('block opening recognition', function () {
    it ('recognize bloc opening', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('{{{')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.blockStart()
      expectation.blockStart()
      expectation.blockStart()
      expectation.handleCompletion()

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('compute the next location after a block opening', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.OPENING_BRACE)

      expect(lexer.location.equals(new UnidocLocation(0, 1, 1))).toBeTruthy()
    })
  })

  describe('block closing recognition', function () {
    it ('recognize bloc closing', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('}}}')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.blockEnd()
      expectation.blockEnd()
      expectation.blockEnd()
      expectation.handleCompletion()

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('compute the next location after a block closing', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.CLOSING_BRACE)

      expect(lexer.location.equals(new UnidocLocation(0, 1, 1))).toBeTruthy()
    })
  })

  describe('tag recognition', function () {
    it ('recognize tags', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('\\alberta\\Chicago\\3d\\--meow-w')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.tag('\\alberta')
      expectation.tag('\\Chicago')
      expectation.tag('\\3d')
      expectation.tag('\\--meow-w')
      expectation.handleCompletion()

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize tags when they are followed by a class', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('\\alberta.')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.tag('\\alberta')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize tags when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('\\alberta ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.tag('\\alberta')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize tags when they are followed by an identifier', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('\\alberta#')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.tag('\\alberta')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('compute the next location after a tag', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextString('\\alberta')

      expect(lexer.location.equals(new UnidocLocation(0, 8, 8))).toBeTruthy()
    })

    it ('compute the next location after a tag', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.ANTISLASH)

      expect(lexer.location.equals(new UnidocLocation(0, 1, 1))).toBeTruthy()

      lexer.nextCodePoint(CodePoint.a)

      expect(lexer.location.equals(new UnidocLocation(0, 2, 2))).toBeTruthy()

      lexer.nextCodePoint(CodePoint.l)

      expect(lexer.location.equals(new UnidocLocation(0, 3, 3))).toBeTruthy()

      lexer.nextCodePoint(CodePoint.b)

      expect(lexer.location.equals(new UnidocLocation(0, 4, 4))).toBeTruthy()
    })
  })

  describe('class recognition', function () {
    it ('recognize classes', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('.alberta.Chicago.3d.--meow-w')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.clazz('.alberta')
      expectation.clazz('.Chicago')
      expectation.clazz('.3d')
      expectation.clazz('.--meow-w')
      expectation.handleCompletion()

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize classes when they are followed by an identifier', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('.alberta#')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.clazz('.alberta')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize classes when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('.alberta ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.clazz('.alberta')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize classes when they are followed by a tag', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('.alberta\\')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.clazz('.alberta')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('compute the next location after a class', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextString('.alberta')

      expect(lexer.location.equals(new UnidocLocation(0, 8, 8))).toBeTruthy()
    })

    it ('compute the next location after a class', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.DOT)

      expect(lexer.location.equals(new UnidocLocation(0, 1, 1))).toBeTruthy()

      lexer.nextCodePoint(CodePoint.a)

      expect(lexer.location.equals(new UnidocLocation(0, 2, 2))).toBeTruthy()

      lexer.nextCodePoint(CodePoint.l)

      expect(lexer.location.equals(new UnidocLocation(0, 3, 3))).toBeTruthy()

      lexer.nextCodePoint(CodePoint.b)

      expect(lexer.location.equals(new UnidocLocation(0, 4, 4))).toBeTruthy()
    })
  })

  describe('identifier recognition', function () {
    it ('recognize identifiers', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('#alberta#Chicago#3d#--meow-w')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.identifier('#alberta')
      expectation.identifier('#Chicago')
      expectation.identifier('#3d')
      expectation.identifier('#--meow-w')
      expectation.handleCompletion()

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize identifiers when they are followed by a class', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('#alberta.')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.identifier('#alberta')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize identifiers when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('#alberta ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.identifier('#alberta')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize identifiers when they are followed by a tag', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('#alberta\\')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.identifier('#alberta')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('compute the next location after an identifier', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextString('#alberta')

      expect(lexer.location.equals(new UnidocLocation(0, 8, 8))).toBeTruthy()
    })

    it ('compute the next location after an identifier', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.SHARP)

      expect(lexer.location.equals(new UnidocLocation(0, 1, 1))).toBeTruthy()

      lexer.nextCodePoint(CodePoint.a)

      expect(lexer.location.equals(new UnidocLocation(0, 2, 2))).toBeTruthy()

      lexer.nextCodePoint(CodePoint.l)

      expect(lexer.location.equals(new UnidocLocation(0, 3, 3))).toBeTruthy()

      lexer.nextCodePoint(CodePoint.b)

      expect(lexer.location.equals(new UnidocLocation(0, 4, 4))).toBeTruthy()
    })
  })

  describe('word recognition', function () {
    it ('recognize words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('only 1 test on this str#ing')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.word('only')
      expectation.space(' ')
      expectation.word('1')
      expectation.space(' ')
      expectation.word('test')
      expectation.space(' ')
      expectation.word('on')
      expectation.space(' ')
      expectation.word('this')
      expectation.space(' ')
      expectation.word('str#ing')
      expectation.handleCompletion()

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize degenerated classes as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('.acuriousαclass ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.word('.acuriousαclass')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize degenerated classes as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('..acuriousclass ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.word('..acuriousclass')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize degenerated identifiers as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('#acuriousαidentifier ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.word('#acuriousαidentifier')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize degenerated identifiers as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('##acuriousidentifier ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.word('##acuriousidentifier')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize degenerated tags as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('\\acuriousαtag ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.word('\\acuriousαtag')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize degenerated tags as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('\\\\acurioustag ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.word('\\\\acurioustag')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize dot as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('. ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.word('.')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize sharp as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('# ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.word('#')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize antislash as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('\\ ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.word('\\')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize words that contains dots', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('alberta.test. ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.word('alberta.test.')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('alberta ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.word('alberta')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a tag', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('alberta\\')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.word('alberta')

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a block termination', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('alberta}')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.word('alberta')
      expectation.blockEnd()

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a block start', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('alberta{')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.word('alberta')
      expectation.blockStart()

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('compute the next location after a word', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextString('alberta')

      expect(lexer.location.equals(new UnidocLocation(0, 7, 7))).toBeTruthy()
    })

    it ('compute the next location after a word', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.a)

      expect(lexer.location.equals(new UnidocLocation(0, 1, 1))).toBeTruthy()

      lexer.nextCodePoint(CodePoint.l)

      expect(lexer.location.equals(new UnidocLocation(0, 2, 2))).toBeTruthy()

      lexer.nextCodePoint(CodePoint.b)

      expect(lexer.location.equals(new UnidocLocation(0, 3, 3))).toBeTruthy()
    })
  })

  describe('newline recognition', function () {
    it ('recognize newlines', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString('\r\n\n\r\r')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.newline('\r\n')
      expectation.newline('\n')
      expectation.newline('\r')
      expectation.newline('\r')
      expectation.handleCompletion()

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('compute the next location after a carriage return', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.CARRIAGE_RETURN)

      expect(lexer.location.equals(new UnidocLocation(1, 0, 1))).toBeTruthy()
    })

    it ('compute the next location after a newline', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.NEW_LINE)

      expect(lexer.location.equals(new UnidocLocation(1, 0, 1))).toBeTruthy()
    })

    it ('compute the next location after a unix/windows line termination', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.CARRIAGE_RETURN)
      lexer.nextCodePoint(CodePoint.NEW_LINE)

      expect(lexer.location.equals(new UnidocLocation(1, 0, 2))).toBeTruthy()
    })
  })

  describe('space recognition', function () {
    it ('recognize spaces', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.listen(lexer)

      lexer.nextString(' \f\t\t ')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.space(' \f\t\t ')
      expectation.handleCompletion()

      expect(_ => output.assert(expectation)).not.toThrow()
    })

    it ('compute the next location after a space', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.SPACE)

      expect(lexer.location.equals(new UnidocLocation(0, 1, 1))).toBeTruthy()
    })

    it ('compute the next location after a tabulation', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.TABULATION)

      expect(lexer.location.equals(new UnidocLocation(0, 1, 1))).toBeTruthy()
    })

    it ('compute the next location after a form feed', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.FORM_FEED)

      expect(lexer.location.equals(new UnidocLocation(0, 1, 1))).toBeTruthy()
    })
  })
})
