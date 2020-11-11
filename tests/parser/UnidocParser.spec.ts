/** eslint-env jest */

import '../buffer-extension'

import { UnidocParser } from '../../sources/parser/UnidocParser'
import { TrackedUnidocTokenProducer } from '../../sources/token/TrackedUnidocTokenProducer'
import { UnidocBuffer } from '../../sources/buffer/UnidocBuffer'
import { bufferize } from '../../sources/buffer/bufferize'
import { TrackedUnidocEventProducer } from '../../sources/event/TrackedUnidocEventProducer'
import { UnidocEvent } from '../../sources/event/UnidocEvent'

function interpretation(configurator: (this: TrackedUnidocTokenProducer) => void): UnidocBuffer<UnidocEvent> {
  const parser: UnidocParser = new UnidocParser()
  const input: TrackedUnidocTokenProducer = TrackedUnidocTokenProducer.create()
  const output: UnidocBuffer<UnidocEvent> = bufferize(parser, UnidocEvent.ALLOCATOR)

  parser.subscribe(input)

  configurator.call(input)

  return output
}

function ofProduction(configurator: (this: TrackedUnidocEventProducer) => void): UnidocBuffer<UnidocEvent> {
  const producer: TrackedUnidocEventProducer = TrackedUnidocEventProducer.create()
  const output: UnidocBuffer<UnidocEvent> = bufferize(producer, UnidocEvent.ALLOCATOR)

  configurator.call(producer)

  return output
}

/**
* @todo Check parser output stream initialization : true document start will fail.
*/

