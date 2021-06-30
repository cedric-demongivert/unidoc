/** eslint-env jest */

import '../jest/buffer-extension'

import { UnidocBuffer } from '../../sources/buffer/UnidocBuffer'

import { UnidocSource } from '../../sources/source/UnidocSource'

import { UnidocToken } from '../../sources/token/UnidocToken'
import { UnidocRuntimeTokenProducer } from '../../sources/token/UnidocRuntimeTokenProducer'

import { UnidocLexerState } from '../../sources/lexer/UnidocLexerState'
import { UnidocLexer } from '../../sources/lexer/UnidocLexer'

import { skipSuccess } from '../../sources/stream/skipSuccess'


/**
* Return the result of the tokenization of the given content by a lexer instance.
*
* @param content - The content to transform into a buffer of tokens.
*
* @return A buffer with the result of the lexer.
*/
function tokenization(content: string): UnidocBuffer<UnidocToken> {
  const lexer: UnidocLexer = new UnidocLexer()
  const source: UnidocSource = UnidocSource.fromString(content)
  const output: UnidocBuffer<UnidocToken> = UnidocBuffer.bufferize(lexer, UnidocToken.ALLOCATOR)

  lexer.subscribe(source)
  source.read()

  return output
}

namespace tokenization {
  /**
  * Like tokenization but without the completion event from the source.
  */
  export function online(content: string): UnidocBuffer<UnidocToken> {
    const lexer: UnidocLexer = new UnidocLexer()
    const source: UnidocSource = UnidocSource.fromString(content)
    const output: UnidocBuffer<UnidocToken> = UnidocBuffer.bufferize(lexer, UnidocToken.ALLOCATOR)

    lexer.subscribe(skipSuccess(source))
    source.read()

    return output
  }
}

function ofProduction(configurator: (this: UnidocRuntimeTokenProducer) => void): UnidocBuffer<UnidocToken> {
  const producer: UnidocRuntimeTokenProducer = UnidocRuntimeTokenProducer.create()
  const expectation: UnidocBuffer<UnidocToken> = UnidocBuffer.bufferize(producer, UnidocToken.ALLOCATOR)

  configurator.call(producer)

  return expectation
}

