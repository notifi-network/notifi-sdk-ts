export type PageInfo = Readonly<{
  hasNextPage: boolean;
  endCursor: string;
}>;

export type Connection<TNode> = Readonly<{
  pageInfo: PageInfo;
  nodes: ReadonlyArray<TNode>;
}>;