describe('UnidocParser', function() {
  describe('document tag recognition', function() {
    it('emit a document starting event when a word is discovered', function() {
      expect(
        interpretation(function() {
          this.produceWord('test')
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.complete()
        })
      )
    })

    it('emit a document starting event when a class is discovered', function() {
      expect(
        interpretation(function() {
          this.produceClass('.test')
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.complete()
        })
      )
    })

    it('emit a document starting event when an identifier is discovered', function() {
      expect(
        interpretation(function() {
          this.produceIdentifier('#test')
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.complete()
        })
      )
    })

    it('emit a document starting event when a tag is discovered', function() {
      expect(
        interpretation(function() {
          this.produceTag('\\test')
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.complete()
        })
      )
    })

    it('emit a document starting event when a block opening is discovered', function() {
      expect(
        interpretation(function() {
          this.produceBlockStart()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceTagStart('block', '{')
          this.complete()
        })
      )
    })

    it('emit a document ending event at completion', function() {
      expect(
        interpretation(function() {
          this.produceWord('test')
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceWord('test')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })

    it('emit a document tag starting and ending event at completion if empty', function() {
      expect(
        interpretation(function() {
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })

    it('recognize the root document tag', function() {
      expect(
        interpretation(function() {
          this.produceString('\n\r\n\t ')
          this.produceTag('\\doCuMent')
          this.produceSpace('\t ')
          this.produceClass('.article')
          this.produceClass('.go')
          this.produceIdentifier('#pwet')
          this.produceNewline('\r\n')
          this.produceClass('.green')
          this.produceString(' \r\n\r\n')
          this.produceClass('.blue')
          this.produceString(' test')
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document#pwet.article.go.green.blue', '\n\r\n\t \\doCuMent\t .article.go#pwet\r\n.green \r\n\r\n.blue')
          this.produceWhitespace(' ')
          this.produceWord('test')
          this.produceTagEnd('document#pwet.article.go.green.blue', '')
          this.complete()
        })
      )
    })

    it('recognize the root document with a class followed by a tag', function() {
      expect(
        interpretation(function() {
          this.produceTag('\\docuMent')
          this.produceClass('.ruleset')
          this.produceString('\r\n\r\n')
          this.produceTag('\\title')
          this.produceSpace(' ')
          this.produceIdentifier('#characteristics')
          this.produceSpace(' ')
          this.produceBlockStart()
          this.produceString(' green ')
          this.produceBlockEnd()
          this.produceNewline('\r\n')
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document.ruleset', '\\docuMent.ruleset')
          this.produceWhitespace('\r\n\r\n')
          this.produceTagStart('title#characteristics', '\\title #characteristics {')
          this.produceWhitespace(' ')
          this.produceWord('green')
          this.produceWhitespace(' ')
          this.produceTagEnd('title#characteristics')
          this.produceWhitespace('\r\n')
          this.produceTagEnd('document.ruleset', '')
          this.complete()
        })
      )
    })
  })

  describe('whitespace recognition', function() {
    it('recognize sequence of space tokens', function() {
      expect(
        interpretation(function() {
          this.produceSpace('   ')
          this.produceSpace('\t')
          this.produceSpace('\t\f')
          this.produceSpace('  ')
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceWhitespace('   \t\t\f  ')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })

    it('recognize sequence of newline tokens', function() {
      expect(
        interpretation(function() {
          this.produceNewline('\n')
          this.produceNewline('\r\n')
          this.produceNewline('\r')
          this.produceNewline('\r\n')
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceWhitespace('\n\r\n\r\r\n')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })

    it('recognize sequence of both newline and space tokens', function() {
      expect(
        interpretation(function() {
          this.produceNewline('\n')
          this.produceSpace(' \t\t\f')
          this.produceNewline('\r')
          this.produceNewline('\r\n')
          this.produceSpace('  \f')
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceWhitespace('\n \t\t\f\r\r\n  \f')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })

    it('recognize whitespace when other type of tokens are discovered', function() {
      expect(
        interpretation(function() {
          this.produceNewline('\n')
          this.produceSpace(' \t\t\f')
          this.produceNewline('\r')
          this.produceNewline('\r\n')
          this.produceWord('qwerty')
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceWhitespace('\n \t\t\f\r\r\n')
          this.complete()
        })
      )
    })

    it('recognize whitespace between words', function() {
      expect(
        interpretation(function() {
          this.produceWord('zwrtyt')
          this.produceNewline('\n')
          this.produceSpace(' \t\t\f')
          this.produceNewline('\r')
          this.produceNewline('\r\n')
          this.produceWord('qwerty')
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceWord('zwrtyt')
          this.produceWhitespace('\n \t\t\f\r\r\n')
          this.complete()
        })
      )
    })
  })

  describe('word recognition', function() {
    it('recognize sequence of word tokens', function() {
      expect(
        interpretation(function() {
          this.produceWord('awe')
          this.produceWord('a')
          this.produceWord('ioP')
          this.produceWord('nt')
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceWord('aweaioPnt')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })

    it('recognize word when other type of tokens are discovered', function() {
      expect(
        interpretation(function() {
          this.produceWord('awe')
          this.produceWord('a')
          this.produceWord('ioP')
          this.produceWord('nt')
          this.produceBlockStart()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceWord('aweaioPnt')
          this.produceTagStart('block', '{')
          this.complete()
        })
      )
    })
  })

  describe('tag recognition', function() {
    it('recognize blocks as block tag', function() {
      expect(
        interpretation(function() {
          this.produceBlockStart()
          this.produceBlockEnd()
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceTagStart('block', '{')
          this.produceTagEnd('block', '}')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })

    it('recognize singleton tags before text', function() {
      expect(
        interpretation(function() {
          this.produceTag('\\emphasize')
          this.produceSpace(' ')
          this.produceWord('text')
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceTagStart('emphasize', '\\emphasize')
          this.produceTagEnd('emphasize', '')
          this.produceWhitespace(' ')
          this.produceWord('text')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })

    it('recognize singleton tags before tags', function() {
      expect(
        interpretation(function() {
          this.produceTag('\\emphasize')
          this.produceSpace(' ')
          this.produceTag('\\emphasize')
          this.produceSpace(' ')
          this.produceWord('text')
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceTagStart('emphasize', '\\emphasize')
          this.produceTagEnd('emphasize', '')
          this.produceWhitespace(' ')
          this.produceTagStart('emphasize', '\\emphasize')
          this.produceTagEnd('emphasize', '')
          this.produceWhitespace(' ')
          this.produceWord('text')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })

    it('recognize singleton tags with classes', function() {
      expect(
        interpretation(function() {
          this.produceTag('\\emphasize')
          this.produceSpace(' ')
          this.produceClass('.yellow')
          this.produceClass('.green')
          this.produceClass('.blue')
          this.produceSpace(' ')
          this.produceWord('text')
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceTagStart('emphasize.yellow.green.blue', '\\emphasize .yellow.green.blue')
          this.produceTagEnd('emphasize.yellow.green.blue', '')
          this.produceWhitespace(' ')
          this.produceWord('text')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })

    it('recognize singleton tags with identifier', function() {
      expect(
        interpretation(function() {
          this.produceTag('\\emphasize')
          this.produceSpace(' ')
          this.produceIdentifier('#yellow')
          this.produceSpace(' ')
          this.produceWord('text')
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceTagStart('emphasize#yellow', '\\emphasize #yellow')
          this.produceTagEnd('emphasize#yellow', '')
          this.produceWhitespace(' ')
          this.produceWord('text')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })

    it('recognize singleton tags with identifier and classes', function() {
      expect(
        interpretation(function() {
          this.produceTag('\\emphasize')
          this.produceSpace(' ')
          this.produceClass('.green')
          this.produceClass('.blue')
          this.produceIdentifier('#yellow')
          this.produceClass('.red')
          this.produceClass('.purple')
          this.produceSpace(' ')
          this.produceWord('text')
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceTagStart('emphasize#yellow.green.blue.red.purple', '\\emphasize .green.blue#yellow.red.purple')
          this.produceTagEnd('emphasize#yellow.green.blue.red.purple', '')
          this.produceWhitespace(' ')
          this.produceWord('text')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })

    it('recognize block tags', function() {
      expect(
        interpretation(function() {
          this.produceTag('\\emphasize')
          this.produceSpace(' ')
          this.produceBlockStart()
          this.produceWord('text')
          this.produceBlockEnd()
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceTagStart('emphasize', '\\emphasize {')
          this.produceWord('text')
          this.produceTagEnd('emphasize')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })

    it('recognize block tags with classes', function() {
      expect(
        interpretation(function() {
          this.produceTag('\\emphasize')
          this.produceSpace(' ')
          this.produceClass('.yellow')
          this.produceClass('.green')
          this.produceClass('.blue')
          this.produceSpace(' ')
          this.produceBlockStart()
          this.produceWord('text')
          this.produceBlockEnd()
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceTagStart('emphasize.yellow.green.blue', '\\emphasize .yellow.green.blue {')
          this.produceWord('text')
          this.produceTagEnd('emphasize.yellow.green.blue')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })

    it('recognize block tags with identifier', function() {
      expect(
        interpretation(function() {
          this.produceTag('\\emphasize')
          this.produceSpace(' ')
          this.produceIdentifier('#yellow')
          this.produceSpace(' ')
          this.produceBlockStart()
          this.produceWord('text')
          this.produceBlockEnd()
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceTagStart('emphasize#yellow', '\\emphasize #yellow {')
          this.produceWord('text')
          this.produceTagEnd('emphasize#yellow')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })

    it('recognize singleton tags with identifier and classes', function() {
      expect(
        interpretation(function() {
          this.produceTag('\\emphasize')
          this.produceSpace(' ')
          this.produceClass('.green')
          this.produceClass('.blue')
          this.produceIdentifier('#yellow')
          this.produceClass('.red')
          this.produceClass('.purple')
          this.produceSpace(' ')
          this.produceBlockStart()
          this.produceWord('text')
          this.produceBlockEnd()
          this.complete()
        })
      ).toMatchBuffer(
        ofProduction(function() {
          this.produceTagStart('document', '')
          this.produceTagStart('emphasize#yellow.green.blue.red.purple', '\\emphasize .green.blue#yellow.red.purple {')
          this.produceWord('text')
          this.produceTagEnd('emphasize#yellow.green.blue.red.purple')
          this.produceTagEnd('document', '')
          this.complete()
        })
      )
    })
  })
})
