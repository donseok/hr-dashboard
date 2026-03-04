'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { ChartContainer } from '../ChartContainer';
import { chartColorPalette, colors } from '@hr-dashboard/design-tokens';

export interface TimelineEvent {
  id: string;
  date: string;
  label: string;
  description?: string;
  category: string;
  icon?: string;
}

export interface InteractiveTimelineProps {
  title: string;
  subtitle?: string;
  events: TimelineEvent[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  onDataClick?: (event: TimelineEvent) => void;
  className?: string;
}

export function InteractiveTimeline({
  title,
  subtitle,
  events,
  height = 300,
  isLoading = false,
  error = null,
  onDataClick,
  className,
}: InteractiveTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; event: TimelineEvent } | null>(null);

  const draw = useCallback(() => {
    if (!svgRef.current || !containerRef.current || events.length === 0) return;

    const width = containerRef.current.clientWidth;
    const margin = { top: 20, right: 30, bottom: 40, left: 30 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const timelineY = innerH / 2;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const categories = [...new Set(events.map((e) => e.category))];
    const catColor = new Map(categories.map((c, i) => [c, chartColorPalette[i % chartColorPalette.length]]));

    const dates = events.map((e) => new Date(e.date));
    const xScale = d3.scaleTime()
      .domain([d3.min(dates)!, d3.max(dates)!])
      .range([0, innerW]);

    // Timeline axis
    g.append('line')
      .attr('x1', 0)
      .attr('y1', timelineY)
      .attr('x2', innerW)
      .attr('y2', timelineY)
      .attr('stroke', colors.neutral[300])
      .attr('stroke-width', 2);

    // Time axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(Math.min(events.length, 8))
      .tickFormat((d) => d3.timeFormat('%Y.%m')(d as Date));

    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(xAxis)
      .selectAll('text')
      .attr('font-size', 10)
      .attr('fill', colors.neutral[500]);

    g.selectAll('.domain').attr('stroke', colors.neutral[200]);
    g.selectAll('.tick line').attr('stroke', colors.neutral[200]);

    // Events
    const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach((event, i) => {
      const x = xScale(new Date(event.date));
      const isAbove = i % 2 === 0;
      const stemHeight = 30 + (i % 3) * 15;
      const dotY = timelineY;
      const stemEnd = isAbove ? dotY - stemHeight : dotY + stemHeight;

      // Stem
      g.append('line')
        .attr('x1', x)
        .attr('y1', dotY)
        .attr('x2', x)
        .attr('y2', stemEnd)
        .attr('stroke', catColor.get(event.category) || colors.neutral[400])
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '3,2');

      // Dot on timeline
      g.append('circle')
        .attr('cx', x)
        .attr('cy', dotY)
        .attr('r', 5)
        .attr('fill', catColor.get(event.category) || colors.primary.DEFAULT)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseover', (e) => {
          d3.select(e.currentTarget).transition().attr('r', 8);
          const rect = containerRef.current!.getBoundingClientRect();
          setTooltip({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top - 10,
            event,
          });
        })
        .on('mouseout', (e) => {
          d3.select(e.currentTarget).transition().attr('r', 5);
          setTooltip(null);
        })
        .on('click', () => onDataClick?.(event));

      // Label
      g.append('text')
        .attr('x', x)
        .attr('y', stemEnd + (isAbove ? -6 : 14))
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('font-weight', 500)
        .attr('fill', colors.neutral[700])
        .text(event.label.length > 12 ? event.label.slice(0, 12) + '...' : event.label);

      // Date label
      g.append('text')
        .attr('x', x)
        .attr('y', stemEnd + (isAbove ? -18 : 26))
        .attr('text-anchor', 'middle')
        .attr('font-size', 9)
        .attr('fill', colors.neutral[400])
        .text(d3.timeFormat('%m.%d')(new Date(event.date)));
    });

    // Legend
    const legendG = g.append('g').attr('transform', `translate(0, -10)`);
    categories.forEach((cat, i) => {
      const lx = i * 100;
      legendG.append('circle').attr('cx', lx).attr('cy', 0).attr('r', 4).attr('fill', catColor.get(cat)!);
      legendG.append('text')
        .attr('x', lx + 8)
        .attr('y', 0)
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 10)
        .attr('fill', colors.neutral[500])
        .text(cat);
    });
  }, [events, height, onDataClick]);

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
      isEmpty={events.length === 0}
      className={className}
    >
      <div ref={containerRef} style={{ width: '100%', height, position: 'relative' }}>
        <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
        {tooltip && (
          <div
            className="absolute z-50 pointer-events-none rounded-md bg-neutral-900 text-white px-3 py-2 text-xs shadow-lg"
            style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}
          >
            <p className="font-semibold">{tooltip.event.label}</p>
            <p className="text-neutral-300">{new Date(tooltip.event.date).toLocaleDateString('ko-KR')}</p>
            {tooltip.event.description && (
              <p className="text-neutral-400 mt-1">{tooltip.event.description}</p>
            )}
          </div>
        )}
      </div>
    </ChartContainer>
  );
}
