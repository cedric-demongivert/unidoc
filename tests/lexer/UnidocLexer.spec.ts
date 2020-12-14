/** eslint-env jest */

import '../jest/buffer-extension'

import { UnidocBuffer } from '../../sources/buffer/UnidocBuffer'
import { bufferize } from '../../sources/buffer/bufferize'
import { UnidocSymbolReader } from '../../sources/reader/UnidocSymbolReader'
import { UnidocSymbolReaderProducer } from '../../sources/reader/UnidocSymbolReaderProducer'
import { UnidocLexerState } from '../../sources/lexer/UnidocLexerState'
import { UnidocToken } from '../../sources/token/UnidocToken'
import { UnidocLexer } from '../../sources/lexer/UnidocLexer'
import { TrackedUnidocTokenProducer } from '../../sources/token/TrackedUnidocTokenProducer'

/**
* Return the result of the tokenization of the given content by a lexer instance.
*
* @param content - The content to transform into a buffer of tokens.
*
* @return A buffer with the result of the lexer.
*/
function tokenization(content: string): UnidocBuffer<UnidocToken> {
  const lexer: UnidocLexer = new UnidocLexer()
  const input: UnidocSymbolReaderProducer = UnidocSymbolReader.produceString(content)
  const output: UnidocBuffer<UnidocToken> = bufferize(lexer, UnidocToken.ALLOCATOR)

  lexer.subscribe(input)
  input.read()

  return output
}

namespace tokenization {
  /**
  * Like tokenization but without the completion event from the source.
  */
  export function online(content: string): UnidocBuffer<UnidocToken> {
    const lexer: UnidocLexer = new UnidocLexer()
    const input: UnidocSymbolReaderProducer = UnidocSymbolReader.produceString(content)
    const output: UnidocBuffer<UnidocToken> = bufferize(lexer, UnidocToken.ALLOCATOR)

    lexer.subscribe(input)
    input.readWithoutCompletion()

    return output
  }
}

function ofProduction(configurator: (this: TrackedUnidocTokenProducer) => void): UnidocBuffer<UnidocToken> {
  const producer: TrackedUnidocTokenProducer = TrackedUnidocTokenProducer.create()
  const expectation: UnidocBuffer<UnidocToken> = bufferize(producer, UnidocToken.ALLOCATOR)

  configurator.call(producer)

  return expectation
}

