/** eslint-env jest */

import { Empty, Factory } from '@cedric-demongivert/gl-tool-utils'

import { UnidocCoroutine } from '../../sources/stream/UnidocCoroutine'
import { feed } from '../../sources/stream/feed'
import { UnidocParser } from '../../sources/parser/UnidocParser'
import { UnidocTokenFlow } from '../../sources/token/UnidocTokenFlow'
import { UnidocEventFlow } from '../../sources/event/UnidocEventFlow'
import { UnidocEvent } from '../../sources/event/UnidocEvent'
import { UnidocToken } from '../../sources/token/UnidocToken'

/**
 * 
 */
import '../matchers'
import { UnidocLayout, UnidocOrigin } from '../../sources/origin'


/**
 * 
 */
function match(input: Factory<IterableIterator<UnidocToken>, [UnidocTokenFlow]>, scenario: Factory<UnidocCoroutine.Coroutine<UnidocEvent>, [UnidocEventFlow]>): void {
  const parser: UnidocParser = new UnidocParser()
  const tokenFlow: UnidocTokenFlow = new UnidocTokenFlow()
  const eventFlow: UnidocEventFlow = new UnidocEventFlow(UnidocTokenFlow.SOURCE)

  UnidocCoroutine.create<UnidocEvent>(scenario.bind(undefined, eventFlow)).subscribe(parser)
  feed(input(tokenFlow), parser)
}

/**
 * 
 */
function matchOnline(input: Factory<IterableIterator<UnidocToken>, [UnidocTokenFlow]>, scenario: Factory<UnidocCoroutine.Coroutine<UnidocEvent>, [UnidocEventFlow]>): void {
  const parser: UnidocParser = new UnidocParser()
  const tokenFlow: UnidocTokenFlow = new UnidocTokenFlow()
  const eventFlow: UnidocEventFlow = new UnidocEventFlow(UnidocTokenFlow.SOURCE)

  const coroutine: UnidocCoroutine<UnidocEvent> = UnidocCoroutine.create<UnidocEvent>(scenario.bind(undefined, eventFlow))
  coroutine.subscribe(parser)

  feed.online(input(tokenFlow), parser)
  coroutine.success()
}

/**
 * 
 */
