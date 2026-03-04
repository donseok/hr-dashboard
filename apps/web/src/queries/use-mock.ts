/**
 * Mock/API toggle utility.
 * When NEXT_PUBLIC_USE_MOCK=true (or unset), dashboard hooks return mock data.
 * When NEXT_PUBLIC_USE_MOCK=false, they call the real GraphQL API.
 */

export const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
