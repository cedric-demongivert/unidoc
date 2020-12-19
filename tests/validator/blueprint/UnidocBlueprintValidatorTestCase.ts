import { TrackedUnidocEventProducer } from '../../../sources/event/TrackedUnidocEventProducer'
import { UnidocValidationEvent } from '../../../sources/validation/UnidocValidationEvent'
import { UnidocValidationTreeManager } from '../../../sources/validation/UnidocValidationTreeManager'
import { UnidocValidationTrunkSelector } from '../../../sources/validation/UnidocValidationTrunkSelector'
import { UnidocBlueprintValidator } from '../../../sources/validator/blueprint/UnidocBlueprintValidator'
import { UnidocBlueprint } from '../../../sources/blueprint/UnidocBlueprint'
import { UnidocBuffer } from '../../../sources/buffer/UnidocBuffer'
import { UnidocEvent } from '../../../sources/event/UnidocEvent'

export class UnidocBlueprintValidatorTestCase {
  public readonly validator: UnidocBlueprintValidator
  public readonly validatorBuffer: UnidocBuffer<UnidocValidationEvent>
  public readonly selector: UnidocValidationTrunkSelector
  public readonly selectorBuffer: UnidocBuffer<UnidocValidationEvent>
  public readonly input: TrackedUnidocEventProducer
  public readonly inputBuffer: UnidocBuffer<UnidocEvent>
  public readonly expectation: UnidocValidationTreeManager
  public readonly expectationBuffer: UnidocBuffer<UnidocValidationEvent>

  public constructor() {
    this.validator = new UnidocBlueprintValidator()
    this.validatorBuffer = UnidocBuffer.bufferize(this.validator, UnidocValidationEvent.ALLOCATOR)
    this.selector = new UnidocValidationTrunkSelector()
    this.selectorBuffer = UnidocBuffer.bufferize(this.selector, UnidocValidationEvent.ALLOCATOR)
    this.input = new TrackedUnidocEventProducer()
    this.inputBuffer = UnidocBuffer.bufferize(this.input, UnidocEvent.ALLOCATOR)
    this.expectation = new UnidocValidationTreeManager()
    this.expectationBuffer = UnidocBuffer.bufferize(this.expectation, UnidocValidationEvent.ALLOCATOR)

    this.validator.subscribe(this.input)
    this.selector.subscribe(this.validator)
  }

  public execute(blueprint: UnidocBlueprint): void {
    this.validator.execute(blueprint)
  }
}
