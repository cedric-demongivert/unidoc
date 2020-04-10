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

  describe('location tracking', function () {
    it ('compute the next location after a block opening', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.OPENING_BRACE)

      expect(lexer.location.equals(new UnidocLocation(0, 1, 1))).toBeTruthy()
    })

    it ('compute the next location after a block closing', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.location.equals(UnidocLocation.ZERO)).toBeTruthy()

      lexer.nextCodePoint(CodePoint.CLOSING_BRACE)

      expect(lexer.location.equals(new UnidocLocation(0, 1, 1))).toBeTruthy()
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

  describe('block opening recognition', function () {
    it('recognize block opening', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('{{{')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushBlockStart()
      expectation.pushBlockStart()
      expectation.pushBlockStart()

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('block closing recognition', function () {
    it ('recognize block closing', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('}}}')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushBlockEnd()
      expectation.pushBlockEnd()
      expectation.pushBlockEnd()

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('tag recognition', function () {
    it ('recognize tags', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('\\alberta\\Chicago\\3d\\--meow-w')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushTag('\\alberta')
      expectation.pushTag('\\Chicago')
      expectation.pushTag('\\3d')
      expectation.pushTag('\\--meow-w')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize tags when they are followed by a class', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('\\alberta.')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushTag('\\alberta')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize tags when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('\\alberta ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushTag('\\alberta')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize tags when they are followed by an identifier', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('\\alberta#')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushTag('\\alberta')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('class recognition', function () {
    it ('recognize classes', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('.alberta.Chicago.3d.--meow-w')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushClass('.alberta')
      expectation.pushClass('.Chicago')
      expectation.pushClass('.3d')
      expectation.pushClass('.--meow-w')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize classes when they are followed by an identifier', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('.alberta#')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushClass('.alberta')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize classes when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('.alberta ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushClass('.alberta')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize classes when they are followed by a tag', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('.alberta\\')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushClass('.alberta')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('identifier recognition', function () {
    it ('recognize identifiers', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('#alberta#Chicago#3d#--meow-w')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushIdentifier('#alberta')
      expectation.pushIdentifier('#Chicago')
      expectation.pushIdentifier('#3d')
      expectation.pushIdentifier('#--meow-w')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize identifiers when they are followed by a class', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('#alberta.')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushIdentifier('#alberta')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize identifiers when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('#alberta ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushIdentifier('#alberta')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize identifiers when they are followed by a tag', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('#alberta\\')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushIdentifier('#alberta')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('word recognition', function () {
    it ('recognize words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(16)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('only 1 test on this str#ing')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(16)
      expectation.pushWord('only')
      expectation.pushSpace(' ')
      expectation.pushWord('1')
      expectation.pushSpace(' ')
      expectation.pushWord('test')
      expectation.pushSpace(' ')
      expectation.pushWord('on')
      expectation.pushSpace(' ')
      expectation.pushWord('this')
      expectation.pushSpace(' ')
      expectation.pushWord('str#ing')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated classes as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('.acuriousαclass ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushWord('.acuriousαclass')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated classes as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('..acuriousclass ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushWord('..acuriousclass')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated identifiers as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('#acuriousαidentifier ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushWord('#acuriousαidentifier')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated identifiers as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('##acuriousidentifier ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushWord('##acuriousidentifier')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated tags as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('\\acuriousαtag ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushWord('\\acuriousαtag')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated tags as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('\\\\acurioustag ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushWord('\\\\acurioustag')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize dot as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('. ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushWord('.')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize sharp as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('# ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushWord('#')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize antislash as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('\\ ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushWord('\\')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize words that contains dots', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('alberta.test. ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushWord('alberta.test.')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('alberta ')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushWord('alberta')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a tag', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('alberta\\')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushWord('alberta')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a block termination', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('alberta}')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushWord('alberta')
      expectation.pushBlockEnd()

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a block start', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('alberta{')

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushWord('alberta')
      expectation.pushBlockStart()

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('newline recognition', function () {
    it ('recognize newlines', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString('\r\n\n\r\r')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushNewline('\r\n')
      expectation.pushNewline('\n')
      expectation.pushNewline('\r')
      expectation.pushNewline('\r')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('space recognition', function () {
    it ('recognize spaces', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      lexer.nextString(' \f\t\t ')
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.pushSpace(' \f\t\t ')

      expect(_ => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })
})
