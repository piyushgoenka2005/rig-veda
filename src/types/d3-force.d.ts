declare module 'd3-force' {
  export interface Simulation<NodeDatum> {
    nodes(nodesData: NodeDatum[]): this;
    nodes(): NodeDatum[];
    alpha(alpha: number): this;
    alpha(): number;
    alphaTarget(target: number): this;
    alphaTarget(): number;
    alphaDecay(decay: number): this;
    alphaDecay(): number;
    velocityDecay(decay: number): this;
    velocityDecay(): number;
    force(name: string): Force<NodeDatum, any> | undefined;
    force(name: string, force: Force<NodeDatum, any> | null): this;
    find(x: number, y: number, radius?: number): NodeDatum | undefined;
    on(typenames: string, listener: (event: SimulationNodeDatum) => void): this;
    on(typenames: string, listener: null): this;
    restart(): this;
    stop(): this;
    tick(iterations?: number): void;
  }

  export interface SimulationNodeDatum {
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    fx?: number | null;
    fy?: number | null;
    index?: number;
  }

  export interface Force<NodeDatum, LinkDatum> {
    (alpha: number): void;
    initialize?(nodes: NodeDatum[], random: () => number): void;
  }

  export interface ForceLink<LinkDatum> extends Force<any, LinkDatum> {
    id(value: (d: LinkDatum) => string | number): this;
    id(): (d: LinkDatum) => string | number;
    distance(value: number | ((link: LinkDatum, i: number, links: LinkDatum[]) => number)): this;
    distance(): (link: LinkDatum) => number;
    strength(value: number | ((link: LinkDatum, i: number, links: LinkDatum[]) => number)): this;
    strength(): (link: LinkDatum) => number;
    iterations(value: number): this;
    iterations(): number;
  }

  export interface ForceManyBody<NodeDatum> extends Force<NodeDatum, any> {
    strength(value: number | ((d: NodeDatum, i: number, data: NodeDatum[]) => number)): this;
    strength(): (d: NodeDatum) => number;
    theta(value: number): this;
    theta(): number;
    distanceMin(value: number): this;
    distanceMin(): number;
    distanceMax(value: number): this;
    distanceMax(): number;
  }

  export interface ForceCollide<NodeDatum> extends Force<NodeDatum, any> {
    radius(value: number | ((d: NodeDatum, i: number, data: NodeDatum[]) => number)): this;
    radius(): (d: NodeDatum) => number;
    strength(value: number): this;
    strength(): number;
    iterations(value: number): this;
    iterations(): number;
  }

  export interface ForceCenter<NodeDatum> extends Force<NodeDatum, any> {
    x(value: number): this;
    x(): number;
    y(value: number): this;
    y(): number;
    strength(value: number): this;
    strength(): number;
  }

  export interface ForceX<NodeDatum> extends Force<NodeDatum, any> {
    x(value: number | ((d: NodeDatum, i: number, data: NodeDatum[]) => number)): this;
    x(): (d: NodeDatum) => number;
    strength(value: number | ((d: NodeDatum, i: number, data: NodeDatum[]) => number)): this;
    strength(): (d: NodeDatum) => number;
  }

  export interface ForceY<NodeDatum> extends Force<NodeDatum, any> {
    y(value: number | ((d: NodeDatum, i: number, data: NodeDatum[]) => number)): this;
    y(): (d: NodeDatum) => number;
    strength(value: number | ((d: NodeDatum, i: number, data: NodeDatum[]) => number)): this;
    strength(): (d: NodeDatum) => number;
  }

  export function forceSimulation<NodeDatum extends SimulationNodeDatum>(
    nodesData?: NodeDatum[]
  ): Simulation<NodeDatum>;

  export function forceLink<LinkDatum>(
    links?: LinkDatum[]
  ): ForceLink<LinkDatum>;

  export function forceManyBody<NodeDatum>(): ForceManyBody<NodeDatum>;

  export function forceCollide<NodeDatum>(
    radius?: number | ((d: NodeDatum, i: number, data: NodeDatum[]) => number)
  ): ForceCollide<NodeDatum>;

  export function forceCenter<NodeDatum>(
    x?: number,
    y?: number
  ): ForceCenter<NodeDatum>;

  export function forceX<NodeDatum>(
    x?: number | ((d: NodeDatum, i: number, data: NodeDatum[]) => number)
  ): ForceX<NodeDatum>;

  export function forceY<NodeDatum>(
    y?: number | ((d: NodeDatum, i: number, data: NodeDatum[]) => number)
  ): ForceY<NodeDatum>;
}

