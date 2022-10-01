/** eslint-env jest */

import { Factory } from '@cedric-demongivert/gl-tool-utils'

import { UnidocConsumer } from '../../sources/stream/UnidocConsumer'
import { UnidocCoroutine } from '../../sources/stream/UnidocCoroutine'
import { UnidocToken } from '../../sources/token/UnidocToken'
import { UnidocTokenFlow } from '../../sources/token/UnidocTokenFlow'
import { UnidocSymbols } from '../../sources/symbol/UnidocSymbols'
import { UnidocLexerState } from '../../sources/lexer/UnidocLexerState'
import { UnidocLexer } from '../../sources/lexer/UnidocLexer'

/**
 * 
 */
import '../matchers'

/**
 * 
 */
function match(content: string, scenario: Factory<UnidocCoroutine.Coroutine<UnidocToken>, [UnidocTokenFlow]>): void {
  const lexer: UnidocLexer = new UnidocLexer()
  const flow: UnidocTokenFlow = new UnidocTokenFlow(UnidocSymbols.fromString.URI)

  UnidocCoroutine.create<UnidocToken>(scenario.bind(undefined, flow)).subscribe(lexer)
  UnidocConsumer.feed(UnidocSymbols.fromString(content), lexer)
}

/**
 * 
 */
function matchOnline(content: string, scenario: Factory<UnidocCoroutine.Coroutine<UnidocToken>, [UnidocTokenFlow]>): void {
  const lexer: UnidocLexer = new UnidocLexer()
  const flow: UnidocTokenFlow = new UnidocTokenFlow(UnidocSymbols.fromString.URI)
  const coroutine: UnidocCoroutine<UnidocToken> = UnidocCoroutine.create<UnidocToken>(scenario.bind(undefined, flow))

  coroutine.subscribe(lexer)
  UnidocConsumer.feed.online(UnidocSymbols.fromString(content), lexer)
  coroutine.success()
}

/**
 * 
 */
