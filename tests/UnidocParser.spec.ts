/** eslint-env jest */

import { UnidocParser } from '../sources/parser/UnidocParser'
import { UnidocToken } from '../sources/token/UnidocToken'
import { UnidocLocation } from '../sources/UnidocLocation'
import { UnidocPath } from '../sources/path/UnidocPath'
import { UnidocLocationTracker } from '../sources/stream/UnidocLocationTracker'
import { UnidocTokenBuffer } from '../sources/token/UnidocTokenBuffer'
import { UnidocEventBuffer } from '../sources/event/UnidocEventBuffer'

function ending (content : string = '') : UnidocPath {
  const from : UnidocLocationTracker = new UnidocLocationTracker()

  for (let index = 0; index < content.length; ++index) {
    from.next(content.codePointAt(index) as number)
  }

  return UnidocPath.create(1).pushStream(from.location)
}

function createCursor () : any {
  const from : UnidocLocationTracker = new UnidocLocationTracker()

  return function (content : string = '') : UnidocPath {
    for (let index = 0; index < content.length; ++index) {
      from.next(content.codePointAt(index) as number)
    }

    return UnidocPath.create(1).pushStream(from.location)
  }
}

describe('UnidocParser', function () {
  describe('document tag recognition', function () {
    it('emit a document starting event when a word is discovered', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      parser.next(UnidocToken.word(ending(), ending('test'), 'test'))

      expectation.pushTagStart(ending(), ending(), 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('emit a document starting event when a class is discovered', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      parser.next(UnidocToken.clazz(ending(), ending('.test'), '.test'))

      expectation.pushTagStart(ending(), ending(), 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('emit a document starting event when an identifier is discovered', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      parser.next(UnidocToken.identifier(ending(), ending('#test'), '#test'))

      expectation.pushTagStart(ending(), ending(), 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('emit a document starting event when a tag is discovered', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      parser.next(UnidocToken.tag(ending(), ending('\\test'), '\\test'))

      expectation.pushTagStart(ending(), ending(), 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('emit a document starting event when a block opening is discovered', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      parser.next(UnidocToken.blockStart(ending(), ending('{')))

      expectation.pushTagStart(ending(), ending(), 'document')
      expectation.pushTagStart(ending(), ending('{'), 'block')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('emit a document ending event at completion', function () {
      const parser      : UnidocParser      = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      input.pushWord(ending(), ending('test'), 'test')

      for (const token of input) {
        parser.next(token)
      }
      parser.complete()

      expectation.pushTagStart(ending(), ending(), 'document')
      expectation.pushWord(ending(), ending('test'), 'test')
      expectation.pushTagEnd(ending('test'), ending('test'), 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('emit a document tag starting and ending event at completion if empty', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      parser.complete()

      expectation.pushTagStart(ending(), ending(), 'document')
      expectation.pushTagEnd(ending(), ending(), 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize the root document tag', function () {
      const parser      : UnidocParser      = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      const cursor : any = createCursor()
      input.pushNewline(cursor(), cursor('\n'), '\n')
      input.pushNewline(cursor(), cursor('\r\n'), '\r\n')
      input.pushSpace(cursor(), cursor('\t '), '\t ')
      input.pushTag(cursor(), cursor('\\doCuMent'), '\\doCuMent')
      input.pushSpace(cursor(), cursor('\t '), '\t ')
      input.pushClass(cursor(), cursor('.article'), '.article')
      input.pushClass(cursor(), cursor('.go'), '.go')
      input.pushIdentifier(cursor(), cursor('#pwet'), '#pwet')
      input.pushNewline(cursor(), cursor('\r\n'), '\r\n')
      input.pushClass(cursor(), cursor('.green'), '.green')
      input.pushSpace(cursor(), cursor(' '), '  ')
      input.pushNewline(cursor(), cursor('\r\n'), '\r\n')
      input.pushNewline(cursor(), cursor('\r\n'), '\r\n')
      input.pushClass(cursor(), cursor('.blue'), '.blue')
      input.pushSpace(cursor(), cursor('  '), '  ')
      input.pushWord(cursor(), cursor('test'), 'test')

      for (const token of input) {
        parser.next(token)
      }
      parser.complete()

      expectation.pushTagStart(input.from, input.slice(0, 14).to, 'document#pwet.article.go.green.blue')
      expectation.pushWhitespace(input.get(14).from, input.get(14).to, '  ')
      expectation.pushWord(input.get(15).from, input.get(15).to, 'test')
      expectation.pushTagEnd(input.to, input.to, 'document#pwet.article.go.green.blue')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize the root document with a class and followed by a tag', function () {
      const parser      : UnidocParser      = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      const cursor : any = createCursor()
      input.pushTag(cursor(), cursor('\\document'), '\\document')
      input.pushClass(cursor(), cursor('.ruleset'), '.ruleset')
      input.pushNewline(cursor(), cursor('\r\n'), '\r\n')
      input.pushNewline(cursor(), cursor('\r\n'), '\r\n')
      input.pushTag(cursor(), cursor('\\title'), '\\title')
      input.pushSpace(cursor(), cursor('  '), '  ')
      input.pushIdentifier(cursor(), cursor('#characteristics'), '#characteristics')
      input.pushSpace(cursor(), cursor('  '), '  ')
      input.pushBlockStart(cursor(), cursor('{'))
      input.pushSpace(cursor(), cursor('  '), '  ')
      input.pushWord(cursor(), cursor('green'), 'green')
      input.pushSpace(cursor(), cursor('  '), '  ')
      input.pushBlockEnd(cursor(), cursor('}'))
      input.pushNewline(cursor(), cursor('\r\n'), '\r\n')

      for (const token of input) {
        parser.next(token)
      }
      parser.complete()

      expectation.pushTagStart(input.from, input.slice(0, 2).to, 'document.ruleset')
      expectation.pushWhitespace(input.slice(2, 2).from, input.slice(2, 2).to, input.slice(2, 2).text)
      expectation.pushTagStart(input.slice(4, 4).from, input.slice(4, 4).to, 'title#characteristics')
      expectation.pushWhitespace(input.slice(9, 1).from, input.slice(9, 1).to, input.slice(9, 1).text)
      expectation.pushWord(input.slice(10, 1).from, input.slice(10, 1).to, input.slice(10, 1).text)
      expectation.pushWhitespace(input.slice(11, 1).from, input.slice(11, 1).to, input.slice(11, 1).text)
      expectation.pushTagEnd(input.slice(12, 1).from, input.slice(12, 1).to, 'title#characteristics')
      expectation.pushWhitespace(input.slice(13, 1).from, input.slice(13, 1).to, input.slice(13, 1).text)
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

      const cursor : any = createCursor()
      input.pushSpace(cursor(), cursor('   '), '   ')
      input.pushSpace(cursor(), cursor('\t'), '\t')
      input.pushSpace(cursor(), cursor('\t\f'), '\t\f ')
      input.pushSpace(cursor(), cursor('  '), '  ')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(input.from, input.from, 'document')
      expectation.pushWhitespace(input.from, input.to, input.text)
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize sequence of newline tokens', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      const cursor : any = createCursor()
      input.pushNewline(cursor(), cursor('\n'), '\n')
      input.pushNewline(cursor(), cursor('\r\n'), '\r\n')
      input.pushNewline(cursor(), cursor('\r'), '\r')
      input.pushNewline(cursor(), cursor('\r\n'), '\r\n')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(input.from, input.from, 'document')
      expectation.pushWhitespace(input.from, input.to, input.text)
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize sequence of both newline and space tokens', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      const cursor : any = createCursor()
      input.pushNewline(cursor(), cursor('\n'), '\n')
      input.pushSpace(cursor(), cursor(' \t\t\f'), ' \t\t\f')
      input.pushNewline(cursor(), cursor('\r'), '\r')
      input.pushNewline(cursor(), cursor('\r\n'), '\r\n')
      input.pushSpace(cursor(), cursor('  \f'), '  \f')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(input.from, input.from, 'document')
      expectation.pushWhitespace(input.from, input.to, input.text)
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize whitespace when other type of tokens are discovered', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      const cursor : any = createCursor()
      input.pushNewline(cursor(), cursor('\n'), '\n')
      input.pushSpace(cursor(), cursor(' \t\t\f'), ' \t\t\f')
      input.pushNewline(cursor(), cursor('\r'), '\r')
      input.pushNewline(cursor(), cursor('\r\n'), '\r\n')
      input.pushWord(cursor(), cursor('qwerty'), 'qwerty')

      for (const token of input) {
        parser.next(token)
      }

      expectation.pushTagStart(input.from, input.from, 'document')
      expectation.pushWhitespace(input.from, input.slice(0, input.size - 1).to, input.slice(0, input.size - 1).text)

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize whitespace between words', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      const cursor : any = createCursor()
      input.pushWord(cursor(), cursor('zwrtyt'), 'zwrtyt')
      input.pushNewline(cursor(), cursor('\n'), '\n')
      input.pushSpace(cursor(), cursor('\t\t\f'), ' \t\t\f')
      input.pushNewline(cursor(), cursor('\r'), '\r')
      input.pushNewline(cursor(), cursor('\r\n'), '\r\n')
      input.pushWord(cursor(), cursor('qwerty'), 'qwerty')

      for (const token of input) {
        parser.next(token)
      }

      expectation.pushTagStart(input.from, input.from, 'document')
      expectation.pushWord(input.from, input.get(0).to, 'zwrtyt')
      expectation.pushWhitespace(input.slice(0, 1).to, input.slice(1, input.size - 2).to, input.slice(1, input.size - 2).text)

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

      const cursor : any = createCursor()
      input.pushWord(cursor(), cursor('awe'), 'awe')
      input.pushWord(cursor(), cursor('a'), 'a')
      input.pushWord(cursor(), cursor('ioP'), 'ioP')
      input.pushWord(cursor(), cursor('nt'), 'nt')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(input.from, input.from, 'document')
      expectation.pushWord(input.from, input.to, input.text)
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize word when other type of tokens are discovered', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      const cursor : any = createCursor()
      input.pushWord(cursor(), cursor('awe'),'awe')
      input.pushWord(cursor(), cursor('a'),'a')
      input.pushWord(cursor(), cursor('ioP'),'ioP')
      input.pushWord(cursor(), cursor('nt'),'nt')
      input.pushBlockStart(cursor(), cursor('{'))

      for (const token of input) {
        parser.next(token)
      }

      expectation.pushTagStart(input.from, input.from, 'document')
      expectation.pushWord(input.from, input.slice(0, input.size - 1).to, input.slice(0, input.size - 1).text)
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

      const cursor : any = createCursor()
      input.pushBlockStart(cursor(), cursor('{'))
      input.pushBlockEnd(cursor(), cursor('}'))

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(input.from, input.from, 'document')
      expectation.pushTagStart(input.first.from, input.first.to, 'block')
      expectation.pushTagEnd(input.last.from, input.last.to, 'block')
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize singleton tags before text', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      const cursor : any = createCursor()
      input.pushTag(cursor(), cursor('\\emphasize'), '\\emphasize')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushWord(cursor(), cursor('text'), 'text')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(input.from, input.from, 'document')
      expectation.pushTagStart(input.first.from, input.first.to, 'emphasize')
      expectation.pushTagEnd(input.first.to, input.first.to, 'emphasize')
      expectation.pushWhitespace(input.get(input.size - 1).from, input.get(input.size - 2).to, input.get(input.size - 2).text)
      expectation.pushWord(input.last.from, input.last.to, input.last.text)
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize singleton tags before tags', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      const cursor : any = createCursor()
      input.pushTag(cursor(), cursor('\\emphasize'), '\\emphasize')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushTag(cursor(), cursor('\\emphasize'), '\\emphasize')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushWord(cursor(), cursor('text'), 'text')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(input.from, input.from, 'document')
      expectation.pushTagStart(input.first.from, input.first.to, 'emphasize')
      expectation.pushTagEnd(input.first.to, input.first.to, 'emphasize')
      expectation.pushWhitespace(input.get(1).from, input.get(1).to, input.get(1).text)
      expectation.pushTagStart(input.get(2).from, input.get(2).to, 'emphasize')
      expectation.pushTagEnd(input.get(2).to, input.get(2).to, 'emphasize')
      expectation.pushWhitespace(input.get(input.size - 1).from, input.get(input.size - 2).to, input.get(input.size - 2).text)
      expectation.pushWord(input.last.from, input.last.to, input.last.text)
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize singleton tags with classes', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      const cursor : any = createCursor()
      input.pushTag(cursor(), cursor('\\emphasize'), '\\emphasize')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushClass(cursor(), cursor('.yellow'), '.yellow')
      input.pushClass(cursor(), cursor('.green'), '.green')
      input.pushClass(cursor(), cursor('.blue'), '.blue')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushWord(cursor(), cursor('text'), 'text')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(input.from, input.from, 'document')
      expectation.pushTagStart(input.first.from, input.slice(0, 5).to, 'emphasize.yellow.green.blue')
      expectation.pushTagEnd(input.slice(0, 5).to, input.slice(0, 5).to, 'emphasize.yellow.green.blue')
      expectation.pushWhitespace(input.get(input.size - 2).from, input.get(input.size - 2).to, input.get(input.size - 2).text)
      expectation.pushWord(input.last.from, input.last.to, input.last.text)
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize singleton tags with identifier', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      const cursor : any = createCursor()
      input.pushTag(cursor(), cursor('\\emphasize'), '\\emphasize')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushIdentifier(cursor(), cursor('#yellow'), '#yellow')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushWord(cursor(), cursor('text'), 'text')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(input.from, input.from, 'document')
      expectation.pushTagStart(input.first.from, input.slice(0, 3).to, 'emphasize#yellow')
      expectation.pushTagEnd(input.slice(0, 3).to, input.slice(0, 3).to, 'emphasize#yellow')
      expectation.pushWhitespace(input.get(input.size - 2).from, input.get(input.size - 2).to, input.get(input.size - 2).text)
      expectation.pushWord(input.last.from, input.last.to, input.last.text)
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize singleton tags with identifier and classes', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      const cursor : any = createCursor()
      input.pushTag(cursor(), cursor('\\emphasize'), '\\emphasize')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushClass(cursor(), cursor('.green'), '.green')
      input.pushClass(cursor(), cursor('.blue'), '.blue')
      input.pushIdentifier(cursor(), cursor('#yellow'), '#yellow')
      input.pushClass(cursor(), cursor('.red'), '.red')
      input.pushClass(cursor(), cursor('.purple'), '.purple')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushWord(cursor(), cursor('text'), 'text')

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(input.first.from, input.first.from, 'document')
      expectation.pushTagStart(input.first.from, input.slice(0, 7).to, 'emphasize#yellow.green.blue.red.purple')
      expectation.pushTagEnd(input.slice(0, 7).to, input.slice(0, 7).to, 'emphasize#yellow.green.blue.red.purple')
      expectation.pushWhitespace(input.get(input.size - 2).from, input.get(input.size - 2).to, input.get(input.size - 2).text)
      expectation.pushWord(input.last.from, input.last.to, input.last.text)
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })

    it('recognize block tags', function () {
      const parser      : UnidocParser = new UnidocParser()
      const input       : UnidocTokenBuffer = new UnidocTokenBuffer(4)
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)
      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', event => output.push(event))

      const cursor : any = createCursor()
      input.pushTag(cursor(), cursor('\\emphasize'), '\\emphasize')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushBlockStart(cursor(), cursor('{'))
      input.pushWord(cursor(), cursor('text'), 'text')
      input.pushBlockEnd(cursor(), cursor('}'))

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(input.from, input.from, 'document')
      expectation.pushTagStart(input.first.from, input.slice(0, 3).to, 'emphasize')
      expectation.pushWord(input.get(3).from, input.get(3).to, input.get(3).text)
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

      const cursor : any = createCursor()
      input.pushTag(cursor(), cursor('\\emphasize'), '\\emphasize')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushClass(cursor(), cursor('.yellow'), '.yellow')
      input.pushClass(cursor(), cursor('.green'),'.green')
      input.pushClass(cursor(), cursor('.blue'),'.blue')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushBlockStart(cursor(), cursor('{'))
      input.pushWord(cursor(), cursor('text'), 'text')
      input.pushBlockEnd(cursor(), cursor('}'))

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(input.first.from, input.first.from, 'document')
      expectation.pushTagStart(input.first.from, input.slice(0, 7).to, 'emphasize.yellow.green.blue')
      expectation.pushWord(input.get(7).from, input.get(7).to, input.get(7).text)
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

      const cursor : any = createCursor()
      input.pushTag(cursor(), cursor('\\emphasize'), '\\emphasize')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushIdentifier(cursor(), cursor('#yellow'), '#yellow')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushBlockStart(cursor(), cursor('{'))
      input.pushWord(cursor(), cursor('text'), 'text')
      input.pushBlockEnd(cursor(), cursor('}'))

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(input.first.from, input.first.from, 'document')
      expectation.pushTagStart(input.first.from, input.slice(0, 5).to, 'emphasize#yellow')
      expectation.pushWord(input.get(5).from, input.get(5).to, input.get(5).text)
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

      const cursor : any = createCursor()
      input.pushTag(cursor(), cursor('\\emphasize'), '\\emphasize')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushClass(cursor(), cursor('.green'), '.green')
      input.pushClass(cursor(), cursor('.blue'), '.blue')
      input.pushIdentifier(cursor(), cursor('#yellow'), '#yellow')
      input.pushClass(cursor(), cursor('.red'), '.red')
      input.pushClass(cursor(), cursor('.purple'), '.purple')
      input.pushSpace(cursor(), cursor(' '), ' ')
      input.pushBlockStart(cursor(), cursor('{'))
      input.pushWord(cursor(), cursor('text'), 'text')
      input.pushBlockEnd(cursor(), cursor('}'))

      for (const token of input) {
        parser.next(token)
      }

      parser.complete()

      expectation.pushTagStart(input.first.from, input.first.from, 'document')
      expectation.pushTagStart(input.first.from, input.slice(0, 9).to, 'emphasize#yellow.green.blue.red.purple')
      expectation.pushWord(input.get(9).from, input.get(9).to, input.get(9).text)
      expectation.pushTagEnd(input.last.from, input.last.to, 'emphasize#yellow.green.blue.red.purple')
      expectation.pushTagEnd(input.to, input.to, 'document')

      expect(() => UnidocEventBuffer.assert(expectation, output)).not.toThrow()
    })
  })
})