describe('UnidocLexer', function() {
  describe('#constructor', function() {
    it('instantiate a new lexer', function() {
      const lexer: UnidocLexer = new UnidocLexer()
      expect(lexer.state).toBe(UnidocLexerState.START)
    })
  })

  describe('block opening recognition', function() {
    it('recognize block opening', function() {
      expect(tokenization('{{{')).toMatchBuffer(ofProduction(function() {
        this.produceBlockStart()
        this.produceBlockStart()
        this.produceBlockStart()
        this.complete()
      }))
    })
  })

  describe('block termination recognition', function() {
    it('recognize block termination', function() {
      expect(tokenization('}}}')).toMatchBuffer(ofProduction(function() {
        this.produceBlockEnd()
        this.produceBlockEnd()
        this.produceBlockEnd()
        this.complete()
      }))
    })
  })

  describe('tag recognition', function() {
    it('recognize tags', function() {
      expect(tokenization('\\alberta\\Chicago\\3d\\--meow-w')).toMatchBuffer(
        ofProduction(function() {
          this.produceTag('\\alberta')
          this.produceTag('\\Chicago')
          this.produceTag('\\3d')
          this.produceTag('\\--meow-w')
          this.complete()
        })
      )
    })

    it('recognize tags when they are followed by a class', function() {
      expect(tokenization.online('\\alberta.')).toMatchBuffer(
        ofProduction(function() {
          this.produceTag('\\alberta')
          this.complete()
        })
      )
    })

    it('recognize tags when they are followed by a space', function() {
      expect(tokenization.online('\\alberta ')).toMatchBuffer(
        ofProduction(function() {
          this.produceTag('\\alberta')
          this.complete()
        })
      )
    })

    it('recognize tags when they are followed by an identifier', function() {
      expect(tokenization.online('\\alberta#')).toMatchBuffer(
        ofProduction(function() {
          this.produceTag('\\alberta')
          this.complete()
        })
      )
    })
  })

  describe('class recognition', function() {
    it('recognize classes', function() {
      expect(tokenization('.alberta.Chicago.3d.--meow-w')).toMatchBuffer(
        ofProduction(function() {
          this.produceClass('.alberta')
          this.produceClass('.Chicago')
          this.produceClass('.3d')
          this.produceClass('.--meow-w')
          this.complete()
        })
      )
    })

    it('recognize classes when they are followed by a space', function() {
      expect(tokenization.online('.alberta ')).toMatchBuffer(
        ofProduction(function() {
          this.produceClass('.alberta')
          this.complete()
        })
      )
    })

    it('recognize classes when they are followed by a tag', function() {
      expect(tokenization.online('.alberta\\')).toMatchBuffer(
        ofProduction(function() {
          this.produceClass('.alberta')
          this.complete()
        })
      )
    })
  })

  describe('identifier recognition', function() {
    it('recognize identifiers', function() {
      expect(tokenization('#alberta#Chicago#3d#--meow-w')).toMatchBuffer(
        ofProduction(function() {
          this.produceIdentifier('#alberta')
          this.produceIdentifier('#Chicago')
          this.produceIdentifier('#3d')
          this.produceIdentifier('#--meow-w')
          this.complete()
        })
      )
    })

    it('recognize identifiers when they are followed by a space', function() {
      expect(tokenization.online('#alberta ')).toMatchBuffer(
        ofProduction(function() {
          this.produceIdentifier('#alberta')
          this.complete()
        })
      )
    })

    it('recognize identifiers when they are followed by a tag', function() {
      expect(tokenization.online('#alberta\\')).toMatchBuffer(
        ofProduction(function() {
          this.produceIdentifier('#alberta')
          this.complete()
        })
      )
    })
  })

  describe('word recognition', function() {
    it('recognize words', function() {
      expect(tokenization('only 1 test on this str#ing')).toMatchBuffer(
        ofProduction(function() {
          this.produceWord('only')
          this.produceSpace(' ')
          this.produceWord('1')
          this.produceSpace(' ')
          this.produceWord('test')
          this.produceSpace(' ')
          this.produceWord('on')
          this.produceSpace(' ')
          this.produceWord('this')
          this.produceSpace(' ')
          this.produceWord('str#ing')
          this.complete()
        })
      )
    })

    it('recognize degenerated classes as words', function() {
      expect(tokenization.online('..acuriousclass ')).toMatchBuffer(
        ofProduction(function() {
          this.produceWord('..acuriousclass')
          this.complete()
        })
      )
    })

    it('recognize degenerated identifiers as words', function() {
      expect(tokenization.online('#acuriousαidentifier ')).toMatchBuffer(
        ofProduction(function() {
          this.produceWord('#acuriousαidentifier')
          this.complete()
        })
      )
    })

    it('recognize degenerated identifiers as words', function() {
      expect(tokenization.online('##acuriousidentifier ')).toMatchBuffer(
        ofProduction(function() {
          this.produceWord('##acuriousidentifier')
          this.complete()
        })
      )
    })

    it('recognize degenerated tags as words', function() {
      expect(tokenization.online('\\acuriousαtag ')).toMatchBuffer(
        ofProduction(function() {
          this.produceWord('\\acuriousαtag')
          this.complete()
        })
      )
    })

    it('recognize degenerated tags as words', function() {
      expect(tokenization.online('\\\\acurioustag ')).toMatchBuffer(
        ofProduction(function() {
          this.produceWord('\\\\acurioustag')
          this.complete()
        })
      )
    })

    it('recognize dot as words', function() {
      expect(tokenization.online('. ')).toMatchBuffer(
        ofProduction(function() {
          this.produceWord('.')
          this.complete()
        })
      )
    })

    it('recognize sharp as words', function() {
      expect(tokenization.online('# ')).toMatchBuffer(ofProduction(function() {
        this.produceWord('#')
        this.complete()
      }))
    })

    it('recognize antislash as words', function() {
      expect(tokenization.online('\\ ')).toMatchBuffer(
        ofProduction(function() {
          this.produceWord('\\')
          this.complete()
        })
      )
    })

    it('recognize words that contains dots', function() {
      expect(tokenization.online('alberta.test. ')).toMatchBuffer(
        ofProduction(function() {
          this.produceWord('alberta.test.')
          this.complete()
        })
      )
    })

    it('recognize words when they are followed by a space', function() {
      expect(tokenization.online('alberta ')).toMatchBuffer(
        ofProduction(function() {
          this.produceWord('alberta')
          this.complete()
        })
      )
    })

    it('recognize words when they are followed by a tag', function() {
      expect(tokenization.online('alberta\\')).toMatchBuffer(
        ofProduction(function() {
          this.produceWord('alberta')
          this.complete()
        })
      )
    })

    it('recognize words when they are followed by a block termination', function() {
      expect(tokenization.online('alberta}')).toMatchBuffer(
        ofProduction(function() {
          this.produceWord('alberta')
          this.produceBlockEnd()
          this.complete()
        })
      )
    })

    it('recognize words when they are followed by a block start', function() {
      expect(tokenization.online('alberta{')).toMatchBuffer(
        ofProduction(function() {
          this.produceWord('alberta')
          this.produceBlockStart()
          this.complete()
        })
      )
    })
  })

  describe('newline recognition', function() {
    it('recognize newlines', function() {
      expect(tokenization('\r\n\n\r\r')).toMatchBuffer(ofProduction(function() {
        this.produceString('\r\n\n\r\r')
        this.complete()
      }))
    })
  })

  describe('space recognition', function() {
    it('recognize spaces', function() {
      expect(tokenization(' \f\t\t ')).toMatchBuffer(ofProduction(function() {
        this.produceSpace(' \f\t\t ')
        this.complete()
      }))
    })
  })
})
