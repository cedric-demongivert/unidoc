import '../../jest/sequence'

import { UnidocRuntimeEventProducer } from '../../../sources/event/UnidocRuntimeEventProducer'
import { UnidocValidationEvent } from '../../../sources/validation/UnidocValidationEvent'
import { UnidocValidationEventProducer } from '../../../sources/validation/UnidocValidationEventProducer'
import { UnidocValidationMessageBuilder } from '../../../sources/validation/UnidocValidationMessageBuilder'
import { UnidocBlueprint } from '../../../sources/blueprint/UnidocBlueprint'
import { UnidocBuffer } from '../../../sources/buffer/UnidocBuffer'
import { UnidocEvent } from '../../../sources/event/UnidocEvent'
import { UnidocValidator } from '../../../sources/validator/UnidocValidator'
import { UnidocKissValidator } from '../../../sources/validator/kiss/UnidocKissValidator'

import { ExpectedContent } from '../../../sources/validator/message/ExpectedContent'

describe('UnidocKissValidator.validateEnd', function () {
  const messageBuilder: UnidocValidationMessageBuilder = new UnidocValidationMessageBuilder()

  it('accept the end of the unidoc document', function () {
    const input: UnidocRuntimeEventProducer = new UnidocRuntimeEventProducer()

    const validator: UnidocValidator = UnidocValidator.kiss(UnidocKissValidator.validateEnd)
    const validatorBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(validator, UnidocValidationEvent.ALLOCATOR)

    validator.subscribe(input)

    input.start().success()

    const expectation: UnidocValidationEventProducer = new UnidocValidationEventProducer()
    const expectationBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(expectation, UnidocValidationEvent.ALLOCATOR)

    expectation.produceDocumentCompletion()

    expect(validatorBuffer).toEqualTheSequence(expectationBuffer)
  })

  it('emit an error if the given event is not the end of the document', function () {
    const input: UnidocRuntimeEventProducer = new UnidocRuntimeEventProducer()
    const inputBuffer: UnidocBuffer<UnidocEvent> = UnidocBuffer.bufferize(input, UnidocEvent.ALLOCATOR)

    const validator: UnidocValidator = UnidocValidator.kiss(UnidocKissValidator.validateEnd)
    const validatorBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(validator, UnidocValidationEvent.ALLOCATOR)

    validator.subscribe(input)

    input.start()
      .produceTagStart('document')
      .produceText('lorem ipsum dolor sit amet')
      .produceTagEnd('document')
      .success()

    const expectation: UnidocValidationEventProducer = new UnidocValidationEventProducer()
    const expectationBuffer: UnidocBuffer<UnidocValidationEvent> = UnidocBuffer.bufferize(expectation, UnidocValidationEvent.ALLOCATOR)

    expectation.produceValidation(inputBuffer.get(0))
    expectation.produceMessage(
      messageBuilder
        .setType(ExpectedContent.TYPE)
        .setCode(ExpectedContent.CODE)
        .setData(ExpectedContent.Data.BLUEPRINT, UnidocBlueprint.end())
        .build()
    )

    expect(validatorBuffer).toEqualTheSequence(expectationBuffer)
  })
})
