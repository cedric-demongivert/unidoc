import { TrackedUnidocEventProducer } from '../../../sources/event/TrackedUnidocEventProducer'
import { UnidocEvent } from '../../../sources/event/UnidocEvent'
import { UnidocBuffer } from '../../../sources/buffer/UnidocBuffer'
import { UnidocReductionInput } from '../../../sources/compilation/reduction/UnidocReductionInput'
import { reduce } from '../../../sources/compilation/reduction/common/reduce'
import { nextTag } from '../../../sources/compilation/reduction/common/nextTag'

describe('nextTag', function() {
  it('skip a the content until it get to the next available tag', function() {
    const eventStream: TrackedUnidocEventProducer = new TrackedUnidocEventProducer()
    const eventBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(eventStream, UnidocEvent.ALLOCATOR)

    eventStream.produceText('Lorem ipsum dolor sit amet ')
    eventStream.produceWhitespace('   \n\r  ')
    eventStream.produceTagStart('strong')
    eventStream.produceText('consequetur.')
    eventStream.produceTagEnd('strong')

    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      for (const event of eventBuffer) {
        yield UnidocReductionInput.event(event)
      }
      yield UnidocReductionInput.END
    }

    expect(
      reduce.iterator(content(), nextTag()).isStartOfTag('strong')
    ).toBeTruthy()
  })

  it('return the end event if there is no available tag', function() {
    function* content(): Generator<UnidocReductionInput> {
      yield UnidocReductionInput.START
      yield UnidocReductionInput.END
    }

    expect(reduce.iterator(content(), nextTag()).isEnd()).toBeTruthy()
  })
})
