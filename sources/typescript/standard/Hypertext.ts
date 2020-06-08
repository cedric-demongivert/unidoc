export namespace Text {
  export function query (this : any) : void {
    this.oneOrMore(function (this : any) : void {
      this.any(function (this : any) : void {
        this.word()
        this.whitespace()
      })
    })
  }
}
