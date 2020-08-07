/** eslint-env jest */

import { UnidocLexer } from '../sources/lexer/UnidocLexer'
import { UnidocSourceReader } from '../sources/stream/UnidocSourceReader'
import { UnidocLexerState } from '../sources/lexer/UnidocLexerState'
import { UnidocPath } from '../sources/path/UnidocPath'
import { UnidocLocation } from '../sources/UnidocLocation'
import { UnidocTokenBuffer } from '../sources/token/UnidocTokenBuffer'

describe('UnidocLexer', function () {
  describe('#constructor', function () {
    it('instantiate a new lexer', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.state).toBe(UnidocLexerState.START)
      expect(lexer.location.equals(UnidocPath.create(1).pushStream(UnidocLocation.ZERO))).toBeTruthy()
    })
  })

  describe('block opening recognition', function () {
    it('recognize block opening', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('{{{')) {
        lexer.next(symbol)
      }
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      for (const symbol of UnidocSourceReader.fromString('{{{')) {
        expectation.pushBlockStart(
          symbol.location.clone().snapToStart(),
          symbol.location.clone().snapToEnd()
        )
      }

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('block closing recognition', function () {
    it ('recognize block closing', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('}}}')) {
        lexer.next(symbol)
      }
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      for (const symbol of UnidocSourceReader.fromString('}}}')) {
        expectation.pushBlockEnd(
          symbol.location.clone().snapToStart(),
          symbol.location.clone().snapToEnd()
        )
      }

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('tag recognition', function () {
    it ('recognize tags', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('\\alberta\\Chicago\\3d\\--meow-w')) {
        lexer.next(symbol)
      }
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('\\alberta\\Chicago\\3d\\--meow-w')
      expectation.pushTag(
        content.next().location.clone().snapToStart(),
        content.skip('albert'.length).next().location.clone().snapToEnd(),
        '\\alberta'
      )
      expectation.pushTag(
        content.next().location.clone().snapToStart(),
        content.skip('Chicag'.length).next().location.clone().snapToEnd(),
        '\\Chicago'
      )
      expectation.pushTag(
        content.next().location.clone().snapToStart(),
        content.skip('3'.length).next().location.clone().snapToEnd(),
        '\\3d'
      )
      expectation.pushTag(
        content.next().location.clone().snapToStart(),
        content.skip('--meow-'.length).next().location.clone().snapToEnd(),
        '\\--meow-w'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize tags when they are followed by a class', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('\\alberta.')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('\\alberta.')
      expectation.pushTag(
        content.next().location.clone().snapToStart(),
        content.skip('albert'.length).next().location.clone().snapToEnd(),
        '\\alberta'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize tags when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('\\alberta ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('\\alberta ')
      expectation.pushTag(
        content.next().location.clone().snapToStart(),
        content.skip('albert'.length).next().location.clone().snapToEnd(),
        '\\alberta'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize tags when they are followed by an identifier', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('\\alberta#')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('\\alberta#')
      expectation.pushTag(
        content.next().location.clone().snapToStart(),
        content.skip('albert'.length).next().location.clone().snapToEnd(),
        '\\alberta'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('class recognition', function () {
    it ('recognize classes', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('.alberta.Chicago.3d.--meow-w')) {
        lexer.next(symbol)
      }
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('.alberta.Chicago.3d.--meow-w')
      expectation.pushClass(
        content.next().location.clone().snapToStart(),
        content.skip('albert'.length).next().location.clone().snapToEnd(),
        '.alberta'
      )
      expectation.pushClass(
        content.next().location.clone().snapToStart(),
        content.skip('Chicag'.length).next().location.clone().snapToEnd(),
        '.Chicago'
      )
      expectation.pushClass(
        content.next().location.clone().snapToStart(),
        content.skip('3'.length).next().location.clone().snapToEnd(),
        '.3d'
      )
      expectation.pushClass(
        content.next().location.clone().snapToStart(),
        content.skip('--meow-'.length).next().location.clone().snapToEnd(),
        '.--meow-w'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize classes when they are followed by an identifier', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('.alberta#')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('.alberta#')
      expectation.pushClass(
        content.next().location.clone().snapToStart(),
        content.skip('albert'.length).next().location.clone().snapToEnd(),
        '.alberta'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize classes when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('.alberta ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('.alberta ')
      expectation.pushClass(
        content.next().location.clone().snapToStart(),
        content.skip('albert'.length).next().location.clone().snapToEnd(),
        '.alberta'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize classes when they are followed by a tag', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('.alberta\\')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('.alberta\\')
      expectation.pushClass(
        content.next().location.clone().snapToStart(),
        content.skip('albert'.length).next().location.clone().snapToEnd(),
        '.alberta'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('identifier recognition', function () {
    it ('recognize identifiers', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('#alberta#Chicago#3d#--meow-w')) {
        lexer.next(symbol)
      }
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('.alberta.Chicago.3d.--meow-w')
      expectation.pushIdentifier(
        content.next().location.clone().snapToStart(),
        content.skip('albert'.length).next().location.clone().snapToEnd(),
        '#alberta'
      )
      expectation.pushIdentifier(
        content.next().location.clone().snapToStart(),
        content.skip('Chicag'.length).next().location.clone().snapToEnd(),
        '#Chicago'
      )
      expectation.pushIdentifier(
        content.next().location.clone().snapToStart(),
        content.skip('3'.length).next().location.clone().snapToEnd(),
        '#3d'
      )
      expectation.pushIdentifier(
        content.next().location.clone().snapToStart(),
        content.skip('--meow-'.length).next().location.clone().snapToEnd(),
        '#--meow-w'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize identifiers when they are followed by a class', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('#alberta.')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('#alberta.')
      expectation.pushIdentifier(
        content.next().location.clone().snapToStart(),
        content.skip('albert'.length).next().location.clone().snapToEnd(),
        '#alberta'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize identifiers when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('#alberta ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('#alberta ')
      expectation.pushIdentifier(
        content.next().location.clone().snapToStart(),
        content.skip('albert'.length).next().location.clone().snapToEnd(),
        '#alberta'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize identifiers when they are followed by a tag', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('#alberta\\')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('#alberta\\')
      expectation.pushIdentifier(
        content.next().location.clone().snapToStart(),
        content.skip('albert'.length).next().location.clone().snapToEnd(),
        '#alberta'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('word recognition', function () {
    it ('recognize words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(16)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('only 1 test on this str#ing')) {
        lexer.next(symbol)
      }
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(16)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('only 1 test on this str#ing')
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.skip('nl'.length).next().location.clone().snapToEnd(),
        'only'
      )
      expectation.pushSpace(
        content.next().location.clone().snapToStart(),
        content.current().location.clone().snapToEnd(),
        ' '
      )
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.current().location.clone().snapToEnd(),
        '1'
      )
      expectation.pushSpace(
        content.next().location.clone().snapToStart(),
        content.current().location.clone().snapToEnd(),
        ' '
      )
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.skip('es'.length).next().location.clone().snapToEnd(),
        'test'
      )
      expectation.pushSpace(
        content.next().location.clone().snapToStart(),
        content.current().location.clone().snapToEnd(),
        ' '
      )
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.next().location.clone().snapToEnd(),
        'on'
      )
      expectation.pushSpace(
        content.next().location.clone().snapToStart(),
        content.current().location.clone().snapToEnd(),
        ' '
      )
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.skip('hi'.length).next().location.clone().snapToEnd(),
        'this'
      )
      expectation.pushSpace(
        content.next().location.clone().snapToStart(),
        content.current().location.clone().snapToEnd(),
        ' '
      )
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.skip('tr#in'.length).next().location.clone().snapToEnd(),
        'str#ing'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated classes as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('.acuriousαclass ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('.acuriousαclass ')
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.skip('acuriousαclas'.length).next().location.clone().snapToEnd(),
        '.acuriousαclass'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated classes as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('..acuriousclass ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('..acuriousclass ')
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.skip('.acuriousclas'.length).next().location.clone().snapToEnd(),
        '..acuriousclass'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated identifiers as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('#acuriousαidentifier ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('#acuriousαidentifier ')
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.skip('acuriousαidentifie'.length).next().location.clone().snapToEnd(),
        '#acuriousαidentifier'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated identifiers as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('##acuriousidentifier ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('##acuriousidentifier ')
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.skip('#acuriousidentifie'.length).next().location.clone().snapToEnd(),
        '##acuriousidentifier'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated tags as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('\\acuriousαtag ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('\\acuriousαtag ')
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.skip('acuriousαta'.length).next().location.clone().snapToEnd(),
        '\\acuriousαtag'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated tags as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('\\\\acurioustag ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('\\\\acurioustag ')
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.skip('\\acuriousta'.length).next().location.clone().snapToEnd(),
        '\\\\acurioustag'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize dot as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('. ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('. ')
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.current().location.clone().snapToEnd(),
        '.'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize sharp as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('# ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('# ')
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.current().location.clone().snapToEnd(),
        '#'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize antislash as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('\\ ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('\\ ')
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.current().location.clone().snapToEnd(),
        '\\'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize words that contains dots', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('alberta.test. ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('alberta.test. ')
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.skip('lberta.test'.length).next().location.clone().snapToEnd(),
        'alberta.test.'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('alberta ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('alberta ')
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.skip('lbert'.length).next().location.clone().snapToEnd(),
        'alberta'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a tag', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('alberta\\')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('alberta\\')
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.skip('lbert'.length).next().location.clone().snapToEnd(),
        'alberta'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a block termination', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('alberta}')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('alberta}')
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.skip('lbert'.length).next().location.clone().snapToEnd(),
        'alberta'
      )
      expectation.pushBlockEnd(
        content.next().location.clone().snapToStart(),
        content.current().location.clone().snapToEnd()
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a block start', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('alberta{')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('alberta{')
      expectation.pushWord(
        content.next().location.clone().snapToStart(),
        content.skip('lbert'.length).next().location.clone().snapToEnd(),
        'alberta'
      )
      expectation.pushBlockStart(
        content.next().location.clone().snapToStart(),
        content.current().location.clone().snapToEnd()
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('newline recognition', function () {
    it ('recognize newlines', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString('\r\n\n\r\r')) {
        lexer.next(symbol)
      }
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString('\r\n\n\r\r')
      expectation.pushNewline(
        content.next().location.clone().snapToStart(),
          content.next().location.clone().snapToEnd(),
        '\r\n'
      )
      expectation.pushNewline(
        content.next().location.clone().snapToStart(),
        content.current().location.clone().snapToEnd(),
        '\n'
      )
      expectation.pushNewline(
        content.next().location.clone().snapToStart(),
        content.current().location.clone().snapToEnd(),
        '\r'
      )
      expectation.pushNewline(
        content.next().location.clone().snapToStart(),
        content.current().location.clone().snapToEnd(),
        '\r'
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('space recognition', function () {
    it ('recognize spaces', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSourceReader.fromString(' \f\t\t ')) {
        lexer.next(symbol)
      }
      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      const content : UnidocSourceReader = UnidocSourceReader.fromString(' \f\t\t ')
      expectation.pushSpace(
        content.next().location.clone().snapToStart(),
        content.skip('\f\t\t'.length).next().location.clone().snapToEnd(),
        ' \f\t\t '
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })
})
