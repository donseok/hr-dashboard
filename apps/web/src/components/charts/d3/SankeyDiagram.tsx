'use client';

import { useRef, useEffect, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal, type SankeyNode, type SankeyLink } from 'd3-sankey';
import { ChartContainer } from '../ChartContainer';
import { chartColorPalette, colors } from '@hr-dashboard/design-tokens';

export interface SankeyNodeData {
  id: string;
  name: string;
  group?: string;
}

export interface SankeyLinkData {
  source: string;
  target: string;
  value: number;
}

export interface SankeyDiagramProps {
  title: string;
  subtitle?: string;
  nodes: SankeyNodeData[];
  links: SankeyLinkData[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  onDataClick?: (type: 'node' | 'link', data: SankeyNodeData | SankeyLinkData) => void;
  className?: string;
}

export function SankeyDiagram({
  title,
  subtitle,
  nodes,
  links,
  height = 400,
  isLoading = false,
  error = null,
  onDataClick,
  className,
}: SankeyDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nodeIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    nodes.forEach((n, i) => map.set(n.id, i));
    return map;
  }, [nodes]);

  const draw = useCallback(() => {
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

    const width = containerRef.current.clientWidth;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const sankeyGen = d3Sankey<{}, {}>()
      .nodeId((d: any) => d.id)
      .nodeWidth(18)
      .nodePadding(12)
      .extent([[0, 0], [innerW, innerH]]);

    const sankeyData = sankeyGen({
      nodes: nodes.map((n) => ({ ...n })),
      links: links.map((l) => ({
        source: l.source,
        target: l.target,
        value: l.value,
      })),
    } as any);

    const groups = [...new Set(nodes.map((n) => n.group || 'default'))];
    const groupColor = new Map(groups.map((g, i) => [g, chartColorPalette[i % chartColorPalette.length]]));

    // Links
    g.append('g')
      .attr('fill', 'none')
      .selectAll('path')
      .data(sankeyData.links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', (d: any) => {
        const srcNode = nodes.find((n) => n.id === (typeof d.source === 'object' ? d.source.id : d.source));
        return groupColor.get(srcNode?.group || 'default') || colors.neutral[300];
      })
      .attr('stroke-width', (d: any) => Math.max(1, d.width))
      .attr('stroke-opacity', 0.3)
      .style('cursor', onDataClick ? 'pointer' : 'default')
      .on('mouseover', function () { d3.select(this).attr('stroke-opacity', 0.6); })
      .on('mouseout', function () { d3.select(this).attr('stroke-opacity', 0.3); })
      .on('click', (_, d: any) => {
        if (!onDataClick) return;
        const srcId = typeof d.source === 'object' ? d.source.id : d.source;
        const tgtId = typeof d.target === 'object' ? d.target.id : d.target;
        const link = links.find((l) => l.source === srcId && l.target === tgtId);
        if (link) onDataClick('link', link);
      })
      .append('title')
      .text((d: any) => {
        const srcId = typeof d.source === 'object' ? d.source.id : d.source;
        const tgtId = typeof d.target === 'object' ? d.target.id : d.target;
        const srcName = nodes.find((n) => n.id === srcId)?.name || srcId;
        const tgtName = nodes.find((n) => n.id === tgtId)?.name || tgtId;
        return `${srcName} → ${tgtName}: ${d.value}명`;
      });

    // Nodes
    const node = g.append('g')
      .selectAll('g')
      .data(sankeyData.nodes)
      .join('g')
      .style('cursor', onDataClick ? 'pointer' : 'default')
      .on('click', (_, d: any) => {
        if (!onDataClick) return;
        const nd = nodes.find((n) => n.id === d.id);
        if (nd) onDataClick('node', nd);
      });

    node.append('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('height', (d: any) => Math.max(1, d.y1 - d.y0))
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('fill', (d: any) => groupColor.get(d.group || 'default') || colors.primary.DEFAULT)
      .attr('rx', 2);

    node.append('text')
      .attr('x', (d: any) => (d.x0 < innerW / 2 ? d.x1 + 6 : d.x0 - 6))
      .attr('y', (d: any) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => (d.x0 < innerW / 2 ? 'start' : 'end'))
      .attr('font-size', 11)
      .attr('fill', colors.neutral[700])
      .text((d: any) => d.name);
  }, [nodes, links, height, onDataClick, nodeIndexMap]);

  useEffect(() => {
    draw();
    const observer = new ResizeObserver(draw);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [draw]);

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      error={error}
      isEmpty={nodes.length === 0}
      className={className}
    >
      <div ref={containerRef} style={{ width: '100%', height }}>
        <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </ChartContainer>
  );
}
