import { Unisource } from '../Unisource'
import { Validator } from '../validation/Validator'

const source : Unisource = new Unisource()

source.fromString(require('../../../local/test.unidoc').default)
source.validate(new Validator())
