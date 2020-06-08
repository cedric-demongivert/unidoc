import { UnidocValidator } from '../validator/UnidocValidator'
import { UnidocQueryBuilder } from '../query/builder/UnidocQueryBuilder'
import { UnidocQuery } from '../query/UnidocQuery'

import { Title } from './Title'
import { Query } from './Query'

export namespace Paragraph {
  export const TAG : string = 'paragraph'

  export function query (this : any) : void {
    this.zeroOrMore(function (this : any) { this.whitespace() })
        .fork(function (this : any) {
          this.query(Text.query)
              .fork(Title.query)

         this.tag(Title.query)
        })
        .merge()
  }

  export function tag (this : any) : void {
    this.until()
        .tag(TAG, paragraph)
  }
}
