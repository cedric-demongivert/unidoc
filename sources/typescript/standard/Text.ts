import { Emphasize } from './Emphasize'

export namespace Text {
  export namespace Raw {
    /**
    * Configure a unidoc query
    */
    export function query (this : any) : void {
      this.oneOrMore(function (this : any) : void {
        this.any(function (this : any) : void {
          this.word()
          this.whitespace()
        })
      })
    }
  }

  export function query (this : any) : void {
    this.oneOrMore(function (this : any) : void {
      this.any(function (this : any) : void {
        this.query(Text.Raw.query)
        this.query(Emphasize.Text.query)
      })
    })
  }
}
