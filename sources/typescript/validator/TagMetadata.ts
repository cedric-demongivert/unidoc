import { UnidocAssertion } from '../assertion/UnidocAssertion'
import { UnidocAssertion as Assert } from '../assertion/UnidocAssertion'
import { StandardErrorFormatter } from '../standard/StandardErrorFormatters'

import { UnidocValidator } from './UnidocValidator'
import { AssertionValidator } from './AssertionValidator'
import { ConditionalValidator } from './ConditionalValidator'

export class TagMetadata {
  public readonly allowedTags : Set<string>
  public allowWords : boolean
  public allowWhitespaces : boolean
  public readonly composition : Map<string, TagMetadata.Composition>
  public readonly validations : TagMetadata.SubValidation[]
  public readonly assertions : TagMetadata.Assertion[]

  public constructor () {
    this.allowedTags = new Set<string>()
    this.allowWords = false
    this.allowWhitespaces = true
    this.composition = new Map<string, TagMetadata.Composition>()
    this.validations = []
    this.assertions = []
  }

  public configureConditionalValidator (validator : ConditionalValidator) : void {
    for (const validation of this.validations) {
      validator.whenTruthy(validation.assertion)
      validator.thenValidateUsing(validation.validator)
    }
  }

  public configureAssertionValidator (validator : AssertionValidator) : void {
    if (this.allowedTags.size > 0) {
      validator.whenGoesFalsy(Assert.current(Assert.children(Assert.hasOnlyTagsOfType(this.allowedTags))))
      validator.thenEmit(StandardErrorFormatter.createForbiddenContentFormatter(this))
    } else {
      validator.whenGoesTruthy(Assert.current(Assert.children(UnidocAssertion.hasTagOfAnyType())))
      validator.thenEmit(StandardErrorFormatter.createForbiddenContentFormatter(this))
    }

    if (!this.allowWords) {
      validator.whenGoesTruthy(Assert.current(Assert.children(UnidocAssertion.hasWord())))
      validator.thenEmit(StandardErrorFormatter.createForbiddenContentFormatter(this))
    }

    if (!this.allowWhitespaces) {
      validator.whenGoesTruthy(Assert.current(Assert.children(UnidocAssertion.hasWhitespace())))
      validator.thenEmit(StandardErrorFormatter.createForbiddenContentFormatter(this))
    }

    for (const assertion of this.assertions) {
      validator.whenGoesTruthy(assertion.assertion)
      validator.thenEmit(assertion.consequence)
    }
  }

  public mayHaveMany (type : string) : void {
    this.allowedTags.add(type)
    this.composition.set(type, TagMetadata.composition(0, Number.POSITIVE_INFINITY))
  }

  public mayHaveOne (type : string) : void {
    this.allowedTags.add(type)
    this.composition.set(type, TagMetadata.composition(0, 1))
  }

  public mustHaveOne (type : string) : void {
    this.allowedTags.add(type)
    this.composition.set(type, TagMetadata.composition(1, 1))
  }

  public mustHave (quantity : number) : any {
    const composition : Map<string, TagMetadata.Composition> = this.composition

    return {
      tag (type : string) : void {
        composition.get(type)[0] = quantity
        composition.get(type)[1] = quantity
      }
    }
  }

  public validateAllTag (type : string) : any {
    const validations : TagMetadata.SubValidation[] = this.validations

    return {
      using (validator : UnidocValidator) : void {
        validations.push({
          assertion: UnidocAssertion.current(UnidocAssertion.children(
              UnidocAssertion.inTagOfType(type)
          )),
          validator
        })
      }
    }
  }

  public mustNotHaveMoreThanOneTag (type : string) : void {
    this.composition.get(type)[1] = 1
  }

  public mustNotHaveMoreThan (maximum : number) : any {
    const composition : Map<string, TagMetadata.Composition> = this.composition

    return {
      tag (type : string) : void {
        composition.get(type)[1] = maximum
      }
    }
  }

  public mustNotHaveLessThanOne (type : string) : void {
    this.composition.get(type)[0] = 1
  }

  public mustNotHaveLessThan (minimum : number) : any {
    const composition : Map<string, TagMetadata.Composition> = this.composition

    return {
      tag (type : string) : void {
        composition.get(type)[0] = minimum
      }
    }
  }

  public doesAllowWords () : void {
    this.allowWords = true
  }

  public doesNotAllowWords () : void {
    this.allowWords = false
  }

  public doesAllowWhitespaces () : void {
    this.allowWhitespaces = true
  }

  public doesNotAllowWhitespaces () : void {
    this.allowWhitespaces = false
  }

  public if (assertion : UnidocAssertion) : any {
    const assertions : TagMetadata.Assertion[] = this.assertions

    return {
      then (consequence : AssertionValidator.Consequence) : void {
        assertions.push({ assertion, consequence })
      }
    }
  }

  public ifTagIsNotFirst (type : string) : any {
    return this.if(UnidocAssertion.then(
      UnidocAssertion.current(UnidocAssertion.children(UnidocAssertion.or(
        UnidocAssertion.hasWord(),
        UnidocAssertion.and(
          UnidocAssertion.hasTagOfAnyType(),
          UnidocAssertion.not(UnidocAssertion.hasTagOfType(type))
        )
      ))),
      UnidocAssertion.current(UnidocAssertion.children(
        UnidocAssertion.hasTagOfType(type)
      ))
    ))
  }
}

export namespace TagMetadata {
  export type Composition = { minimum: number, maximum: number }
  export type SubValidation = { assertion: UnidocAssertion, validator: UnidocValidator }
  export type Assertion = { assertion: UnidocAssertion, consequence: AssertionValidator.Consequence }

  export function composition (minimum : number, maximum : number) : Composition {
    return { minimum, maximum }
  }
}
