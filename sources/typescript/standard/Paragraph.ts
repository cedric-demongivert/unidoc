import { UnidocValidator } from '../validator/UnidocValidator'
import { TreeValidator } from '../validator/TreeValidator'
import { Rule } from '../validator/Rule'

import { Title } from './Title'

export namespace Paragraph {
  export const TAG : string = 'paragraph'


  export function validator () : UnidocValidator {
    const builder : any = null

    builder.starting(TAG)
           .then()
           .any(function (builder) {
             builder.query(Title.QUERY)
             builder.text()
             builder.space()
           })


    return validator
  }
}
