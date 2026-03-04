'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { ChartContainer } from './ChartContainer';
import { chartColorPalette, colors } from '@hr-dashboard/design-tokens';

export interface WordCloudWord {
  text: string;
  weight: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface WordCloudProps {
  title: string;
  subtitle?: string;
  words: WordCloudWord[];
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  maxFontSize?: number;
  minFontSize?: number;
  colorBySentiment?: boolean;
  onDataClick?: (word: WordCloudWord) => void;
  className?: string;
}

const sentimentColors = {
  positive: '#22C55E',
  negative: '#EF4444',
  neutral: '#64748B',
};

export function WordCloud({
  title,
  subtitle,
  words,
  height = 350,
  isLoading = false,
  error = null,
  maxFontSize = 48,
  minFontSize = 12,
  colorBySentiment = false,
  onDataClick,
  className,
}: WordCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const sortedWords = useMemo(
    () => [...words].sort((a, b) => b.weight - a.weight).slice(0, 80),
    [words],
  );

  const maxWeight = useMemo(() => Math.max(...sortedWords.map((w) => w.weight), 1), [sortedWords]);
  const minWeight = useMemo(() => Math.min(...sortedWords.map((w) => w.weight), 0), [sortedWords]);

  const getFontSize = useCallback(
    (weight: number) => {
      const range = maxWeight - minWeight || 1;
      const normalized = (weight - minWeight) / range;
      return minFontSize + normalized * (maxFontSize - minFontSize);
    },
    [maxWeight, minWeight, maxFontSize, minFontSize],
  );

  const getColor = useCallback(
    (word: WordCloudWord, index: number) => {
      if (colorBySentiment && word.sentiment) {
        return sentimentColors[word.sentiment];
      }
      return chartColorPalette[index % chartColorPalette.length];
    },
    [colorBySentiment],
  );

  const getOpacity = useCallback(
    (weight: number) => {
      const range = maxWeight - minWeight || 1;
      return 0.5 + ((weight - minWeight) / range) * 0.5;
    },
    [maxWeight, minWeight],
  );

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      isLoading={isLoading}
      error={error}
      isEmpty={words.length === 0}
      className={className}
    >
      <div
        ref={containerRef}
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 overflow-hidden p-4"
        style={{ height, alignContent: 'center' }}
      >
        {sortedWords.map((word, i) => {
          const fontSize = getFontSize(word.weight);
          const color = getColor(word, i);
          const opacity = getOpacity(word.weight);

          return (
            <span
              key={`${word.text}-${i}`}
              className="inline-block transition-all duration-200 hover:scale-110 select-none"
              style={{
                fontSize: `${fontSize}px`,
                color,
                opacity,
                fontWeight: fontSize > 30 ? 700 : fontSize > 20 ? 600 : 400,
                cursor: onDataClick ? 'pointer' : 'default',
                lineHeight: 1.1,
              }}
              onClick={() => onDataClick?.(word)}
              title={`${word.text}: ${word.weight}`}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </ChartContainer>
  );
}
