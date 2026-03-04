export const breakpoints = {
  mobile: 375,
  tablet: 768,
  desktop: 1280,
  wide: 1536,
} as const;

export type BreakpointToken = typeof breakpoints;

export const mediaQueries = {
  mobile: `(min-width: ${breakpoints.mobile}px)`,
  tablet: `(min-width: ${breakpoints.tablet}px)`,
  desktop: `(min-width: ${breakpoints.desktop}px)`,
  wide: `(min-width: ${breakpoints.wide}px)`,
} as const;
