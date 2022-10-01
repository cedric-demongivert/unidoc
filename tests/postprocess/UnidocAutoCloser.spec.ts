/** eslint-env jest */

import { Empty, Factory } from '@cedric-demongivert/gl-tool-utils'

import { UnidocCoroutine } from '../../sources/stream/UnidocCoroutine'
import { UnidocConsumer } from '../../sources/stream/UnidocConsumer'
import { UnidocAutoCloser } from '../../sources/postprocess/UnidocAutoCloser'
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
  const postprocess: UnidocAutoCloser = new UnidocAutoCloser()
  const inputFlow: UnidocEventFlow = new UnidocEventFlow()
  const outputFlow: UnidocEventFlow = new UnidocEventFlow()

  UnidocCoroutine.create<UnidocEvent>(scenario.bind(undefined, outputFlow)).subscribe(postprocess)
  UnidocConsumer.feed(input(inputFlow), postprocess)
}

/**
 * 
 */
function matchOnline(input: Factory<IterableIterator<UnidocEvent>, [UnidocEventFlow]>, scenario: Factory<UnidocCoroutine.Coroutine<UnidocEvent>, [UnidocEventFlow]>): void {
  const postprocess: UnidocAutoCloser = new UnidocAutoCloser()
  const inputFlow: UnidocEventFlow = new UnidocEventFlow()
  const outputFlow: UnidocEventFlow = new UnidocEventFlow()

  const coroutine: UnidocCoroutine<UnidocEvent> = UnidocCoroutine.create<UnidocEvent>(scenario.bind(undefined, outputFlow))
  coroutine.subscribe(postprocess)

  UnidocConsumer.feed.online(input(inputFlow), postprocess)
  coroutine.success()
}

/**
 * 
 */
describe('UnidocAutoCloser', function () {
  /**
   * 
   */
  it('auto close unclosed tags', function () {
    match(
      function* (input: UnidocEventFlow) {
        yield input.thenTagStart('first.test', '\\first.test')
        yield input.thenTagStart('second#identifier', '\\second#identifier')
        yield input.thenTagStart('third', '\\third')
      },
      function* (output: UnidocEventFlow) {
        expect(yield).toBeStart()
        expect(yield).toBeNext(output.thenTagStart('first.test', '\\first.test'))
        expect(yield).toBeNext(output.thenTagStart('second#identifier', '\\second#identifier'))
        expect(yield).toBeNext(output.thenTagStart('third', '\\third'))
        expect(yield).toBeNext(output.thenTagEnd(Empty.STRING))
        expect(yield).toBeNext(output.thenTagEnd(Empty.STRING))
        expect(yield).toBeNext(output.thenTagEnd(Empty.STRING))
        expect(yield).toBeSuccess()
      }
    )
  })
})
