/** eslint-env jest */

import { UnidocSymbolReader } from '../../sources/reader/UnidocSymbolReader'
import { UnidocTokenBuffer } from '../../sources/token/UnidocTokenBuffer'
import { UnidocLexerState } from '../../sources/lexer/UnidocLexerState'
import { UnidocLexer } from '../../sources/lexer/UnidocLexer'
import { TrackedUnidocTokenProducer } from '../../sources/token/TrackedUnidocTokenProducer'

/**
* Requires a valid and functional UnidocSymbolReader.
*/

describe('UnidocLexer', function() {
  describe('#constructor', function() {
    it('instantiate a new lexer', function() {
      const lexer: UnidocLexer = new UnidocLexer()

      expect(lexer.state).toBe(UnidocLexerState.START)
    })
  })

  describe('block opening recognition', function() {
    it('recognize block opening', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('{{{'))
        .read()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceBlockStart()
        .produceBlockStart()
        .produceBlockStart()
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('block closing recognition', function() {
    it('recognize block closing', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('}}}'))
        .read()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceBlockEnd()
        .produceBlockEnd()
        .produceBlockEnd()
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('tag recognition', function() {
    it('recognize tags', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('\\alberta\\Chicago\\3d\\--meow-w')).read()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceTag('\\alberta')
        .produceTag('\\Chicago')
        .produceTag('\\3d')
        .produceTag('\\--meow-w')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize tags when they are followed by a class', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('\\alberta.'))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceTag('\\alberta')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize tags when they are followed by a space', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('\\alberta '))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceTag('\\alberta')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize tags when they are followed by an identifier', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('\\alberta#'))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceTag('\\alberta')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('class recognition', function() {
    it('recognize classes', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('.alberta.Chicago.3d.--meow-w')).read()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceClass('.alberta')
        .produceClass('.Chicago')
        .produceClass('.3d')
        .produceClass('.--meow-w')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize classes when they are followed by an identifier', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('.alberta#'))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceClass('.alberta')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize classes when they are followed by a space', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('.alberta '))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceClass('.alberta')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize classes when they are followed by a tag', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('.alberta\\'))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceClass('.alberta')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('identifier recognition', function() {
    it('recognize identifiers', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('#alberta#Chicago#3d#--meow-w')).read()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceIdentifier('#alberta')
        .produceIdentifier('#Chicago')
        .produceIdentifier('#3d')
        .produceIdentifier('#--meow-w')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize identifiers when they are followed by a class', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('#alberta.'))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceIdentifier('#alberta')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize identifiers when they are followed by a space', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('#alberta '))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceIdentifier('#alberta')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize identifiers when they are followed by a tag', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('#alberta\\'))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceIdentifier('#alberta')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('word recognition', function() {
    it('recognize words', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(16)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('only 1 test on this str#ing')).read()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(16)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceString('only 1 test on this str#ing')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize degenerated classes as words', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('.acuriousαclass '))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceWord('.acuriousαclass')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize degenerated classes as words', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('..acuriousclass '))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceWord('..acuriousclass')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize degenerated identifiers as words', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('#acuriousαidentifier '))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceWord('#acuriousαidentifier')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize degenerated identifiers as words', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('##acuriousidentifier '))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceWord('##acuriousidentifier')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize degenerated tags as words', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('\\acuriousαtag '))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceWord('\\acuriousαtag')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize degenerated tags as words', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('\\\\acurioustag '))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceWord('\\\\acurioustag')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize dot as words', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('. '))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceWord('.')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize sharp as words', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('# '))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceWord('#')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize antislash as words', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('\\ '))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceWord('\\')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize words that contains dots', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('alberta.test. '))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceWord('alberta.test.')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize words when they are followed by a space', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('alberta '))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceWord('alberta')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize words when they are followed by a tag', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('alberta\\'))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceWord('alberta')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize words when they are followed by a block termination', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('alberta}'))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceWord('alberta')
        .produceBlockEnd()
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })

    it('recognize words when they are followed by a block start', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('alberta{'))
        .readWithoutCompletion()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceWord('alberta')
        .produceBlockStart()
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('newline recognition', function() {
    it('recognize newlines', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString('\r\n\n\r\r'))
        .read()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceString('\r\n\n\r\r')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })

  describe('space recognition', function() {
    it('recognize spaces', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      const output: UnidocTokenBuffer = new UnidocTokenBuffer(8)

      output.subscribe(lexer)

      lexer.subscribe(UnidocSymbolReader.produceString(' \f\t\t '))
        .read()

      const expectation: UnidocTokenBuffer = new UnidocTokenBuffer(8)
      expectation.subscribe(TrackedUnidocTokenProducer.create())
        .produceSpace(' \f\t\t ')
        .complete()

      expect(() => UnidocTokenBuffer.assert(output, expectation)).not.toThrow()
    })
  })
})
