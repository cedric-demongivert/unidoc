/** eslint-env jest */

import { UnidocParser } from '../sources/parser/UnidocParser'
import { UnidocToken } from '../sources/token/UnidocToken'
import { UnidocLocation } from '../sources/UnidocLocation'
import { UnidocTokenBuffer } from '../sources/token/UnidocTokenBuffer'
import { UnidocEventBuffer } from '../sources/event/UnidocEventBuffer'

describe('UnidocParser', function () {
  describe('document tag recognition', function () {
    it('emit a document starting event when a word is discovered', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      parser.next(UnidocToken.word(UnidocLocation.ZERO, 'test'))

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('emit a document starting event when a class is discovered', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      parser.next(UnidocToken.clazz(UnidocLocation.ZERO, '.test'))

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('emit a document starting event when an identifier is discovered', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      parser.next(UnidocToken.identifier(UnidocLocation.ZERO, '#test'))

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('emit a document starting event when a tag is discovered', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      parser.next(UnidocToken.tag(UnidocLocation.ZERO, '\\test'))

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('emit a document starting event when a block opening is discovered', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      parser.next(UnidocToken.blockStart(UnidocLocation.ZERO))

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushTagStart(UnidocLocation.ZERO, UnidocToken.blockStart(UnidocLocation.ZERO).to, 'block')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('emit a document ending event at completion', function () {
      const parser      : UnidocParser      = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushWord('test')

      for (const token of input) {
        parser.next(token)
      }
      parser.complete()

      expectation.pushTagStart(input.from, input.from, 'document')
      expectation.pushWord(input.from, 'test')
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('emit a document tag starting and ending event at completion if empty', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      parser.complete()

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushTagEnd(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize the root document tag', function () {
      const parser      : UnidocParser      = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushNewline('\n')
      input.pushNewline('\r\n')
      input.pushSpace('\t ')
      input.pushTag('\\doCuMent')
      input.pushSpace('\t ')
      input.pushClass('.article')
      input.pushClass('.go')
      input.pushIdentifier('#pwet')
      input.pushNewline('\r\n')
      input.pushClass('.green')
      input.pushSpace('  ')
      input.pushNewline('\r\n')
      input.pushNewline('\r\n')
      input.pushClass('.blue')
      input.pushSpace('  ')
      input.pushWord('test')

      for (const token of input) {
        parser.next(token)
      }
      parser.complete()

      expectation.pushTagStart(input.from, input.slice(0, 14).to, 'document#pwet.article.go.green.blue')
      expectation.pushWhitespace(input.slice(0, 14).to, '  ')
      expectation.pushWord(input.slice(0, 15).to, 'test')
      expectation.pushTagEnd(input.to, input.to, 'document#pwet.article.go.green.blue')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize the root document with a class and followed by a tag', function () {
      const parser      : UnidocParser      = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushTag('\\document')
      input.pushClass('.ruleset')
      input.pushNewline('\r\n')
      input.pushNewline('\r\n')
      input.pushTag('\\title')
      input.pushSpace('  ')
      input.pushIdentifier('#characteristics')
      input.pushSpace('  ')
      input.pushBlockStart()
      input.pushSpace('  ')
      input.pushWord('green')
      input.pushSpace('  ')
      input.pushBlockEnd()
      input.pushNewline('\r\n')

      for (const token of input) {
        parser.next(token)
      }
      parser.complete()

      expectation.pushTagStart(input.from, input.slice(0, 2).to, 'document.ruleset')
      expectation.pushWhitespace(input.slice(2, 2).from, input.slice(2, 2).text)
      expectation.pushTagStart(input.slice(4, 4).from, input.slice(4, 4).to, 'title#characteristics')
      expectation.pushWhitespace(input.slice(9, 1).from, input.slice(9, 1).text)
      expectation.pushWord(input.slice(10, 1).from, input.slice(10, 1).text)
      expectation.pushWhitespace(input.slice(11, 1).from, input.slice(11, 1).text)
      expectation.pushTagEnd(input.slice(12, 1).from, input.slice(12, 1).to, 'title#characteristics')
      expectation.pushWhitespace(input.slice(13, 1).from, input.slice(13, 1).text)
      expectation.pushTagEnd(input.to, input.to, 'document.ruleset')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })
  })

  describe('whitespace recognition', function () {
    it('recognize sequence of space tokens', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushSpace('   ')
      input.pushSpace('\t')
      input.pushSpace('\t\f ')
      input.pushSpace('  ')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushWhitespace(input.from, input.text)
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize sequence of newline tokens', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushNewline('\n')
      input.pushNewline('\r\n')
      input.pushNewline('\r')
      input.pushNewline('\r\n')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushWhitespace(input.from, input.text)
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize sequence of both newline and space tokens', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushNewline('\n')
      input.pushSpace(' \t\t\f')
      input.pushNewline('\r')
      input.pushNewline('\r\n')
      input.pushSpace('  \f')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushWhitespace(input.from, input.text)
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize whitespace when other type of tokens are discovered', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushNewline('\n')
      input.pushSpace(' \t\t\f')
      input.pushNewline('\r')
      input.pushNewline('\r\n')
      input.pushWord('qwerty')

      for (const token of input) {
        parser.next(token)
      }

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushWhitespace(input.from, input.slice(0, input.size - 1).text)

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize whitespace between words', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushWord('zwrtyt')
      input.pushNewline('\n')
      input.pushSpace(' \t\t\f')
      input.pushNewline('\r')
      input.pushNewline('\r\n')
      input.pushWord('qwerty')

      for (const token of input) {
        parser.next(token)
      }

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushWord(input.from, 'zwrtyt')
      expectation.pushWhitespace(input.slice(0, 1).to, input.slice(1, input.size - 2).text)

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })
  })

  describe('word recognition', function () {
    it('recognize sequence of word tokens', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushWord('awe')
      input.pushWord('a')
      input.pushWord('ioP')
      input.pushWord('nt')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushWord(input.from, input.text)
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize word when other type of tokens are discovered', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushWord('awe')
      input.pushWord('a')
      input.pushWord('ioP')
      input.pushWord('nt')
      input.pushBlockStart()

      for (const token of input) {
        parser.next(token)
      }

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushWord(input.from, input.slice(0, input.size - 1).text)
      expectation.pushTagStart(input.last.from, input.last.to, 'block')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })
  })

  describe('tag recognition', function () {
    it('recognize blocks as block tag', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushBlockStart()
      input.pushBlockEnd()

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushTagStart(input.first.from, input.first.to, 'block')
      expectation.pushTagEnd(input.last.from, input.last.to, 'block')
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize singleton tags over text', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushTag('\\emphasize')
      input.pushSpace(' ')
      input.pushWord('text')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushTagStart(input.first.from, input.first.to, 'emphasize')
      expectation.pushWord(input.last.from, input.last.text)
      expectation.pushTagEnd(input.to, input.to, 'emphasize')
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize singleton tags over tag', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushTag('\\emphasize')
      input.pushSpace(' ')
      input.pushTag('\\emphasize')
      input.pushSpace(' ')
      input.pushWord('text')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushTagStart(input.first.from, input.first.to, 'emphasize')
      expectation.pushTagStart(input.get(2).from, input.get(2).to, 'emphasize')
      expectation.pushWord(input.last.from, input.last.text)
      expectation.pushTagEnd(input.to, input.to, 'emphasize')
      expectation.pushTagEnd(input.to, input.to, 'emphasize')
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize singleton tags with classes', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushTag('\\emphasize')
      input.pushSpace(' ')
      input.pushClass('.yellow')
      input.pushClass('.green')
      input.pushClass('.blue')
      input.pushSpace(' ')
      input.pushWord('text')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushTagStart(input.first.from, input.slice(0, 5).to, 'emphasize.yellow.green.blue')
      expectation.pushWord(input.last.from, input.last.text)
      expectation.pushTagEnd(input.to, input.to, 'emphasize.yellow.green.blue')
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize singleton tags with identifier', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushTag('\\emphasize')
      input.pushSpace(' ')
      input.pushIdentifier('#yellow')
      input.pushSpace(' ')
      input.pushWord('text')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushTagStart(input.first.from, input.slice(0, 3).to, 'emphasize#yellow')
      expectation.pushWord(input.last.from, input.last.text)
      expectation.pushTagEnd(input.to, input.to, 'emphasize#yellow')
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize singleton tags with identifier and classes', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushTag('\\emphasize')
      input.pushSpace(' ')
      input.pushClass('.green')
      input.pushClass('.blue')
      input.pushIdentifier('#yellow')
      input.pushClass('.red')
      input.pushClass('.purple')
      input.pushSpace(' ')
      input.pushWord('text')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushTagStart(input.first.from, input.slice(0, 7).to, 'emphasize#yellow.green.blue.red.purple')
      expectation.pushWord(input.last.from, input.last.text)
      expectation.pushTagEnd(input.to, input.to, 'emphasize#yellow.green.blue.red.purple')
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize block tags', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushTag('\\emphasize')
      input.pushSpace(' ')
      input.pushBlockStart()
      input.pushWord('text')
      input.pushBlockEnd()

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushTagStart(input.first.from, input.slice(0, 3).to, 'emphasize')
      expectation.pushWord(input.get(3).from, input.get(3).text)
      expectation.pushTagEnd(input.last.from, input.last.to, 'emphasize')
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize block tags with classes', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushTag('\\emphasize')
      input.pushSpace(' ')
      input.pushClass('.yellow')
      input.pushClass('.green')
      input.pushClass('.blue')
      input.pushSpace(' ')
      input.pushBlockStart()
      input.pushWord('text')
      input.pushBlockEnd()

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushTagStart(input.first.from, input.slice(0, 7).to, 'emphasize.yellow.green.blue')
      expectation.pushWord(input.get(7).from, input.get(7).text)
      expectation.pushTagEnd(input.last.from, input.last.to, 'emphasize.yellow.green.blue')
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize block tags with identifier', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushTag('\\emphasize')
      input.pushSpace(' ')
      input.pushIdentifier('#yellow')
      input.pushSpace(' ')
      input.pushBlockStart()
      input.pushWord('text')
      input.pushBlockEnd()

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushTagStart(input.first.from, input.slice(0, 5).to, 'emphasize#yellow')
      expectation.pushWord(input.get(5).from, input.get(5).text)
      expectation.pushTagEnd(input.last.from, input.last.to, 'emphasize#yellow')
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize singleton tags with identifier and classes', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushTag('\\emphasize')
      input.pushSpace(' ')
      input.pushClass('.green')
      input.pushClass('.blue')
      input.pushIdentifier('#yellow')
      input.pushClass('.red')
      input.pushClass('.purple')
      input.pushSpace(' ')
      input.pushBlockStart()
      input.pushWord('text')
      input.pushBlockEnd()

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(UnidocLocation.ZERO, UnidocLocation.ZERO, 'document')
      expectation.pushTagStart(input.first.from, input.slice(0, 9).to, 'emphasize#yellow.green.blue.red.purple')
      expectation.pushWord(input.get(9).from, input.get(9).text)
      expectation.pushTagEnd(input.last.from, input.last.to, 'emphasize#yellow.green.blue.red.purple')
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })
  })
})
