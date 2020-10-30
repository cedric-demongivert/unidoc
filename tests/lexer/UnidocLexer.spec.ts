/** eslint-env jest */

import { UnidocRangeOrigin } from '../../sources/origin/UnidocRangeOrigin'
import { UnidocSymbolReader } from '../../sources/reader/UnidocSymbolReader'
import { UnidocTokenBuffer } from '../../sources/token/UnidocTokenBuffer'
import { UnidocLexerState } from '../../sources/lexer/UnidocLexerState'
import { UnidocLexer } from '../../sources/lexer/UnidocLexer'
import { UnidocTokenProducer } from '../../sources/token/UnidocTokenProducer'

/**
* Requires a valid and functional UnidocSymbolReader.
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

      for (const symbol of UnidocSymbolReader.fromString('{{{')) {
        lexer.next(symbol)
      }

      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      UnidocTokenProducer.forBuffer(expectation)
                         .produceBlockStart()
                         .produceBlockStart()
                         .produceBlockStart()
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('block closing recognition', function () {
    it ('recognize block closing', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('}}}')) {
        lexer.next(symbol)
      }

      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      UnidocTokenProducer.forBuffer(expectation)
                         .produceBlockEnd()
                         .produceBlockEnd()
                         .produceBlockEnd()
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('tag recognition', function () {
    it ('recognize tags', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('\\alberta\\Chicago\\3d\\--meow-w')) {
        lexer.next(symbol)
      }

      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceTag('\\alberta')
                         .produceTag('\\Chicago')
                         .produceTag('\\3d')
                         .produceTag('\\--meow-w')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize tags when they are followed by a class', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('\\alberta.')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceTag('\\alberta')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize tags when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('\\alberta ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceTag('\\alberta')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize tags when they are followed by an identifier', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('\\alberta#')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceTag('\\alberta')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('class recognition', function () {
    it ('recognize classes', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('.alberta.Chicago.3d.--meow-w')) {
        lexer.next(symbol)
      }

      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceClass('.alberta')
                         .produceClass('.Chicago')
                         .produceClass('.3d')
                         .produceClass('.--meow-w')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize classes when they are followed by an identifier', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('.alberta#')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceClass('.alberta')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize classes when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('.alberta ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceClass('.alberta')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize classes when they are followed by a tag', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('.alberta\\')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceClass('.alberta')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('identifier recognition', function () {
    it ('recognize identifiers', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('#alberta#Chicago#3d#--meow-w')) {
        lexer.next(symbol)
      }

      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceIdentifier('#alberta')
                         .produceIdentifier('#Chicago')
                         .produceIdentifier('#3d')
                         .produceIdentifier('#--meow-w')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize identifiers when they are followed by a class', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('#alberta.')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceIdentifier('#alberta')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize identifiers when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('#alberta ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceIdentifier('#alberta')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize identifiers when they are followed by a tag', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('#alberta\\')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceIdentifier('#alberta')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('word recognition', function () {
    it ('recognize words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(16)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('only 1 test on this str#ing')) {
        lexer.next(symbol)
      }

      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(16)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceWord('only')
                         .produceSpace(' ')
                         .produceWord('1')
                         .produceSpace(' ')
                         .produceWord('test')
                         .produceSpace(' ')
                         .produceWord('on')
                         .produceSpace(' ')
                         .produceWord('this')
                         .produceSpace(' ')
                         .produceWord('str#ing')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated classes as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('.acuriousαclass ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceWord('.acuriousαclass')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated classes as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('..acuriousclass ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceWord('..acuriousclass')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated identifiers as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('#acuriousαidentifier ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceWord('#acuriousαidentifier')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated identifiers as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('##acuriousidentifier ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceWord('##acuriousidentifier')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated tags as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('\\acuriousαtag ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceWord('\\acuriousαtag')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize degenerated tags as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('\\\\acurioustag ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceWord('\\\\acurioustag')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize dot as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('. ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceWord('.')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize sharp as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('# ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceWord('#')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize antislash as words', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('\\ ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceWord('\\')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize words that contains dots', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('alberta.test. ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceWord('alberta.test.')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a space', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('alberta ')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceWord('alberta')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a tag', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('alberta\\')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceWord('alberta')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a block termination', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('alberta}')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceWord('alberta')
                         .produceBlockEnd()
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it ('recognize words when they are followed by a block start', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('alberta{')) {
        lexer.next(symbol)
      }

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceWord('alberta')
                         .produceBlockStart()
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('newline recognition', function () {
    it ('recognize newlines', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString('\r\n\n\r\r')) {
        lexer.next(symbol)
      }

      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceNewline('\r\n')
                         .produceNewline('\n')
                         .produceNewline('\r')
                         .produceNewline('\r')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('space recognition', function () {
    it ('recognize spaces', function () {
      const lexer  : UnidocLexer = new UnidocLexer()
      const output : UnidocTokenBuffer = new UnidocTokenBuffer(8)

      lexer.addEventListener('token', token => output.push(token))

      for (const symbol of UnidocSymbolReader.fromString(' \f\t\t ')) {
        lexer.next(symbol)
      }

      lexer.complete()

      const expectation : UnidocTokenBuffer = new UnidocTokenBuffer(8)
      UnidocTokenProducer.forBuffer(expectation)
                         .produceSpace(' \f\t\t ')
                         .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })
})
