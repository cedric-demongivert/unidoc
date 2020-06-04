import { UnidocValidator } from '../validator/UnidocValidator'
import { UnidocQueryBuilder } from '../query/builder/UnidocQueryBuilder'
import { UnidocQuery } from '../query/UnidocQuery'

import { Title } from './Title'

export namespace Paragraph {
  export const TAG : string = 'paragraph'

  export function query () : UnidocQuery {
    const query : UnidocQuery = new UnidocQuery()
    const builder : UnidocQueryBuilder = new UnidocQueryBuilder(query.input)

    builder.until()
           .entering(TAG)
           .loop(function () {
             this.whitespace()
           })
           .fork(function () {
             this.word()
                 .loop(function () {
                   this.whitespace()
                   this.word()
                 })

             this.entering(Title.TAG)
                 .loop(function () {
                   this.anything()
                 })
                 .exiting(Title.TAG)
           })

    return validator
  }
}
