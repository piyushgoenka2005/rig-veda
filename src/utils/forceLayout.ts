import { forceSimulation, forceManyBody, forceLink, forceCollide, forceCenter, forceX, forceY } from 'd3-force';

export interface GraphNode {
  id: string;
  category: string;
  size: number;
}

export interface GraphLink {
  source: string;
  target: string;
  strength: number; // 0..1
}

export interface PositionMap {
  [id: string]: { x: number; y: number; z: number };
}

type CategoryCenters = { [category: string]: { x: number; y: number } };

function buildCategoryCenters(categories: string[], radius = 6): CategoryCenters {
  const unique = Array.from(new Set(categories));
  const centers: CategoryCenters = {};
  unique.forEach((cat, idx) => {
    const angle = (idx / unique.length) * Math.PI * 2;
    centers[cat] = {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  });
  return centers;
}

export function computeForceLayout(
  nodes: GraphNode[],
  links: GraphLink[],
  persisted?: PositionMap,
  iterations: number = 300
): PositionMap {
  if (nodes.length === 0) return {};

  const nodeIndex: { [id: string]: number } = {};
  nodes.forEach((n, i) => (nodeIndex[n.id] = i));

  const simNodes = nodes.map((n) => ({
    id: n.id,
    fx: undefined as number | undefined,
    fy: undefined as number | undefined,
    x: persisted?.[n.id]?.x ?? (Math.random() - 0.5) * 10,
    y: persisted?.[n.id]?.y ?? (Math.random() - 0.5) * 10
  }));

  const simLinks = links
    .filter((l) => nodeIndex[l.source] !== undefined && nodeIndex[l.target] !== undefined)
    .map((l) => ({ source: l.source, target: l.target, strength: l.strength }));

  const categories = nodes.map((n) => n.category);
  const centers = buildCategoryCenters(categories);

  const simulation = forceSimulation(simNodes as any)
    .force('charge', forceManyBody().strength(-40))
    .force('collision', forceCollide().radius((d: any) => 12))
    .force('link', forceLink(simLinks as any)
      .id((d: any) => d.id)
      .distance((l: any) => 30 + (1 - (l.strength ?? 0.5)) * 50)
      .strength((l: any) => 0.1 + (l.strength ?? 0.5) * 0.9))
    .force('center', forceCenter(0, 0))
    .alpha(1)
    .alphaDecay(1 - Math.pow(0.001, 1 / iterations));

  // Clustering via gentle pulls toward category centers
  const forceTowardsCategoryX = forceX((d: any) => centers[nodes[nodeIndex[d.id]].category].x).strength(0.03);
  const forceTowardsCategoryY = forceY((d: any) => centers[nodes[nodeIndex[d.id]].category].y).strength(0.03);
  simulation.force('clusterX', forceTowardsCategoryX);
  simulation.force('clusterY', forceTowardsCategoryY);

  for (let i = 0; i < iterations; i++) simulation.tick();
  simulation.stop();

  const out: PositionMap = {};
  simNodes.forEach((n) => {
    out[n.id] = { x: n.x as number, y: n.y as number, z: 0 };
  });

  return out;
}

export function loadPersistedPositions(key: string): PositionMap | undefined {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as PositionMap) : undefined;
  } catch {
    return undefined;
  }
}

export function persistPositions(key: string, positions: PositionMap) {
  try {
    localStorage.setItem(key, JSON.stringify(positions));
  } catch {}
}