describe('UnidocLexer', function () {
  /**
   * 
   */
  it('instantiate a new lexer', function () {
    const lexer: UnidocLexer = new UnidocLexer()
    expect(lexer.state).toBe(UnidocLexerState.START)
  })

  /**
   * 
   */
  describe('block opening recognition', function () {
    /**
     * 
     */
    it('recognize block opening', function () {
      match('{{{', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenBlockStart())
        expect(yield).toBeNext(flow.thenBlockStart())
        expect(yield).toBeNext(flow.thenBlockStart())
        expect(yield).toBeSuccess()
      })
    })
  })

  /**
   * 
   */
  describe('block termination recognition', function () {
    /**
     * 
     */
    it('recognize block termination', function () {
      match('}}}', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenBlockEnd())
        expect(yield).toBeNext(flow.thenBlockEnd())
        expect(yield).toBeNext(flow.thenBlockEnd())
        expect(yield).toBeSuccess()
      })
    })
  })

  /**
   * 
   */
  describe('tag recognition', function () {
    /**
     * 
     */
    it('recognize tags', function () {
      match('\\alberta\\Chicago\\3d\\--meow-w', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenTag('\\alberta'))
        expect(yield).toBeNext(flow.thenTag('\\Chicago'))
        expect(yield).toBeNext(flow.thenTag('\\3d'))
        expect(yield).toBeNext(flow.thenTag('\\--meow-w'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize tags when they are followed by a class', function () {
      matchOnline('\\alberta.', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenTag('\\alberta'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize tags when they are followed by a space', function () {
      matchOnline('\\alberta ', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenTag('\\alberta'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize tags when they are followed by an identifier', function () {
      matchOnline('\\alberta#', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenTag('\\alberta'))
        expect(yield).toBeSuccess()
      })
    })
  })

  /**
   * 
   */
  describe('class recognition', function () {
    /**
     * 
     */
    it('recognize classes', function () {
      match('.alberta.Chicago.3d.--meow-w', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenClass('.alberta'))
        expect(yield).toBeNext(flow.thenClass('.Chicago'))
        expect(yield).toBeNext(flow.thenClass('.3d'))
        expect(yield).toBeNext(flow.thenClass('.--meow-w'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize classes when they are followed by a space', function () {
      matchOnline('.alberta ', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenClass('.alberta'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize classes when they are followed by a tag', function () {
      matchOnline('.alberta\\', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenClass('.alberta'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize classes when they are followed by an identifier', function () {
      matchOnline('.alberta#', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenClass('.alberta'))
        expect(yield).toBeSuccess()
      })
    })
  })

  /**
   * 
   */
  describe('identifier recognition', function () {
    /**
     * 
     */
    it('recognize identifiers', function () {
      match('#alberta#Chicago#3d#--meow-w', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenIdentifier('#alberta'))
        expect(yield).toBeNext(flow.thenIdentifier('#Chicago'))
        expect(yield).toBeNext(flow.thenIdentifier('#3d'))
        expect(yield).toBeNext(flow.thenIdentifier('#--meow-w'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize identifiers when they are followed by a space', function () {
      matchOnline('#alberta ', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenIdentifier('#alberta'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize identifiers when they are followed by a tag', function () {
      matchOnline('#alberta\\', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenIdentifier('#alberta'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize identifiers when they are followed by a class', function () {
      matchOnline('#alberta.', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenIdentifier('#alberta'))
        expect(yield).toBeSuccess()
      })
    })
  })

  /**
   * 
   */
  describe('word recognition', function () {
    /**
     * 
     */
    it('recognize words', function () {
      match('only 1 test on this str#ing', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenWord('only'))
        expect(yield).toBeNext(flow.thenSpace(' '))
        expect(yield).toBeNext(flow.thenWord('1'))
        expect(yield).toBeNext(flow.thenSpace(' '))
        expect(yield).toBeNext(flow.thenWord('test'))
        expect(yield).toBeNext(flow.thenSpace(' '))
        expect(yield).toBeNext(flow.thenWord('on'))
        expect(yield).toBeNext(flow.thenSpace(' '))
        expect(yield).toBeNext(flow.thenWord('this'))
        expect(yield).toBeNext(flow.thenSpace(' '))
        expect(yield).toBeNext(flow.thenWord('str#ing'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize degenerated classes as words', function () {
      matchOnline('..acuriousclass ', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenWord('..acuriousclass'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize degenerated identifiers as words', function () {
      matchOnline('##acuriousidentifier ', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenWord('##acuriousidentifier'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize degenerated tags as words', function () {
      matchOnline('\\\\acurioustag ', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenWord('\\\\acurioustag'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize dot as words', function () {
      matchOnline('. ', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenWord('.'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize sharp as words', function () {
      matchOnline('# ', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenWord('#'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize antislash as words', function () {
      matchOnline('\\ ', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenWord('\\'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize words that contains dots', function () {
      matchOnline('alberta.test. ', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenWord('alberta.test.'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize words when they are followed by a space', function () {
      matchOnline('alberta ', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenWord('alberta'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize words when they are followed by a tag', function () {
      matchOnline('alberta\\', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenWord('alberta'))
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize words when they are followed by a block termination', function () {
      matchOnline('alberta}', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenWord('alberta'))
        expect(yield).toBeNext(flow.thenBlockEnd())
        expect(yield).toBeSuccess()
      })
    })

    /**
     * 
     */
    it('recognize words when they are followed by a block start', function () {
      matchOnline('alberta{', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenWord('alberta'))
        expect(yield).toBeNext(flow.thenBlockStart())
        expect(yield).toBeSuccess()
      })
    })
  })

  /**
   * 
   */
  describe('newline recognition', function () {
    /**
     * 
     */
    it('recognize newlines', function () {
      match('\r\n\n\r\r', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenNewline('\r\n'))
        expect(yield).toBeNext(flow.thenNewline('\n'))
        expect(yield).toBeNext(flow.thenNewline('\r'))
        expect(yield).toBeNext(flow.thenNewline('\r'))
        expect(yield).toBeSuccess()
      })
    })
  })

  /**
   * 
   */
  describe('space recognition', function () {
    /**
     * 
     */
    it('recognize spaces', function () {
      match(' \t\t ', function* (flow: UnidocTokenFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(flow.thenSpace(' \t\t '))
        expect(yield).toBeSuccess()
      })
    })
  })
})
