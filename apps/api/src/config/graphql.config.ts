import { registerAs } from '@nestjs/config';

export default registerAs('graphql', () => ({
  playground: process.env.GRAPHQL_PLAYGROUND === 'true' || process.env.NODE_ENV !== 'production',
  debug: process.env.NODE_ENV !== 'production',
  introspection: process.env.GRAPHQL_INTROSPECTION === 'true' || process.env.NODE_ENV !== 'production',
  path: process.env.GRAPHQL_PATH || '/graphql',
}));
