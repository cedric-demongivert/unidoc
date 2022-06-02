/** eslint-env jest */

import { Empty, Factory } from '@cedric-demongivert/gl-tool-utils'

import { UnidocCoroutine } from '../../sources/stream/UnidocCoroutine'
import { feed } from '../../sources/stream/feed'
import { UnidocAutoWrapper } from '../../sources/postprocess/UnidocAutoWrapper'
import { UnidocEventFlow } from '../../sources/event/UnidocEventFlow'
import { UnidocEvent } from '../../sources/event/UnidocEvent'

/**
 * 
 */
import '../matchers'

/**
 * 
 */
function match(input: Factory<IterableIterator<UnidocEvent>, [UnidocEventFlow]>, scenario: Factory<UnidocCoroutine.Coroutine<UnidocEvent>, [UnidocEventFlow]>): void {
  const postprocess: UnidocAutoWrapper = new UnidocAutoWrapper()
  const inputFlow: UnidocEventFlow = new UnidocEventFlow()
  const outputFlow: UnidocEventFlow = new UnidocEventFlow()

  UnidocCoroutine.create<UnidocEvent>(scenario.bind(undefined, outputFlow)).subscribe(postprocess)
  feed(input(inputFlow), postprocess)
}

/**
 * 
 */
function matchOnline(input: Factory<IterableIterator<UnidocEvent>, [UnidocEventFlow]>, scenario: Factory<UnidocCoroutine.Coroutine<UnidocEvent>, [UnidocEventFlow]>): void {
  const postprocess: UnidocAutoWrapper = new UnidocAutoWrapper()
  const inputFlow: UnidocEventFlow = new UnidocEventFlow()
  const outputFlow: UnidocEventFlow = new UnidocEventFlow()

  const coroutine: UnidocCoroutine<UnidocEvent> = UnidocCoroutine.create<UnidocEvent>(scenario.bind(undefined, outputFlow))
  coroutine.subscribe(postprocess)

  feed.online(input(inputFlow), postprocess)
  coroutine.success()
}

/**
 * 
 */
