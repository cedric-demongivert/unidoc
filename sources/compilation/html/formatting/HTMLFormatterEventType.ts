export type HTMLFormatterEventType = string

export namespace HTMLFormatterEventType {
  export const CONTENT    : HTMLFormatterEventType = 'content'
  export const COMPLETION : HTMLFormatterEventType = 'completion'
  export const ERROR      : HTMLFormatterEventType = 'error'

  export const ALL        : HTMLFormatterEventType[] = [
    CONTENT, COMPLETION, ERROR
  ]
}
