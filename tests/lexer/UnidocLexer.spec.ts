/** eslint-env jest */

import { UnidocRangeOrigin } from '../../sources/origin/UnidocRangeOrigin'
import { UnidocSourceReader } from '../../sources/stream/UnidocSourceReader'
import { UnidocTokenBuffer } from '../../sources/token/UnidocTokenBuffer'
import { UnidocLexerState } from '../../sources/lexer/UnidocLexerState'
import { UnidocLexer } from '../../sources/lexer/UnidocLexer'

/**
* Requires a valid and functional UnidocSourceReader.
*/

describe('UnidocLexer', function () {
  describe('#constructor', function () {
    it('instantiate a new lexer', function () {
      const lexer : UnidocLexer = new UnidocLexer()

      expect(lexer.state).toBe(UnidocLexerState.START)
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
          UnidocRangeOrigin.builder()
                           .from(symbol.origin.from)
                           .to(symbol.origin.to)
                           .build()
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
          UnidocRangeOrigin.builder()
                           .from(symbol.origin.from)
                           .to(symbol.origin.to)
                           .build()
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('albert'.length).next().origin.to)
          .build(),
        '\\alberta'
      )

      expectation.pushTag(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('Chicag'.length).next().origin.to)
          .build(),
        '\\Chicago'
      )
      expectation.pushTag(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('3'.length).next().origin.to)
          .build(),
        '\\3d'
      )
      expectation.pushTag(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('--meow-'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('albert'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('albert'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('albert'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('albert'.length).next().origin.to)
          .build(),
        '.alberta'
      )
      expectation.pushClass(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('Chicag'.length).next().origin.to)
          .build(),
        '.Chicago'
      )
      expectation.pushClass(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('3'.length).next().origin.to)
          .build(),
        '.3d'
      )
      expectation.pushClass(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('--meow-'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('albert'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('albert'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('albert'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('albert'.length).next().origin.to)
          .build(),
        '#alberta'
      )
      expectation.pushIdentifier(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('Chicag'.length).next().origin.to)
          .build(),
        '#Chicago'
      )
      expectation.pushIdentifier(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('3'.length).next().origin.to)
          .build(),
        '#3d'
      )
      expectation.pushIdentifier(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('--meow-'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('albert'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('albert'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('albert'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('nl'.length).next().origin.to)
          .build(),
        'only'
      )
      expectation.pushSpace(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.current().origin.to)
          .build(),
        ' '
      )
      expectation.pushWord(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.current().origin.to)
          .build(),
        '1'
      )
      expectation.pushSpace(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.current().origin.to)
          .build(),
        ' '
      )
      expectation.pushWord(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('es'.length).next().origin.to)
          .build(),
        'test'
      )
      expectation.pushSpace(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.current().origin.to)
          .build(),
        ' '
      )
      expectation.pushWord(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.next().origin.to)
          .build(),
        'on'
      )
      expectation.pushSpace(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.current().origin.to)
          .build(),
        ' '
      )
      expectation.pushWord(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('hi'.length).next().origin.to)
          .build(),
        'this'
      )
      expectation.pushSpace(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.current().origin.to)
          .build(),
        ' '
      )
      expectation.pushWord(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('tr#in'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('acuriousαclas'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('.acuriousclas'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('acuriousαidentifie'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('#acuriousidentifie'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('acuriousαta'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('\\acuriousta'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.current().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.current().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.current().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('lberta.test'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('lbert'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('lbert'.length).next().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('lbert'.length).next().origin.to)
          .build(),
        'alberta'
      )
      expectation.pushBlockEnd(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.current().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('lbert'.length).next().origin.to)
          .build(),
        'alberta'
      )
      expectation.pushBlockStart(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.current().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.next().origin.to)
          .build(),
        '\r\n'
      )
      expectation.pushNewline(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.current().origin.to)
          .build(),
        '\n'
      )
      expectation.pushNewline(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.current().origin.to)
          .build(),
        '\r'
      )
      expectation.pushNewline(
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.current().origin.to)
          .build(),
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
        UnidocRangeOrigin.builder()
          .from(content.next().origin.from)
          .to(content.skip('\f\t\t'.length).next().origin.to)
          .build(),
        ' \f\t\t '
      )

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })
})
