export type StreamTree = StreamTree.Node<StreamTree.Node<any>[]>

export namespace StreamTree {
  export type Node<T> = {
    tag: string,
    identifier: string | undefined,
    classes: string[],
    content: T
  }
}