describe('UnidocLexer', function () {
  describe('#constructor', function () {
    it('instantiate a new lexer', function () {
      const lexer: UnidocLexer = new UnidocLexer()
      expect(lexer.state).toBe(UnidocLexerState.START)
    })
  })

  describe('block opening recognition', function () {
    it('recognize block opening', function () {
      expect(tokenization('{{{')).toMatchBuffer(ofProduction(function () {
        this.produceBlockStart()
        this.produceBlockStart()
        this.produceBlockStart()
        this.success()
      }))
    })
  })

  describe('block termination recognition', function () {
    it('recognize block termination', function () {
      expect(tokenization('}}}')).toMatchBuffer(ofProduction(function () {
        this.produceBlockEnd()
        this.produceBlockEnd()
        this.produceBlockEnd()
        this.success()
      }))
    })
  })

  describe('tag recognition', function () {
    it('recognize tags', function () {
      expect(tokenization('\\alberta\\Chicago\\3d\\--meow-w')).toMatchBuffer(
        ofProduction(function () {
          this.produceTag('\\alberta')
          this.produceTag('\\Chicago')
          this.produceTag('\\3d')
          this.produceTag('\\--meow-w')
          this.success()
        })
      )
    })

    it('recognize tags when they are followed by a class', function () {
      expect(tokenization.online('\\alberta.')).toMatchBuffer(
        ofProduction(function () {
          this.produceTag('\\alberta')
          this.success()
        })
      )
    })

    it('recognize tags when they are followed by a space', function () {
      expect(tokenization.online('\\alberta ')).toMatchBuffer(
        ofProduction(function () {
          this.produceTag('\\alberta')
          this.success()
        })
      )
    })

    it('recognize tags when they are followed by an identifier', function () {
      expect(tokenization.online('\\alberta#')).toMatchBuffer(
        ofProduction(function () {
          this.produceTag('\\alberta')
          this.success()
        })
      )
    })
  })

  describe('class recognition', function () {
    it('recognize classes', function () {
      expect(tokenization('.alberta.Chicago.3d.--meow-w')).toMatchBuffer(
        ofProduction(function () {
          this.produceClass('.alberta')
          this.produceClass('.Chicago')
          this.produceClass('.3d')
          this.produceClass('.--meow-w')
          this.success()
        })
      )
    })

    it('recognize classes when they are followed by a space', function () {
      expect(tokenization.online('.alberta ')).toMatchBuffer(
        ofProduction(function () {
          this.produceClass('.alberta')
          this.success()
        })
      )
    })

    it('recognize classes when they are followed by a tag', function () {
      expect(tokenization.online('.alberta\\')).toMatchBuffer(
        ofProduction(function () {
          this.produceClass('.alberta')
          this.success()
        })
      )
    })
  })

  describe('identifier recognition', function () {
    it('recognize identifiers', function () {
      expect(tokenization('#alberta#Chicago#3d#--meow-w')).toMatchBuffer(
        ofProduction(function () {
          this.produceIdentifier('#alberta')
          this.produceIdentifier('#Chicago')
          this.produceIdentifier('#3d')
          this.produceIdentifier('#--meow-w')
          this.success()
        })
      )
    })

    it('recognize identifiers when they are followed by a space', function () {
      expect(tokenization.online('#alberta ')).toMatchBuffer(
        ofProduction(function () {
          this.produceIdentifier('#alberta')
          this.success()
        })
      )
    })

    it('recognize identifiers when they are followed by a tag', function () {
      expect(tokenization.online('#alberta\\')).toMatchBuffer(
        ofProduction(function () {
          this.produceIdentifier('#alberta')
          this.success()
        })
      )
    })
  })

  describe('word recognition', function () {
    it('recognize words', function () {
      expect(tokenization('only 1 test on this str#ing')).toMatchBuffer(
        ofProduction(function () {
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
          this.success()
        })
      )
    })

    it('recognize degenerated classes as words', function () {
      expect(tokenization.online('..acuriousclass ')).toMatchBuffer(
        ofProduction(function () {
          this.produceWord('..acuriousclass')
          this.success()
        })
      )
    })

    it('recognize degenerated identifiers as words', function () {
      expect(tokenization.online('#acuriousαidentifier ')).toMatchBuffer(
        ofProduction(function () {
          this.produceWord('#acuriousαidentifier')
          this.success()
        })
      )
    })

    it('recognize degenerated identifiers as words', function () {
      expect(tokenization.online('##acuriousidentifier ')).toMatchBuffer(
        ofProduction(function () {
          this.produceWord('##acuriousidentifier')
          this.success()
        })
      )
    })

    it('recognize degenerated tags as words', function () {
      expect(tokenization.online('\\acuriousαtag ')).toMatchBuffer(
        ofProduction(function () {
          this.produceWord('\\acuriousαtag')
          this.success()
        })
      )
    })

    it('recognize degenerated tags as words', function () {
      expect(tokenization.online('\\\\acurioustag ')).toMatchBuffer(
        ofProduction(function () {
          this.produceWord('\\\\acurioustag')
          this.success()
        })
      )
    })

    it('recognize dot as words', function () {
      expect(tokenization.online('. ')).toMatchBuffer(
        ofProduction(function () {
          this.produceWord('.')
          this.success()
        })
      )
    })

    it('recognize sharp as words', function () {
      expect(tokenization.online('# ')).toMatchBuffer(ofProduction(function () {
        this.produceWord('#')
        this.success()
      }))
    })

    it('recognize antislash as words', function () {
      expect(tokenization.online('\\ ')).toMatchBuffer(
        ofProduction(function () {
          this.produceWord('\\')
          this.success()
        })
      )
    })

    it('recognize words that contains dots', function () {
      expect(tokenization.online('alberta.test. ')).toMatchBuffer(
        ofProduction(function () {
          this.produceWord('alberta.test.')
          this.success()
        })
      )
    })

    it('recognize words when they are followed by a space', function () {
      expect(tokenization.online('alberta ')).toMatchBuffer(
        ofProduction(function () {
          this.produceWord('alberta')
          this.success()
        })
      )
    })

    it('recognize words when they are followed by a tag', function () {
      expect(tokenization.online('alberta\\')).toMatchBuffer(
        ofProduction(function () {
          this.produceWord('alberta')
          this.success()
        })
      )
    })

    it('recognize words when they are followed by a block termination', function () {
      expect(tokenization.online('alberta}')).toMatchBuffer(
        ofProduction(function () {
          this.produceWord('alberta')
          this.produceBlockEnd()
          this.success()
        })
      )
    })

    it('recognize words when they are followed by a block start', function () {
      expect(tokenization.online('alberta{')).toMatchBuffer(
        ofProduction(function () {
          this.produceWord('alberta')
          this.produceBlockStart()
          this.success()
        })
      )
    })
  })

  describe('newline recognition', function () {
    it('recognize newlines', function () {
      expect(tokenization('\r\n\n\r\r')).toMatchBuffer(ofProduction(function () {
        this.produceString('\r\n\n\r\r')
        this.success()
      }))
    })
  })

  describe('space recognition', function () {
    it('recognize spaces', function () {
      expect(tokenization(' \f\t\t ')).toMatchBuffer(ofProduction(function () {
        this.produceSpace(' \f\t\t ')
        this.success()
      }))
    })
  })
})
