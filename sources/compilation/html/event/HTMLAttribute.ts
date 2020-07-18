export type HTMLAttribute = string

export namespace HTMLAttribute {
  export const CLASS      : HTMLAttribute = 'class'
  export const IDENTIFIER : HTMLAttribute = 'id'

  export const ALL : HTMLAttribute[] = [
    CLASS,
    IDENTIFIER
  ]
}
