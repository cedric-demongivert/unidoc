/** eslint-env jest */

import { UnidocParser } from '../../sources/parser/UnidocParser'
import { TrackedUnidocTokenProducer } from '../../sources/token/TrackedUnidocTokenProducer'
import { UnidocEventBuffer } from '../../sources/event/UnidocEventBuffer'
import { UnidocEventProducer } from '../../sources/event/UnidocEventProducer'

describe('UnidocParser', function () {
  describe('document tag recognition', function () {
    it('emit a document starting event when a word is discovered', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceWord('test')

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document', '')
                         .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('emit a document starting event when a class is discovered', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceClass('.test')

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document', '')
                         .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('emit a document starting event when an identifier is discovered', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceIdentifier('#test')

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document', '')
                         .complete()


      expect(expectation.expect(output)).toBeTruthy()
    })

    it('emit a document starting event when a tag is discovered', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceTag('\\test')

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer
        .forBuffer(expectation)
        .produceTagStart('document', '')
        .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('emit a document starting event when a block opening is discovered', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceBlockStart()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
            .produceTagStart('document', '')
            .produceTagStart('block', '{')
            .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('emit a document ending event at completion', function () {
      const parser      : UnidocParser      = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceWord('test')
        .complete()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document', '')
                         .produceWord('test')
                         .produceTagEnd('document', '')
                         .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('emit a document tag starting and ending event at completion if empty', function () {
      const parser : UnidocParser = new UnidocParser()
      const output : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .complete()

     const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
     UnidocEventProducer.forBuffer(expectation)
                        .produceTagStart('document', '')
                        .produceTagEnd('document', '')
                        .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize the root document tag', function () {
      const parser      : UnidocParser      = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceString('\n\r\n\t ')
        .produceTag('\\doCuMent')
        .produceSpace('\t ')
        .produceClass('.article')
        .produceClass('.go')
        .produceIdentifier('#pwet')
        .produceNewline('\r\n')
        .produceClass('.green')
        .produceString(' \r\n\r\n')
        .produceClass('.blue')
        .produceString(' test')
        .complete()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document#pwet.article.go.green.blue', '\n\r\n\t \\doCuMent\t .article.go#pwet\r\n.green \r\n\r\n.blue')
                         .produceWhitespace(' ')
                         .produceWord('test')
                         .produceTagEnd('document#pwet.article.go.green.blue', '')
                         .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize the root document with a class followed by a tag', function () {
      const parser      : UnidocParser      = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceTag('\\docuMent')
        .produceClass('.ruleset')
        .produceString('\r\n\r\n')
        .produceTag('\\title')
        .produceSpace(' ')
        .produceIdentifier('#characteristics')
        .produceSpace(' ')
        .produceBlockStart()
        .produceString(' green ')
        .produceBlockEnd()
        .produceNewline('\r\n')
        .complete()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document.ruleset', '\\docuMent.ruleset')
                         .produceWhitespace('\r\n\r\n')
                         .produceTagStart('title#characteristics', '\\title #characteristics {')
                         .produceWhitespace(' ')
                         .produceWord('green')
                         .produceWhitespace(' ')
                         .produceTagEnd('title#characteristics')
                         .produceWhitespace('\r\n')
                         .produceTagEnd('document.ruleset', '')
                         .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })
  })

  describe('whitespace recognition', function () {
    it('recognize sequence of space tokens', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceSpace('   ')
        .produceSpace('\t')
        .produceSpace('\t\f')
        .produceSpace('  ')
        .complete()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document', '')
                         .produceWhitespace('   \t\t\f  ')
                         .produceTagEnd('document', '')
                         .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize sequence of newline tokens', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceNewline('\n')
        .produceNewline('\r\n')
        .produceNewline('\r')
        .produceNewline('\r\n')
        .complete()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document', '')
                         .produceWhitespace('\n\r\n\r\r\n')
                         .produceTagEnd('document', '')
                         .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize sequence of both newline and space tokens', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceNewline('\n')
        .produceSpace(' \t\t\f')
        .produceNewline('\r')
        .produceNewline('\r\n')
        .produceSpace('  \f')
        .complete()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document', '')
                         .produceWhitespace('\n \t\t\f\r\r\n  \f')
                         .produceTagEnd('document', '')
                         .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize whitespace when other type of tokens are discovered', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceNewline('\n')
        .produceSpace(' \t\t\f')
        .produceNewline('\r')
        .produceNewline('\r\n')
        .produceWord('qwerty')

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                          .produceTagStart('document', '')
                          .produceWhitespace('\n \t\t\f\r\r\n')
                          .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize whitespace between words', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceWord('zwrtyt')
        .produceNewline('\n')
        .produceSpace(' \t\t\f')
        .produceNewline('\r')
        .produceNewline('\r\n')
        .produceWord('qwerty')

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                          .produceTagStart('document', '')
                          .produceWord('zwrtyt')
                          .produceWhitespace('\n \t\t\f\r\r\n')
                          .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })
  })

  describe('word recognition', function () {
    it('recognize sequence of word tokens', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceWord('awe')
        .produceWord('a')
        .produceWord('ioP')
        .produceWord('nt')
        .complete()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                          .produceTagStart('document', '')
                          .produceWord('aweaioPnt')
                          .produceTagEnd('document', '')
                          .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize word when other type of tokens are discovered', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceWord('awe')
        .produceWord('a')
        .produceWord('ioP')
        .produceWord('nt')
        .produceBlockStart()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                          .produceTagStart('document', '')
                          .produceWord('aweaioPnt')
                          .produceTagStart('block', '{')
                          .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })
  })

  describe('tag recognition', function () {
    it('recognize blocks as block tag', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceBlockStart()
        .produceBlockEnd()
        .complete()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                          .produceTagStart('document', '')
                          .produceTagStart('block', '{')
                          .produceTagEnd('block', '}')
                          .produceTagEnd('document', '')
                          .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize singleton tags before text', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceTag('\\emphasize')
        .produceSpace(' ')
        .produceWord('text')
        .complete()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                          .produceTagStart('document', '')
                          .produceTagStart('emphasize', '\\emphasize')
                          .produceTagEnd('emphasize', '')
                          .produceWhitespace(' ')
                          .produceWord('text')
                          .produceTagEnd('document', '')
                          .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize singleton tags before tags', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceTag('\\emphasize')
        .produceSpace(' ')
        .produceTag('\\emphasize')
        .produceSpace(' ')
        .produceWord('text')
        .complete()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                          .produceTagStart('document', '')
                          .produceTagStart('emphasize', '\\emphasize')
                          .produceTagEnd('emphasize', '')
                          .produceWhitespace(' ')
                          .produceTagStart('emphasize', '\\emphasize')
                          .produceTagEnd('emphasize', '')
                          .produceWhitespace(' ')
                          .produceWord('text')
                          .produceTagEnd('document', '')
                          .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize singleton tags with classes', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceTag('\\emphasize')
        .produceSpace(' ')
        .produceClass('.yellow')
        .produceClass('.green')
        .produceClass('.blue')
        .produceSpace(' ')
        .produceWord('text')
        .complete()

     const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
     UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document', '')
                         .produceTagStart('emphasize.yellow.green.blue', '\\emphasize .yellow.green.blue')
                         .produceTagEnd('emphasize.yellow.green.blue', '')
                         .produceWhitespace(' ')
                         .produceWord('text')
                         .produceTagEnd('document', '')
                         .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize singleton tags with identifier', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceTag('\\emphasize')
        .produceSpace(' ')
        .produceIdentifier('#yellow')
        .produceSpace(' ')
        .produceWord('text')
        .complete()

     const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
     UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document', '')
                         .produceTagStart('emphasize#yellow', '\\emphasize #yellow')
                         .produceTagEnd('emphasize#yellow', '')
                         .produceWhitespace(' ')
                         .produceWord('text')
                         .produceTagEnd('document', '')
                         .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize singleton tags with identifier and classes', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceTag('\\emphasize')
        .produceSpace(' ')
        .produceClass('.green')
        .produceClass('.blue')
        .produceIdentifier('#yellow')
        .produceClass('.red')
        .produceClass('.purple')
        .produceSpace(' ')
        .produceWord('text')
        .complete()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document', '')
                         .produceTagStart('emphasize#yellow.green.blue.red.purple', '\\emphasize .green.blue#yellow.red.purple')
                         .produceTagEnd('emphasize#yellow.green.blue.red.purple', '')
                         .produceWhitespace(' ')
                         .produceWord('text')
                         .produceTagEnd('document', '')
                         .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize block tags', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceTag('\\emphasize')
        .produceSpace(' ')
        .produceBlockStart()
        .produceWord('text')
        .produceBlockEnd()
        .complete()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document', '')
                         .produceTagStart('emphasize', '\\emphasize {')
                         .produceWord('text')
                         .produceTagEnd('emphasize')
                         .produceTagEnd('document', '')
                         .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize block tags with classes', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceTag('\\emphasize')
        .produceSpace(' ')
        .produceClass('.yellow')
        .produceClass('.green')
        .produceClass('.blue')
        .produceSpace(' ')
        .produceBlockStart()
        .produceWord('text')
        .produceBlockEnd()
        .complete()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document', '')
                         .produceTagStart('emphasize.yellow.green.blue', '\\emphasize .yellow.green.blue {')
                         .produceWord('text')
                         .produceTagEnd('emphasize.yellow.green.blue')
                         .produceTagEnd('document', '')
                         .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize block tags with identifier', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceTag('\\emphasize')
        .produceSpace(' ')
        .produceIdentifier('#yellow')
        .produceSpace(' ')
        .produceBlockStart()
        .produceWord('text')
        .produceBlockEnd()
        .complete()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document', '')
                         .produceTagStart('emphasize#yellow', '\\emphasize #yellow {')
                         .produceWord('text')
                         .produceTagEnd('emphasize#yellow')
                         .produceTagEnd('document', '')
                         .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })

    it('recognize singleton tags with identifier and classes', function () {
      const parser      : UnidocParser = new UnidocParser()
      const output      : UnidocEventBuffer = new UnidocEventBuffer(8)

      parser.addEventListener('event', output.push.bind(output))

      TrackedUnidocTokenProducer
        .forParser(parser)
        .produceTag('\\emphasize')
        .produceSpace(' ')
        .produceClass('.green')
        .produceClass('.blue')
        .produceIdentifier('#yellow')
        .produceClass('.red')
        .produceClass('.purple')
        .produceSpace(' ')
        .produceBlockStart()
        .produceWord('text')
        .produceBlockEnd()
        .complete()

      const expectation : UnidocEventBuffer = new UnidocEventBuffer(8)
      UnidocEventProducer.forBuffer(expectation)
                         .produceTagStart('document', '')
                         .produceTagStart('emphasize#yellow.green.blue.red.purple', '\\emphasize .green.blue#yellow.red.purple {')
                         .produceWord('text')
                         .produceTagEnd('emphasize#yellow.green.blue.red.purple')
                         .produceTagEnd('document', '')
                         .complete()

      expect(expectation.expect(output)).toBeTruthy()
    })
  })
})
