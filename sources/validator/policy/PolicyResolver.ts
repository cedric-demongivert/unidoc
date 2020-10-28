import { Policy } from '../../policy/Policy'

import { PolicyValidator } from './PolicyValidator'

export type PolicyResolver = (policy : Policy) => PolicyValidator
