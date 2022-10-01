import { UnidocEvent } from "../sources/event/UnidocEvent"
import { UnidocEventFlow } from "../sources/event/UnidocEventFlow"
import { UnidocConsumer, UnidocCoroutine, UnidocPipe, UnidocProducer, UnidocStream } from "../sources/stream"
import { UnidocSymbols } from "../sources/symbol"
import { Unidoc } from "../sources/Unidoc"

/**
 * 
 */
import './matchers'

/**
 * 
 */
describe('Unidoc', function () {
  /**
   * 
   */
  describe('iterate', function () {
    /**
     * 
     */
    describe('text', function () {
      /**
       * 
       */
      it('parse the given piece of text', function () {
        UnidocConsumer.feed(
          Unidoc.iterate.text(
            '\\paragraph.lonely {',
            '  \\title { dolor sit amet }',
            '  Some content written here.',
            '}'
          ),
          UnidocStream.coroutine<UnidocEvent>(function* () {
            const flow = new UnidocEventFlow(UnidocSymbols.fromString.URI)

            expect(yield).toBeStart()

            expect(yield).toBeNext(flow.thenTagStart('paragraph.lonely', '\\paragraph.lonely {'))
            expect(yield).toBeNext(flow.thenWhitespace('\r\n  '))
            expect(yield).toBeNext(flow.thenTagStart('title', '\\title {'))
            expect(yield).toBeNext(flow.thenWhitespace(' '))
            for (const content of flow.thenText('dolor sit amet')) expect(yield).toBeNext(content)
            expect(yield).toBeNext(flow.thenWhitespace(' '))
            expect(yield).toBeNext(flow.thenTagEnd())
            expect(yield).toBeNext(flow.thenWhitespace('\r\n  '))
            for (const content of flow.thenText('Some content written here.')) expect(yield).toBeNext(content)
            expect(yield).toBeNext(flow.thenWhitespace('\r\n'))
            expect(yield).toBeNext(flow.thenTagEnd())

            expect(yield).toBeSuccess()
          })
        )
      })
    })
  })
})