describe('UnidocAutoWrapper', function () {
  /**
   * 
   */
  it('wrap empty streams into a document tag', function () {
    match(
      function* (input: UnidocEventFlow) {

      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(output.thenTagStart('document', Empty.STRING).setOrigin(UnidocAutoWrapper.LAYOUT))
        expect(yield).toBeNext(output.thenTagEnd(Empty.STRING).setOrigin(UnidocAutoWrapper.LAYOUT))
        expect(yield).toBeSuccess()
      }
    )
  })

  /**
   * 
   */
  it('wrap spaces into a document tag', function () {
    match(
      function* (input: UnidocEventFlow) {
        yield input.thenWhitespace('  \t\t')
        yield input.thenWhitespace('\r\n\r\n\t')
      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(output.thenTagStart('document', Empty.STRING))
        expect(yield).toBeNext(output.thenWhitespace('  \t\t\r\n\r\n\t'))
        expect(yield).toBeNext(output.thenTagEnd(Empty.STRING))
        expect(yield).toBeSuccess()
      }
    )
  })

  /**
   * 
   */
  it('wrap content into a document tag', function () {
    match(
      function* (input: UnidocEventFlow) {
        yield input.thenWhitespace('  \t\t')
        yield input.thenWord('azerty')
        yield input.thenWhitespace('  ')
        yield input.thenTagStart('color', '\\color')
        yield input.thenTagEnd(Empty.STRING)
      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(output.thenTagStart('document', Empty.STRING))
        expect(yield).toBeNext(output.thenWhitespace('  \t\t'))
        expect(yield).toBeNext(output.thenWord('azerty'))
        expect(yield).toBeNext(output.thenWhitespace('  '))
        expect(yield).toBeNext(output.thenTagStart('color', '\\color'))
        expect(yield).toBeNext(output.thenTagEnd(Empty.STRING))
        expect(yield).toBeNext(output.thenTagEnd(Empty.STRING))
        expect(yield).toBeSuccess()
      }
    )
  })

  /**
   * 
   */
  it('allows to update the document tag by using a lonely tag at start', function () {
    match(
      function* (input: UnidocEventFlow) {
        yield input.thenTagStart('document.article', '\\document.article')
        yield input.thenWhitespace('\r\n')
        yield input.thenTagEnd(Empty.STRING)
        yield input.thenWord('azerty')
        yield input.thenWhitespace('  ')
        yield input.thenTagStart('color', '\\color')
        yield input.thenTagEnd(Empty.STRING)
      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(output.thenTagStart('document.article', '\\document.article'))
        expect(yield).toBeNext(output.thenWhitespace('\r\n'))
        expect(yield).toBeNext(output.thenWord('azerty'))
        expect(yield).toBeNext(output.thenWhitespace('  '))
        expect(yield).toBeNext(output.thenTagStart('color', '\\color'))
        expect(yield).toBeNext(output.thenTagEnd(Empty.STRING))
        expect(yield).toBeNext(output.thenTagEnd(Empty.STRING))
        expect(yield).toBeSuccess()
      }
    )
  })

  /**
   * 
   */
  it('allows to update the document tag by using a lonely tag after leading whitespaces', function () {
    match(
      function* (input: UnidocEventFlow) {
        yield input.thenWhitespace('\r\n\t  \r\n\n\n')
        yield input.thenTagStart('document.article', '\\document.article')
        yield input.thenWhitespace('\r\n')
        yield input.thenTagEnd(Empty.STRING)
        yield input.thenWord('azerty')
        yield input.thenWhitespace('  ')
        yield input.thenTagStart('color', '\\color')
        yield input.thenTagEnd(Empty.STRING)
      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        output.skip('\r\n\t  \r\n\n\n')
        expect(yield).toBeNext(output.thenTagStart('document.article', '\\document.article'))
        expect(yield).toBeNext(output.thenWhitespace('\r\n'))
        expect(yield).toBeNext(output.thenWord('azerty'))
        expect(yield).toBeNext(output.thenWhitespace('  '))
        expect(yield).toBeNext(output.thenTagStart('color', '\\color'))
        expect(yield).toBeNext(output.thenTagEnd(Empty.STRING))
        expect(yield).toBeNext(output.thenTagEnd(Empty.STRING))
        expect(yield).toBeSuccess()
      }
    )
  })

  /**
   * 
   */
  it('recognize already wrapped streams', function () {
    match(
      function* (input: UnidocEventFlow) {
        yield input.thenTagStart('document.article', '\\document.article')
        yield input.thenWhitespace('\r\n')
        yield input.thenWord('azerty')
        yield input.thenWhitespace('  ')
        yield input.thenTagStart('color', '\\color')
        yield input.thenTagEnd(Empty.STRING)
        yield input.thenTagEnd()
      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(output.thenTagStart('document.article', '\\document.article'))
        expect(yield).toBeNext(output.thenWhitespace('\r\n'))
        expect(yield).toBeNext(output.thenWord('azerty'))
        expect(yield).toBeNext(output.thenWhitespace('  '))
        expect(yield).toBeNext(output.thenTagStart('color', '\\color'))
        expect(yield).toBeNext(output.thenTagEnd(Empty.STRING))
        expect(yield).toBeNext(output.thenTagEnd())
        expect(yield).toBeSuccess()
      }
    )
  })

  /**
   * 
   */
  it('correct no fully wrapped streams', function () {
    match(
      function* (input: UnidocEventFlow) {
        yield input.thenTagStart('document.article', '\\document.article')
        yield input.thenWhitespace('\r\n')
        yield input.thenWord('azerty')
        yield input.thenWhitespace('  ')
        yield input.thenTagEnd()
        yield input.thenTagStart('color', '\\color')
        yield input.thenTagEnd(Empty.STRING)
      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(output.thenTagStart('document.article', '\\document.article'))
        expect(yield).toBeNext(output.thenWhitespace('\r\n'))
        expect(yield).toBeNext(output.thenWord('azerty'))
        expect(yield).toBeNext(output.thenWhitespace('  '))
        output.skip('}')
        expect(yield).toBeNext(output.thenTagStart('color', '\\color'))
        expect(yield).toBeNext(output.thenTagEnd(Empty.STRING))
        expect(yield).toBeNext(output.thenTagEnd(Empty.STRING))
        expect(yield).toBeSuccess()
      }
    )
  })
})
