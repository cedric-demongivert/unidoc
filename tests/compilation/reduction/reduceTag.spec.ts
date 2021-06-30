import { UnidocRuntimeEventProducer } from '../../../sources/event/UnidocRuntimeEventProducer'
import { UnidocEvent } from '../../../sources/event/UnidocEvent'
import { UnidocBuffer } from '../../../sources/buffer/UnidocBuffer'
import { UnidocReductionInput } from '../../../sources/compilation/reduction/UnidocReductionInput'
import { reduce } from '../../../sources/compilation/reduction/common/reduce'
import { UnidocReductionRequest } from '../../../sources/compilation/reduction/UnidocReductionRequest'
import { UnidocReducer } from '../../../sources/compilation/reduction/UnidocReducer'
import { reduceTag } from '../../../sources/compilation/reduction/common/reduceTag'
import { reduceText } from '../../../sources/compilation/reduction/common/reduceText'

describe('reduceTag', function () {
  describe('reduceTag.content', function () {
    it('reduce a tag content', function () {
      const eventStream: UnidocRuntimeEventProducer = new UnidocRuntimeEventProducer()
      const eventBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(eventStream, UnidocEvent.ALLOCATOR)

      eventStream.produceTagStart('strong')
      eventStream.produceText('Lorem ipsum dolor sit amet consequetur.')
      eventStream.produceTagEnd('strong')

      function* content(): Generator<UnidocReductionInput> {
        yield UnidocReductionInput.START
        for (const event of eventBuffer) {
          yield UnidocReductionInput.event(event)
        }
        yield UnidocReductionInput.END
      }

      expect(
        reduce.iterator(content(), reduceTag.content(reduceText()))
      ).toBe('Lorem ipsum dolor sit amet consequetur.')
    })

    it('return undefined if there is no tag', function () {
      function* content(): Generator<UnidocReductionInput> {
        yield UnidocReductionInput.START
        yield UnidocReductionInput.END
      }

      expect(
        reduce.iterator(content(), reduceTag.content(reduceText()))
      ).toBeUndefined()
    })
  })

  it('reduce a tag', function () {
    const eventStream: UnidocRuntimeEventProducer = new UnidocRuntimeEventProducer()
    const eventBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(eventStream, UnidocEvent.ALLOCATOR)

    eventStream.produceTagStart('strong')
    eventStream.produceText('Lorem ipsum dolor sit amet consequetur.')
    eventStream.produceTagEnd('strong')

    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      for (const event of eventBuffer) {
        yield UnidocReductionInput.event(event)
      }
      yield UnidocReductionInput.END
    }

    function* reducer(): UnidocReducer<string | undefined> {
      yield UnidocReductionRequest.NEXT
      yield UnidocReductionRequest.NEXT
      const text: string | undefined = yield* reduceText()
      yield UnidocReductionRequest.NEXT
      return text
    }

    expect(
      reduce.iterator(content(), reduceTag(reducer()))
    ).toBe('Lorem ipsum dolor sit amet consequetur.')
  })

  it('return undefined if there is no tag', function () {
    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      yield UnidocReductionInput.END
    }

    function* reducer(): UnidocReducer<string | undefined> {
      yield UnidocReductionRequest.NEXT
      const text: string | undefined = yield* reduceText()
      yield UnidocReductionRequest.NEXT
      return text
    }

    expect(reduce.iterator(content(), reduceTag(reducer()))).toBeUndefined()
  })
})