describe('UnidocParser', function () {
  /**
   * 
   */
  describe('whitespace recognition', function () {
    /**
     * 
     */
    it('recognize sequence of space tokens', function () {
      match(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenSpace('   ')
          yield tokens.thenSpace('\t')
          yield tokens.thenSpace('\t\f')
          yield tokens.thenSpace('  ')
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenWhitespace('   \t\t\f  '))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('recognize sequence of newline tokens', function () {
      match(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenNewline('\n')
          yield tokens.thenNewline('\r\n')
          yield tokens.thenNewline('\r')
          yield tokens.thenNewline('\r\n')
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenWhitespace('\n\r\n\r\r\n'))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('recognize sequence of both newline and space tokens', function () {
      match(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenNewline('\n')
          yield tokens.thenSpace(' \t\t\f')
          yield tokens.thenNewline('\r')
          yield tokens.thenNewline('\r\n')
          yield tokens.thenSpace('  \f')
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenWhitespace('\n \t\t\f\r\r\n  \f'))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('recognize whitespace when other type of tokens are discovered', function () {
      matchOnline(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenNewline('\n')
          yield tokens.thenSpace(' \t\t\f')
          yield tokens.thenNewline('\r')
          yield tokens.thenNewline('\r\n')
          yield tokens.thenSpace('  \f')
          yield tokens.thenWord('qwerty')
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenWhitespace('\n \t\t\f\r\r\n  \f'))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('recognize whitespace between words', function () {
      matchOnline(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenWord('zwrtyt')
          yield tokens.thenNewline('\n')
          yield tokens.thenSpace(' \t\t\f')
          yield tokens.thenNewline('\r')
          yield tokens.thenNewline('\r\n')
          yield tokens.thenSpace('  \f')
          yield tokens.thenWord('qwerty')
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenWord('zwrtyt'))
          expect(yield).toBeNext(event.thenWhitespace('\n \t\t\f\r\r\n  \f'))
          expect(yield).toBeSuccess()
        }
      )
    })
  })

  /**
   * 
   */
  describe('word recognition', function () {
    /**
     * 
     */
    it('recognize sequence of word tokens', function () {
      match(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenWord('awe')
          yield tokens.thenWord('a')
          yield tokens.thenWord('ioP')
          yield tokens.thenWord('nt')
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenWord('aweaioPnt'))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('recognize word when other type of tokens are discovered', function () {
      matchOnline(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenWord('awe')
          yield tokens.thenWord('a')
          yield tokens.thenWord('ioP')
          yield tokens.thenWord('nt')
          yield tokens.thenTag('\\bold')
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenWord('aweaioPnt'))
          expect(yield).toBeSuccess()
        }
      )
    })
  })

  /**
   * 
   */
  describe('tag recognition', function () {
    /**
     * 
     */
    it('recognize anonymous blocks as block tags', function () {
      match(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenBlockStart()
          yield tokens.thenBlockEnd()
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenTagStart('block', '{'))
          expect(yield).toBeNext(event.thenTagEnd('}'))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('recognize lonely tags before text', function () {
      match(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenTag('\\emphasize')
          yield tokens.thenSpace(' ')
          yield tokens.thenWord('text')
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenTagStart('emphasize', '\\emphasize'))
          expect(yield).toBeNext(event.thenTagEnd(Empty.STRING))
          expect(yield).toBeNext(event.thenWhitespace(' '))
          expect(yield).toBeNext(event.thenWord('text'))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('recognize lonely tags before tags', function () {
      matchOnline(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenTag('\\emphasize')
          yield tokens.thenSpace(' ')
          yield tokens.thenTag('\\emphasize')
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenTagStart('emphasize', '\\emphasize'))
          expect(yield).toBeNext(event.thenTagEnd(Empty.STRING))
          expect(yield).toBeNext(event.thenWhitespace(' '))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('recognize lonely tags with classes', function () {
      matchOnline(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenTag('\\emphasize')
          yield tokens.thenSpace(' ')
          yield tokens.thenClass('.yellow')
          yield tokens.thenClass('.green')
          yield tokens.thenClass('.blue')
          yield tokens.thenSpace(' ')
          yield tokens.thenWord('text')
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenTagStart('emphasize.yellow.green.blue', '\\emphasize .yellow.green.blue'))
          expect(yield).toBeNext(event.thenTagEnd(Empty.STRING))
          expect(yield).toBeNext(event.thenWhitespace(' '))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('recognize lonely tags with identifier', function () {
      matchOnline(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenTag('\\emphasize')
          yield tokens.thenSpace(' ')
          yield tokens.thenIdentifier('#yellow')
          yield tokens.thenSpace(' ')
          yield tokens.thenWord('text')
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenTagStart('emphasize#yellow', '\\emphasize #yellow'))
          expect(yield).toBeNext(event.thenTagEnd(Empty.STRING))
          expect(yield).toBeNext(event.thenWhitespace(' '))
          expect(yield).toBeSuccess()
        }
      )
    })

    it('recognize lonely tags with identifier and classes', function () {
      matchOnline(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenTag('\\emphasize')
          yield tokens.thenSpace(' ')
          yield tokens.thenClass('.green')
          yield tokens.thenClass('.blue')
          yield tokens.thenIdentifier('#yellow')
          yield tokens.thenClass('.red')
          yield tokens.thenClass('.purple')
          yield tokens.thenSpace(' ')
          yield tokens.thenWord('text')
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenTagStart('emphasize#yellow.green.blue.red.purple', '\\emphasize .green.blue#yellow.red.purple'))
          expect(yield).toBeNext(event.thenTagEnd(Empty.STRING))
          expect(yield).toBeNext(event.thenWhitespace(' '))
          expect(yield).toBeSuccess()
        }
      )
    })


    /**
     * 
     */
    it('recognize finishing lonely tags with classes', function () {
      match(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenTag('\\emphasize')
          yield tokens.thenSpace(' ')
          yield tokens.thenClass('.yellow')
          yield tokens.thenClass('.green')
          yield tokens.thenClass('.blue')
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenTagStart('emphasize.yellow.green.blue', '\\emphasize .yellow.green.blue'))
          expect(yield).toBeNext(event.thenTagEnd(Empty.STRING))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('recognize finishing lonely tags with identifier', function () {
      match(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenTag('\\emphasize')
          yield tokens.thenSpace(' ')
          yield tokens.thenIdentifier('#yellow')
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenTagStart('emphasize#yellow', '\\emphasize #yellow'))
          expect(yield).toBeNext(event.thenTagEnd(Empty.STRING))
          expect(yield).toBeSuccess()
        }
      )
    })

    it('recognize finishing lonely tags with identifier and classes', function () {
      match(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenTag('\\emphasize')
          yield tokens.thenSpace(' ')
          yield tokens.thenClass('.green')
          yield tokens.thenClass('.blue')
          yield tokens.thenIdentifier('#yellow')
          yield tokens.thenClass('.red')
          yield tokens.thenClass('.purple')
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenTagStart('emphasize#yellow.green.blue.red.purple', '\\emphasize .green.blue#yellow.red.purple'))
          expect(yield).toBeNext(event.thenTagEnd(Empty.STRING))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('recognize block tags', function () {
      match(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenTag('\\emphasize')
          yield tokens.thenSpace(' ')
          yield tokens.thenBlockStart()
          yield tokens.thenWord('text')
          yield tokens.thenBlockEnd()
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenTagStart('emphasize', '\\emphasize {'))
          expect(yield).toBeNext(event.thenWord('text'))
          expect(yield).toBeNext(event.thenTagEnd('}'))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('recognize block tags with classes', function () {
      match(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenTag('\\emphasize')
          yield tokens.thenSpace(' ')
          yield tokens.thenClass('.yellow')
          yield tokens.thenClass('.green')
          yield tokens.thenClass('.blue')
          yield tokens.thenSpace(' ')
          yield tokens.thenBlockStart()
          yield tokens.thenWord('text')
          yield tokens.thenBlockEnd()
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenTagStart('emphasize.yellow.green.blue', '\\emphasize .yellow.green.blue {'))
          expect(yield).toBeNext(event.thenWord('text'))
          expect(yield).toBeNext(event.thenTagEnd('}'))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('recognize block tags with identifier', function () {
      match(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenTag('\\emphasize')
          yield tokens.thenSpace(' ')
          yield tokens.thenIdentifier('#yellow')
          yield tokens.thenSpace(' ')
          yield tokens.thenBlockStart()
          yield tokens.thenWord('text')
          yield tokens.thenBlockEnd()
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenTagStart('emphasize#yellow', '\\emphasize #yellow {'))
          expect(yield).toBeNext(event.thenWord('text'))
          expect(yield).toBeNext(event.thenTagEnd('}'))
          expect(yield).toBeSuccess()
        }
      )
    })

    /**
     * 
     */
    it('recognize singleton tags with identifier and classes', function () {
      match(
        function* (tokens: UnidocTokenFlow) {
          yield tokens.thenTag('\\emphasize')
          yield tokens.thenSpace(' ')
          yield tokens.thenClass('.green')
          yield tokens.thenClass('.blue')
          yield tokens.thenIdentifier('#yellow')
          yield tokens.thenClass('.red')
          yield tokens.thenClass('.purple')
          yield tokens.thenSpace(' ')
          yield tokens.thenBlockStart()
          yield tokens.thenWord('text')
          yield tokens.thenBlockEnd()
        },
        function* (event: UnidocEventFlow) {
          expect(yield).toBeStart()
          expect(yield).toBeNext(event.thenTagStart('emphasize#yellow.green.blue.red.purple', '\\emphasize .green.blue#yellow.red.purple {'))
          expect(yield).toBeNext(event.thenWord('text'))
          expect(yield).toBeNext(event.thenTagEnd('}'))
          expect(yield).toBeSuccess()
        }
      )
    })
  })
})
