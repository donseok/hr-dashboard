declare module 'd3-sankey' {
  import { SimulationNodeDatum } from 'd3';

  export interface SankeyNode<N, L> extends SimulationNodeDatum {
    x0?: number;
    x1?: number;
    y0?: number;
    y1?: number;
    sourceLinks?: SankeyLink<N, L>[];
    targetLinks?: SankeyLink<N, L>[];
    value?: number;
    depth?: number;
    height?: number;
    layer?: number;
    [key: string]: any;
  }

  export interface SankeyLink<N, L> {
    source: string | number | SankeyNode<N, L>;
    target: string | number | SankeyNode<N, L>;
    value: number;
    y0?: number;
    y1?: number;
    width?: number;
    [key: string]: any;
  }

  export interface SankeyGraph<N, L> {
    nodes: SankeyNode<N, L>[];
    links: SankeyLink<N, L>[];
  }

  export interface SankeyLayout<N, L> {
    (data: SankeyGraph<N, L>): SankeyGraph<N, L>;
    nodeId(): (node: SankeyNode<N, L>) => string | number;
    nodeId(id: (node: SankeyNode<N, L>) => string | number): this;
    nodeWidth(): number;
    nodeWidth(width: number): this;
    nodePadding(): number;
    nodePadding(padding: number): this;
    nodeSort(): ((a: SankeyNode<N, L>, b: SankeyNode<N, L>) => number) | null;
    nodeSort(sort: ((a: SankeyNode<N, L>, b: SankeyNode<N, L>) => number) | null): this;
    extent(): [[number, number], [number, number]];
    extent(extent: [[number, number], [number, number]]): this;
    size(): [number, number];
    size(size: [number, number]): this;
    iterations(): number;
    iterations(iterations: number): this;
  }

  export function sankey<N = {}, L = {}>(): SankeyLayout<N, L>;
  export function sankeyCenter<N, L>(node: SankeyNode<N, L>): number;
  export function sankeyLeft<N, L>(node: SankeyNode<N, L>): number;
  export function sankeyRight<N, L>(node: SankeyNode<N, L>): number;
  export function sankeyJustify<N, L>(node: SankeyNode<N, L>): number;
  export function sankeyLinkHorizontal(): (link: any) => string;
}
